export default () => ({
    APP_PORT: process.env.APP_PORT,
    APP_NAME: process.env.APP_NAME,
    APP_SECRET: process.env.APP_JWT_SECRET,
    APP_REFRESH_SECRET: process.env.APP_JWT_REFRESH_SECRET,
    ORDERING_CO_WEBHOOK_SECRET: process.env.ORDERING_CO_WEBHOOK_SECRET,
    ORDERING_CO_URL: process.env.ORDERING_CO_URL
});