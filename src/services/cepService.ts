import { API_CONFIG } from '@/config/constants';
import { cleanCep } from '@/utils/cepValidation';
import type {
  BrasilAPICepResponse,
  ViaCepResponse,
  CepData,
} from '@/types';

class CepApiError extends Error {
  constructor(
    message: string,
    public provider?: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'CepApiError';
  }
}

async function fetchWithTimeout(
  url: string,
  timeout: number
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

async function fetchWithRetry(
  url: string,
  timeout: number,
  attempts: number
): Promise<Response> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await fetchWithTimeout(url, timeout);
    } catch (err) {
      lastError = err;
     if (attempt < attempts) {
        const backoff = 150 * attempt;
        await new Promise((res) => setTimeout(res, backoff));
      }
    }
  }

  throw lastError;
}

async function fetchBrasilAPI(cep: string): Promise<CepData> {
  const url = `${API_CONFIG.CEP.BRASILAPI}/${cep}`;

  try {
    const response = await fetchWithRetry(
      url,
      API_CONFIG.CEP.TIMEOUT,
      API_CONFIG.CEP.RETRY_ATTEMPTS
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data: BrasilAPICepResponse = await response.json();

    return {
      cep: data.cep,
      logradouro: data.street,
      bairro: data.neighborhood,
      cidade: data.city,
      uf: data.state,
      coordenadas: data.location?.coordinates
        ? {
            latitude: Number(data.location.coordinates.latitude),
            longitude: Number(data.location.coordinates.longitude),
          }
        : undefined,
      provedor: 'BrasilAPI',
    };
  } catch (error) {
    console.error('BrasilAPI error:', error);
    throw new CepApiError('Erro ao consultar BrasilAPI', 'BrasilAPI', error);
  }
}

async function fetchViaCep(cep: string): Promise<CepData> {
  const url = `${API_CONFIG.CEP.VIACEP}/${cep}/json/`;

  try {
    const response = await fetchWithRetry(
      url,
      API_CONFIG.CEP.TIMEOUT,
      API_CONFIG.CEP.RETRY_ATTEMPTS
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data: ViaCepResponse = await response.json();

    if (data.erro) {
      throw new Error('CEP não encontrado');
    }

    return {
      cep: data.cep,
      logradouro: data.logradouro,
      bairro: data.bairro,
      cidade: data.localidade,
      uf: data.uf,
      ibge: data.ibge,
      provedor: 'ViaCEP',
    };
  } catch (error) {
    console.error('ViaCEP error:', error);
    throw new CepApiError('Erro ao consultar ViaCEP', 'ViaCEP', error);
  }
}

export async function fetchCepData(cep: string): Promise<CepData> {
  const cleanedCep = cleanCep(cep);

  if (cleanedCep.length !== 8) {
    throw new CepApiError('CEP inválido');
  }

  try {
    return await fetchBrasilAPI(cleanedCep);
  } catch (brasilApiError) {
    console.warn('BrasilAPI falhou, tentando ViaCEP...', brasilApiError);

    try {
      return await fetchViaCep(cleanedCep);
    } catch (viaCepError) {
      console.error('Both CEP providers failed:', { brasilApiError, viaCepError });
      throw new CepApiError(
        'CEP não encontrado ou erro de conectividade. Tente novamente.',
        'Ambos',
        { brasilApiError, viaCepError }
      );
    }
  }
}
