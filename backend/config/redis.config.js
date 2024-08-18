const redis_config = {
    host: process.env.REDIS_HOST           || "redis",
    port: parseInt(process.env.REDIS_PORT) || 6379
};


export default redis_config;
