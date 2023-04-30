import { Environment } from "src/common/constants";

export default () => ({
    APP_PORT: process.env.APP_PORT,
    APP_NAME: process.env.APP_NAME,
    ORDERING_CO_WEBHOOK_SECRET: process.env.ORDERING_CO_WEBHOOK_SECRET,
    WOLT_API_ENDPOINT: getWoltApiEndpoint(),
    WOLT_KEY: getWoltKey(),
    WOLT_MERCHANT_ID: getWoltMerchantId(),
    WOLT_VENUE_ID: null,
    WOLT_WEBHOOK_SECRET: getWoltWebhookSecret(),
    WOLT_WEBHOOK_CALLBACK_URL: getWoltWebhookCallback(),
    HERE_GEOCODING_API_ENDPOINT: process.env.HERE_GEOCODING_API_ENDPOINT,
    HERE_APP_ID: process.env.HERE_APP_ID,
    HERE_API_KEY: process.env.HERE_API_KEY,
    ORDERING_APP_ENDPOINT: process.env.ORDERING_APP_ENDPOINT,
    ORDERING_APP_API_KEY: process.env.ORDERING_APP_API_KEY,
    ORDERING_DELIVERY_COMPANY_API_KEY:
        process.env.ORDERING_DELIVERY_COMPANY_API_KEY,
    ORDERING_DELIVERY_COMPANY_NAME:
        process.env.ORDERING_DELIVERY_COMPANY_NAME,
    TELEGRAM_BOT_KEY: process.env.TELEGRAM_BOT_KEY,
});

function getWoltEnvironment() {
    return process.env.NODE_ENV || Environment.Development;
}

function getWoltApiEndpoint() {
    const woltEnv = getWoltEnvironment();

    if (woltEnv == Environment.Development) {
        return process.env.WOLT_API_DEVELOPMENT_ENDPOINT;
    }

    return process.env.WOLT_API_PRODUCTION_ENDPOINT;
}

function getWoltWebhookCallback() {
    const woltEnv = getWoltEnvironment();

    if (woltEnv == Environment.Development) {
        return process.env.WOLT_WEBHOOK_CALLBACK_URL_DEVELOPMENT;
    }

    return process.env.WOLT_WEBHOOK_CALLBACK_URL_PRODUCTION;
}

function getWoltWebhookSecret() {
    const woltEnv = getWoltEnvironment();

    if (woltEnv == Environment.Development) {
        return process.env.WOLT_WEBHOOK_SECRET_DEVELOPMENT;
    }

    return process.env.WOLT_WEBHOOK_SECRET_PRODUCTION;
}

function getWoltMerchantId() {
    const woltEnv = getWoltEnvironment();

    if (woltEnv == Environment.Development) {
        return process.env.WOLT_MERCHANT_ID_DEVELOPMENT;
    }

    return process.env.WOLT_MERCHANT_ID_PRODUCTION;
}

function getWoltKey() {
    const woltEnv = getWoltEnvironment();

    if (woltEnv == Environment.Development) {
        return process.env.WOLT_KEY_DEVELOPMENT;
    }

    return process.env.WOLT_KEY_PRODUCTION;
}