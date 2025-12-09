export const API_CONFIG = {
  CEP: {
    BRASILAPI: 'https://brasilapi.com.br/api/cep/v2',
    VIACEP: 'https://viacep.com.br/ws',
    TIMEOUT: 5000,
    RETRY_ATTEMPTS: 2,
  },
  WEATHER: {
    FORECAST: 'https://api.open-meteo.com/v1/forecast',
    GEOCODING: 'https://geocoding-api.open-meteo.com/v1/search',
    TIMEOUT: 8000,
    CACHE_TIME: 10 * 60 * 1000,
    RETRY_ATTEMPTS: 2,
  },
} as const;

export const STORAGE_KEYS = {
  HISTORY: 'cep-history',
} as const;

export const HISTORY_LIMIT = 10;
