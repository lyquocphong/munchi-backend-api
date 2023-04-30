export default () => ({
    app_port: process.env.APP_PORT || 3000,
    app_name: process.env.APP_NAME || 'Munchi Api',
    ordering_co_webhook_secret: process.env.ORDERING_CO_WEBHOOK_SECRET || ''
});