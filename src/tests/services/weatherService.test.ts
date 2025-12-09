import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { geocodeCityState, fetchWeatherData } from '@/services/weatherService';

globalThis.fetch = vi.fn();

describe('weatherService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('geocodeCityState', () => {
    it('deve geocodificar cidade e estado com sucesso', async () => {
      const mockResponse = {
        results: [
          {
            latitude: -23.5505,
            longitude: -46.6333,
            name: 'São Paulo',
            admin1: 'São Paulo',
            country: 'Brazil',
          },
        ],
      };

      (globalThis.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await geocodeCityState('São Paulo', 'SP');

      expect(result).toEqual({
        latitude: -23.5505,
        longitude: -46.6333,
      });
    });

    it('deve lançar erro quando cidade não encontrada', async () => {
      const mockResponse = {
        results: [],
      };

      (globalThis.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      await expect(geocodeCityState('Cidade Inexistente', 'XX')).rejects.toThrow(
        /geocodificar localização/i
      );
    });

    it('deve lidar com erro de rede', async () => {
      (globalThis.fetch as any).mockRejectedValue(new Error('Network error'));

      await expect(geocodeCityState('São Paulo', 'SP')).rejects.toThrow();
    });

    it('deve formatar corretamente URL com espaços no nome', async () => {
      const mockResponse = {
        results: [
          {
            latitude: -22.9068,
            longitude: -43.1729,
            name: 'Rio de Janeiro',
          },
        ],
      };

      (globalThis.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      await geocodeCityState('Rio de Janeiro', 'RJ');

      const callUrl = (globalThis.fetch as any).mock.calls[0][0];
      expect(callUrl).toContain('Rio%20de%20Janeiro');
    });

    it('deve usar primeiro resultado quando múltiplos encontrados', async () => {
      const mockResponse = {
        results: [
          {
            latitude: -23.5505,
            longitude: -46.6333,
            name: 'São Paulo',
          },
          {
            latitude: -23.5000,
            longitude: -46.6000,
            name: 'São Paulo - Outro',
          },
        ],
      };

      (globalThis.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await geocodeCityState('São Paulo', 'SP');

      expect(result.latitude).toBe(-23.5505);
      expect(result.longitude).toBe(-46.6333);
    });
  });

  describe('fetchWeatherData', () => {
    it('deve buscar dados climáticos com sucesso', async () => {
      const mockResponse = {
        latitude: -23.5505,
        longitude: -46.6333,
        timezone: 'America/Sao_Paulo',
        current: {
          time: '2024-01-15T12:00',
          temperature_2m: 25.5,
          apparent_temperature: 27.0,
          relative_humidity_2m: 65,
        },
        daily: {
          time: ['2024-01-15', '2024-01-16', '2024-01-17'],
          temperature_2m_max: [28.0, 30.0, 29.5],
          temperature_2m_min: [20.0, 22.0, 21.5],
        },
      };

      (globalThis.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await fetchWeatherData(
        -23.5505,
        -46.6333,
        'São Paulo',
        'SP'
      );

      expect(result).toMatchObject({
        location: {
          latitude: -23.5505,
          longitude: -46.6333,
          cidade: 'São Paulo',
          uf: 'SP',
        },
        current: {
          time: '2024-01-15T12:00',
          temperature: 25.5,
          apparentTemperature: 27.0,
          humidity: 65,
        },
        daily: expect.arrayContaining([
          expect.objectContaining({
            date: '2024-01-15',
            temperatureMax: 28.0,
            temperatureMin: 20.0,
          }),
        ]),
      });
    });

    it('deve validar coordenadas', async () => {
      (globalThis.fetch as any).mockRejectedValue(new Error('API error'));

      await expect(
        fetchWeatherData(NaN, -46.6333, 'São Paulo', 'SP')
      ).rejects.toThrow();
    });

    it('deve usar valores padrão para dias', async () => {
      const mockResponse = {
        latitude: -23.5505,
        longitude: -46.6333,
        timezone: 'America/Sao_Paulo',
        current: {
          time: '2024-01-15T12:00',
          temperature_2m: 25.5,
          apparent_temperature: 27.0,
          relative_humidity_2m: 65,
        },
        daily: {
          time: ['2024-01-15'],
          temperature_2m_max: [28.0],
          temperature_2m_min: [20.0],
        },
      };

      (globalThis.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      await fetchWeatherData(-23.5505, -46.6333, 'São Paulo', 'SP');

      const callUrl = (globalThis.fetch as any).mock.calls[0][0];
      expect(callUrl).toContain('forecast_days=');
    });

    it('deve lidar com erro da API', async () => {
      (globalThis.fetch as any).mockResolvedValue({
        ok: false,
        status: 500,
      });

      await expect(
        fetchWeatherData(-23.5505, -46.6333, 'São Paulo', 'SP')
      ).rejects.toThrow(/consultar dados climáticos/i);
    });

    it('deve incluir timezone correto na URL', async () => {
      const mockResponse = {
        latitude: -23.5505,
        longitude: -46.6333,
        timezone: 'America/Sao_Paulo',
        current: {
          time: '2024-01-15T12:00',
          temperature_2m: 25.5,
          apparent_temperature: 27.0,
          relative_humidity_2m: 65,
        },
        daily: {
          time: ['2024-01-15'],
          temperature_2m_max: [28.0],
          temperature_2m_min: [20.0],
        },
      };

      (globalThis.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      await fetchWeatherData(-23.5505, -46.6333, 'São Paulo', 'SP');

      const callUrl = (globalThis.fetch as any).mock.calls[0][0];
      expect(callUrl).toContain('timezone=America/Sao_Paulo');
    });

    it('deve mapear todos os campos corretamente', async () => {
      const mockResponse = {
        latitude: -23.5505,
        longitude: -46.6333,
        timezone: 'America/Sao_Paulo',
        current: {
          time: '2024-01-15T12:00',
          temperature_2m: 25.5,
          apparent_temperature: 27.0,
          relative_humidity_2m: 65,
        },
        daily: {
          time: ['2024-01-15', '2024-01-16'],
          temperature_2m_max: [28.0, 30.0],
          temperature_2m_min: [20.0, 22.0],
        },
      };

      (globalThis.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await fetchWeatherData(
        -23.5505,
        -46.6333,
        'São Paulo',
        'SP'
      );

      expect(result.daily).toHaveLength(2);
      expect(result.daily[0]).toEqual({
        date: '2024-01-15',
        temperatureMax: 28.0,
        temperatureMin: 20.0,
      });
      expect(result.daily[1]).toEqual({
        date: '2024-01-16',
        temperatureMax: 30.0,
        temperatureMin: 22.0,
      });
    });
  });
});
