import crypto from 'crypto';
import redisClient from '../../config/redis.js';
import UrlScan from '../../models/UrlScan.js';
import aiSummary from '../../services/aiSummary.js';
import googleWebRisk from '../../services/googleWebRisk.js';
import urlValidator from '../../utils/urlValidator.js';

class URLScannerController {
    async scanURL(req, res) {
        try {
            const { url, consent } = req.body;
            const clientIp = req.ip;

            // Check consent
            if (!consent) {
                return res.status(400).json({
                    error: 'missing_consent',
                    message: 'Please confirm your consent to proceed.',
                });
            }

            // Validate URL
            const validation = urlValidator.validateURL(url);
            if (!validation.valid) {
                return res.status(400).json({
                    error: 'invalid_url',
                    message: 'Please enter a valid URL starting with http:// or https://',
                });
            }

            // SSRF Protection
            const ssrfCheck = await urlValidator.checkSSRF(validation.parsed.hostname);
            if (!ssrfCheck.safe) {
                return res.status(400).json({
                    error: 'invalid_url',
                    message: 'That URL cannot be scanned.',
                });
            }

            // Rate limiting
            const rateLimit = await this.checkRateLimit(clientIp);
            if (!rateLimit.allowed) {
                return res.status(429).json({
                    error: 'rate_limited',
                    retry_after: rateLimit.retryAfter,
                    message: 'You have reached the free scan limit. Upgrade to ScamRx for unlimited scanning.',
                });
            }

            // Normalize URL
            const normalizedUrl = urlValidator.normalizeURL(url);
            const urlHash = crypto
                .createHash('sha256')
                .update(normalizedUrl)
                .digest('hex');

            // Check cache
            const cached = await redisClient.get(`urlscan:${urlHash}`);
            if (cached) {
                return res.json({
                    ...JSON.parse(cached),
                    cached: true,
                });
            }

            // Check with Google Web Risk
            const gwrResult = await googleWebRisk.checkUrl(normalizedUrl);

            // Generate AI summary
            const aiResult = await aiSummary.generateSummary(
                validation.parsed.hostname,
                gwrResult
            );

            // Build response
            const scanResult = this.buildResponse({
                url,
                normalizedUrl,
                gwrResult,
                aiResult,
            });

            // Store in cache
            const ttl = this.calculateCacheTTL(gwrResult);
            await redisClient.setex(
                `urlscan:${urlHash}`,
                ttl,
                JSON.stringify(scanResult)
            );

            // Save to database (without URL)
            await UrlScan.create({
                scanId: scanResult.scan_id,
                urlHash,
                verdict: scanResult.verdict,
                aiResult: { ...aiResult, ai_summary: undefined },
                ipCountry: req.headers['cf-ipcountry'] || 'unknown',
                timestamp: new Date(),
            });

            res.json(scanResult);
        } catch (error) {
            console.error('URL scan error:', error);

            if (error.message.includes('Google Web Risk')) {
                return res.status(503).json({
                    error: 'scan_unavailable',
                    message: 'The URL scanner is temporarily unavailable. Please try again in a moment.',
                });
            }

            res.status(500).json({
                error: 'internal_error',
                message: 'An unexpected error occurred.',
            });
        }
    }

    async checkRateLimit(ip) {
        const key = `ratelimit:url:${ip}`;
        const burstKey = `ratelimit:burst:${ip}`;

        // Check burst limit (1 per 10 seconds)
        const burst = await redisClient.incr(burstKey);
        if (burst === 1) {
            await redisClient.expire(burstKey, 10);
        }
        if (burst > 1) {
            return { allowed: false, retryAfter: 10 };
        }

        // Check daily limit (5 per 24 hours)
        const count = await redisClient.incr(key);
        if (count === 1) {
            await redisClient.expire(key, 86400);
        }

        if (count > 100) {
            return { allowed: false, retryAfter: 86400 };
        }

        return { allowed: true };
    }

    calculateCacheTTL(gwrResult) {
        if (!gwrResult.expireTime) return 3600; // 1 hour default

        const expiry = new Date(gwrResult.expireTime).getTime();
        const now = Date.now();
        const secondsUntilExpiry = Math.floor((expiry - now) / 1000);

        return Math.min(3600, Math.max(0, secondsUntilExpiry));
    }

    buildResponse({ url, normalizedUrl, gwrResult, aiResult }) {
        const isThreat = gwrResult.isThreat;
        const threatTypes = gwrResult.threatTypes || [];

        // Determine badge color
        let badgeColor = '#22C55E'; // green
        if (isThreat) {
            badgeColor = threatTypes.includes('SOCIAL_ENGINEERING') ? '#CC2200' : '#F97316';
        }

        return {
            scan_id: `us_${crypto.randomBytes(6).toString('hex')}`,
            url_display: url,
            url_domain: new URL(normalizedUrl).hostname,
            scanned_at: new Date().toISOString(),
            cached: false,

            verdict: {
                label: aiResult.ai_verdict,
                is_threat: isThreat,
                threat_types: threatTypes,
                badge_color: badgeColor,
                gwr_expire_time: gwrResult.expireTime,
            },

            ai_analysis: {
                ai_verdict: aiResult.ai_verdict,
                ai_summary: aiResult.ai_summary,
                ai_actions: aiResult.ai_actions,
                ai_model_used: aiResult.fallbackUsed ? 'gpt-4o' : 'claude-3-sonnet',
                ai_fallback_used: aiResult.fallbackUsed || false,
            },
        };
    }
}

export default new URLScannerController();