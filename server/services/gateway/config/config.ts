import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

export const configFile = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: process.env.GATEWAY_PORT || 4000,
    jwtSecret: process.env.GATEWAY_JWT_SECRET || 'your-gateway-secret-key',
    jwtExpiration: process.env.JWT_EXPIRATION || '24h',

    services: {
        auth: `http://auth-service:${process.env.AUTH_SERVICE_PORT || 4001}`,
    },

    redis: {
        host: process.env.REDIS_HOST || 'redis',
        port: parseInt(process.env.REDIS_PORT || '6379'),
    },

    cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    },

    apiPrefix: process.env.API_PREFIX || '/api/v1',

    rateLimit: {
        window: process.env.RATE_LIMIT_WINDOW || '15m',
        maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    },

    logging: {
        level: process.env.LOG_LEVEL || 'debug',
    }
};