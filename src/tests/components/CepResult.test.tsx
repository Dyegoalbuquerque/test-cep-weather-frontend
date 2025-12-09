import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CepResult } from '@/components/CepResult/CepResult';
import type { CepData } from '@/types';

describe('CepResult', () => {
  const mockCepData: CepData = {
    cep: '01310100',
    logradouro: 'Avenida Paulista',
    bairro: 'Bela Vista',
    cidade: 'São Paulo',
    uf: 'SP',
    ibge: '3550308',
    coordenadas: {
      latitude: -23.561414,
      longitude: -46.656147,
    },
    provedor: 'BrasilAPI',
  };

  it('deve renderizar dados do CEP', () => {
    render(<CepResult data={mockCepData} />);

    expect(screen.getByText('01310-100')).toBeInTheDocument();
    expect(screen.getByText('Avenida Paulista')).toBeInTheDocument();
    expect(screen.getByText('Bela Vista')).toBeInTheDocument();
    expect(screen.getByText('São Paulo')).toBeInTheDocument();
    expect(screen.getByText('SP')).toBeInTheDocument();
  });

  it('deve mostrar provedor da API', () => {
    render(<CepResult data={mockCepData} />);
    expect(screen.getByText('BrasilAPI')).toBeInTheDocument();
  });

  it('deve mostrar coordenadas quando disponíveis', () => {
    render(<CepResult data={mockCepData} />);
    expect(screen.getByText('-23.561414')).toBeInTheDocument();
    expect(screen.getByText('-46.656147')).toBeInTheDocument();
  });

  it('deve mostrar código IBGE quando disponível', () => {
    render(<CepResult data={mockCepData} />);
    expect(screen.getByText('3550308')).toBeInTheDocument();
  });

  it('deve lidar com dados opcionais ausentes', () => {
    const minimalData: CepData = {
      cep: '01310100',
      logradouro: '',
      bairro: '',
      cidade: 'São Paulo',
      uf: 'SP',
      provedor: 'ViaCEP',
    };

    render(<CepResult data={minimalData} />);
    expect(screen.getAllByText('N/A')).toHaveLength(2); // logradouro e bairro
  });
});
