import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchCepData } from '@/services/cepService';

globalThis.fetch = vi.fn();

describe('cepService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('fetchCepData', () => {
    it('deve buscar dados da BrasilAPI com sucesso', async () => {
      const mockResponse = {
        cep: '01310-100',
        street: 'Avenida Paulista',
        neighborhood: 'Bela Vista',
        city: 'São Paulo',
        state: 'SP',
        location: {
          coordinates: {
            latitude: '-23.561414',
            longitude: '-46.656147',
          },
        },
      };

      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await fetchCepData('01310100');

      expect(result).toEqual({
        cep: '01310-100',
        logradouro: 'Avenida Paulista',
        bairro: 'Bela Vista',
        cidade: 'São Paulo',
        uf: 'SP',
        coordenadas: {
          latitude: -23.561414,
          longitude: -46.656147,
        },
        provedor: expect.stringContaining('BrasilAPI'),
      });
    });

    it('deve fazer fallback para ViaCEP quando BrasilAPI falhar', async () => {
      const viaCepResponse = {
        cep: '01310-100',
        logradouro: 'Avenida Paulista',
        bairro: 'Bela Vista',
        localidade: 'São Paulo',
        uf: 'SP',
        ibge: '3550308',
        erro: false,
      };

      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => viaCepResponse,
      });

      const result = await fetchCepData('01310100');

      expect(result).toEqual({
        cep: '01310-100',
        logradouro: 'Avenida Paulista',
        bairro: 'Bela Vista',
        cidade: 'São Paulo',
        uf: 'SP',
        ibge: '3550308',
        provedor: expect.stringContaining('ViaCEP'),
      });
    });

    it('deve usar BrasilAPI quando disponível', async () => {
      const mockResponse = {
        cep: '01310-100',
        street: 'Avenida Paulista',
        neighborhood: 'Bela Vista',
        city: 'São Paulo',
        state: 'SP',
        location: {
          coordinates: {
            latitude: '-23.561414',
            longitude: '-46.656147',
          },
        },
      };

      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await fetchCepData('01310100');

      expect(result.coordenadas).toBeDefined();
      expect(result.provedor).toContain('BrasilAPI');
    });

    it('deve rejeitar CEP inválido', async () => {
      await expect(fetchCepData('123')).rejects.toThrow('CEP inválido');
      await expect(fetchCepData('abcdefgh')).rejects.toThrow('CEP inválido');
      await expect(fetchCepData('')).rejects.toThrow('CEP inválido');
    });

    it('deve formatar CEP antes de buscar', async () => {
      const mockResponse = {
        cep: '01310-100',
        street: 'Avenida Paulista',
        neighborhood: 'Bela Vista',
        city: 'São Paulo',
        state: 'SP',
      };

      (globalThis.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      await fetchCepData('01310-100');

      expect(globalThis.fetch).toHaveBeenCalled();
      const callUrl = (globalThis.fetch as any).mock.calls[0][0];
      expect(callUrl).toContain('01310100'); 
    });

    it('deve lançar erro quando ambas APIs falharem', async () => {
      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(fetchCepData('99999999')).rejects.toThrow();
    });

    it('deve lidar com erro de rede', async () => {
      (globalThis.fetch as any).mockRejectedValue(new Error('Network error'));

      await expect(fetchCepData('01310100')).rejects.toThrow();
    });

    it('deve lidar com resposta sem coordenadas da BrasilAPI', async () => {
      const mockResponse = {
        cep: '01310-100',
        street: 'Avenida Paulista',
        neighborhood: 'Bela Vista',
        city: 'São Paulo',
        state: 'SP'
      };

      (globalThis.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await fetchCepData('01310100');

      expect(result.coordenadas).toBeUndefined();
    });
  });
});
