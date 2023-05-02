import { Environment } from 'src/common/constants';

export default () => ({
  app: {
    port: process.env.APP_PORT,
    name: process.env.APP_NAME,
    environment: process.env.NODE_ENV,
    jwt: {
      secret: process.env.APP_JWT_SECRET,
      refresh_secret: process.env.APP_JWT_REFRESH_SECRET,
    },
    secret: process.env.APP_HASH_SECRET,
    database: {
      url: process.env.DATABASE_URL,
      shadow_url: process.env.SHADOW_DATABASE_URL,
    },
  },
  orderingco: {
    webhook: {
      secret: process.env.ORDERING_CO_WEBHOOK_SECRET,
    },
    api: {
      endpoint: process.env.ORDERING_APP_ENDPOINT,
      key: process.env.ORDERING_APP_API_KEY,
    },
    delivery_company: {
      name: process.env.ORDERING_DELIVERY_COMPANY_NAME,
      key: process.env.ORDERING_DELIVERY_COMPANY_API_KEY,
    },
  },
  wolt: {
    api: {
      endpoint: getWoltApiEndpoint(),
      key: getWoltKey(),
    },
    merchant_id: getWoltMerchantId(),
    webhook: {
      secret: getWoltWebhookSecret(),
      callback_url: getWoltWebhookCallback(),
    },
  },
  here: {
    api: {
      endpoint: process.env.HERE_GEOCODING_API_ENDPOINT,
      key: process.env.HERE_API_KEY,
    },
    app_id: process.env.HERE_GEOCODING_API_ENDPOINT,
  },
  telegram: {
    bot_key: process.env.TELEGRAM_BOT_KEY,
    chat_id: process.env.TELEGRAM_CHAT_ID,
  },
  messagebird: {
    key: process.env.MESSAGEBIRD_KEY,
    source_phone_number: process.env.MESSAGEBIRD_SOURCE_PHONE_NUMBER,
  },
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
