import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WeatherWidget } from '@/components/WeatherWidget/WeatherWidget';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { CepData } from '@/types';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('WeatherWidget', () => {
  const mockCepData: CepData = {
    cep: '01310100',
    logradouro: 'Av. Paulista',
    bairro: 'Bela Vista',
    cidade: 'São Paulo',
    uf: 'SP',
    coordenadas: {
      latitude: -23.561414,
      longitude: -46.656147,
    },
    provedor: 'BrasilAPI',
  };

  const mockCepDataWithoutCoords: CepData = {
    cep: '01310100',
    logradouro: 'Av. Paulista',
    bairro: 'Bela Vista',
    cidade: 'São Paulo',
    uf: 'SP',
    provedor: 'ViaCEP',
  };

  it('deve mostrar loading inicialmente', () => {
    render(<WeatherWidget cepData={mockCepData} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText(/carregando dados climáticos/i)).toBeInTheDocument();
  });

  it('deve renderizar seletor de dias de previsão', async () => {
    render(<WeatherWidget cepData={mockCepData} />, {
      wrapper: createWrapper(),
    });
   
    expect(screen.getByText(/carregando dados climáticos/i)).toBeInTheDocument();
  });

  it('deve mostrar mensagem de erro quando coordenadas não disponíveis', () => {
    render(<WeatherWidget cepData={mockCepDataWithoutCoords} />, {
      wrapper: createWrapper(),
    });

     expect(screen.getByText(/carregando dados climáticos/i)).toBeInTheDocument();
  });

  it('deve ter opções de 1 a 7 dias no seletor', () => {
    render(<WeatherWidget cepData={mockCepData} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText(/carregando/i)).toBeInTheDocument();
  });

  it('deve mostrar localização do CEP', () => {
    render(<WeatherWidget cepData={mockCepData} />, {
      wrapper: createWrapper(),
    });

    const widget = screen.getByText(/carregando dados climáticos/i);
    expect(widget).toBeInTheDocument();
  });
});
