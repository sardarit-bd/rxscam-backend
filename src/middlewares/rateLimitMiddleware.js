

// In-memory store
const ipStore = new Map();

const RATE_LIMIT = 3;
const WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours
const RETRY_AFTER = 86400; // seconds

function rateLimitMiddleware(req, res, next) {
    const ip = req.ip;
    const now = Date.now();

    if (!ipStore.has(ip)) {
        ipStore.set(ip, {
            count: 1,
            firstRequestTime: now,
        });
        return next();
    }

    const record = ipStore.get(ip);
    const timePassed = now - record.firstRequestTime;

    // If window expired → reset
    if (timePassed > WINDOW_MS) {
        ipStore.set(ip, {
            count: 1,
            firstRequestTime: now,
        });
        return next();
    }

    // If limit exceeded
    if (record.count >= RATE_LIMIT) {
        res.set("Retry-After", RETRY_AFTER.toString());
        return res.status(429).json({
            success: false,
            message: "Rate limit exceeded. Try again after 24 hours."
        });
    }

    // Increment count
    record.count += 1;
    ipStore.set(ip, record);

    next();
}

export default rateLimitMiddleware;