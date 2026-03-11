import Redis from 'ioredis';

// Redis connection configuration
const redisClient = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || '',
    retryStrategy: (times) => {
        // Retry up to 3 times with exponential backoff
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
    maxRetriesPerRequest: 3,
});

redisClient.on('connect', () => {
    console.log('✅ Redis connected successfully');
});

redisClient.on('error', (error) => {
    console.error('❌ Redis connection error:', error);
});

// Helper functions for rate limiting
redisClient.checkRateLimit = async (ip, limit = 5, window = 86400) => {
    const key = `ratelimit:url:${ip}`;
    const burstKey = `ratelimit:burst:${ip}`;

    try {
        // Check burst limit (1 per 10 seconds)
        const burst = await redisClient.incr(burstKey);
        if (burst === 1) {
            await redisClient.expire(burstKey, 10);
        }
        if (burst > 1) {
            return { allowed: false, retryAfter: 10 };
        }

        // Check daily limit
        const count = await redisClient.incr(key);
        if (count === 1) {
            await redisClient.expire(key, window);
        }

        if (count > limit) {
            return { allowed: false, retryAfter: window };
        }

        return { allowed: true };
    } catch (error) {
        console.error('Rate limit check failed:', error);
        // If Redis fails, allow the request (fail open)
        return { allowed: true };
    }
};

// Helper function for caching
redisClient.getCached = async (key) => {
    try {
        const data = await redisClient.get(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Cache read failed:', error);
        return null;
    }
};

redisClient.setCached = async (key, value, ttl) => {
    try {
        await redisClient.setex(key, ttl, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error('Cache write failed:', error);
        return false;
    }
};

export default redisClient;