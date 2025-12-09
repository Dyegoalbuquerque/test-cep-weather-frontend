import { API_CONFIG } from '@/config/constants';
import type {
  GeocodingResponse,
  OpenMeteoForecastResponse,
  WeatherData,
} from '@/types';

class WeatherApiError extends Error {
  constructor(message: string, public originalError?: unknown) {
    super(message);
    this.name = 'WeatherApiError';
  }
}

async function fetchWithTimeout(
  url: string,
  timeout: number
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    return response;
  } catch (error) {
    clearTimeout(timer);
    throw error;
  }
}


async function fetchWithRetry(
  url: string,
  timeout: number,
  attempts: number
): Promise<Response> {
  let lastError: unknown;

  for (let i = 1; i <= attempts; i++) {
    try {
      return await fetchWithTimeout(url, timeout);
    } catch (error) {
      lastError = error;
      if (i < attempts) {
        const backoff = 150 * i;
        await new Promise((res) => setTimeout(res, backoff));
      }
    }
  }

  throw lastError;
}


export async function geocodeCityState(
  cidade: string,
  uf: string
): Promise<{ latitude: number; longitude: number }> {
  const url = `${API_CONFIG.WEATHER.GEOCODING}?name=${encodeURIComponent(
    cidade
  )}&count=5&language=pt&format=json`;

  try {
    const response = await fetchWithRetry(
      url,
      API_CONFIG.WEATHER.TIMEOUT,
      API_CONFIG.WEATHER.RETRY_ATTEMPTS
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data: GeocodingResponse = await response.json();

    if (!data.results?.length) {
      throw new Error('Localização não encontrada');
    }

    const result =
      data.results.find((r) =>
        r.admin1?.toLowerCase().includes(uf.toLowerCase())
      ) ?? data.results[0];

    return {
      latitude: result.latitude,
      longitude: result.longitude,
    };
  } catch (error) {
    throw new WeatherApiError('Erro ao geocodificar localização', error);
  }
}

export async function fetchWeatherData(
  latitude: number,
  longitude: number,
  cidade: string,
  uf: string
): Promise<WeatherData> {
  const url = `${API_CONFIG.WEATHER.FORECAST}?latitude=${latitude}&longitude=${longitude}` +
    `&current=temperature_2m,apparent_temperature,relative_humidity_2m` +
    `&daily=temperature_2m_max,temperature_2m_min` +
    `&timezone=America/Sao_Paulo&forecast_days=16`;

  try {
    const response = await fetchWithRetry(
      url,
      API_CONFIG.WEATHER.TIMEOUT,
      API_CONFIG.WEATHER.RETRY_ATTEMPTS
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data: OpenMeteoForecastResponse = await response.json();

    return {
      current: {
        temperature: data.current.temperature_2m,
        apparentTemperature: data.current.apparent_temperature,
        humidity: data.current.relative_humidity_2m,
        time: data.current.time,
      },
      daily: data.daily.time.map((date, idx) => ({
        date,
        temperatureMin: data.daily.temperature_2m_min[idx],
        temperatureMax: data.daily.temperature_2m_max[idx],
      })),
      location: {
        cidade,
        uf,
        latitude: data.latitude,
        longitude: data.longitude,
      },
    };
  } catch (error) {
    throw new WeatherApiError('Erro ao consultar dados climáticos', error);
  }
}
