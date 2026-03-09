import dns from 'dns';
import { promisify } from 'util';
import net from 'net';

const lookup = promisify(dns.lookup);

class URLValidator {
    constructor() {
        // RFC 1918 private IP ranges
        this.privateRanges = [
            { start: '10.0.0.0', end: '10.255.255.255' },
            { start: '172.16.0.0', end: '172.31.255.255' },
            { start: '192.168.0.0', end: '192.168.255.255' },
        ];

        // Cloud metadata endpoints
        this.blockedIPs = [
            '169.254.169.254', // AWS/GCP/Azure metadata
            '100.100.100.200', // Alibaba metadata
        ];
    }

    validateURL(url) {
        try {
            // Check URL length
            if (url.length > 2048) {
                return { valid: false, error: 'URL too long' };
            }

            // Parse URL
            const parsed = new URL(url);

            // Check scheme
            if (!['http:', 'https:'].includes(parsed.protocol)) {
                return { valid: false, error: 'Invalid protocol' };
            }

            // Check if it's our own domain
            if (parsed.hostname.includes('scamrx.com')) {
                return { valid: false, error: 'Cannot scan ScamRx domain' };
            }

            return { valid: true, parsed };
        } catch {
            return { valid: false, error: 'Invalid URL format' };
        }
    }

    async checkSSRF(hostname) {
        try {
            const { address } = await lookup(hostname);

            // Check private IP ranges
            if (this.isPrivateIP(address)) {
                return { safe: false, reason: 'Private IP' };
            }

            // Check blocked IPs
            if (this.blockedIPs.includes(address)) {
                return { safe: false, reason: 'Blocked IP' };
            }

            return { safe: true, ip: address };
        } catch {
            return { safe: false, reason: 'DNS lookup failed' };
        }
    }

    isPrivateIP(ip) {
        if (!net.isIP(ip)) return false;

        const parts = ip.split('.').map(Number);

        // Check 10.x.x.x
        if (parts[0] === 10) return true;

        // Check 172.16.x.x - 172.31.x.x
        if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;

        // Check 192.168.x.x
        if (parts[0] === 192 && parts[1] === 168) return true;

        // Check loopback
        if (parts[0] === 127) return true;

        return false;
    }

    normalizeURL(url) {
        try {
            const parsed = new URL(url.toLowerCase());

            // Remove common tracking parameters
            const trackingParams = [
                'utm_source', 'utm_medium', 'utm_campaign',
                'utm_term', 'utm_content', 'fbclid', 'gclid',
            ];

            trackingParams.forEach(param => {
                if (parsed.searchParams.has(param)) {
                    parsed.searchParams.delete(param);
                }
            });

            return parsed.toString();
        } catch {
            return url;
        }
    }
}

export default new URLValidator();