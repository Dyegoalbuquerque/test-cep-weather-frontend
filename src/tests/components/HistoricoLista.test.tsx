import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HistoricoLista } from '@/components/HistoricoLista/HistoricoLista';
import type { ConsultaHistorico } from '@/types';

describe('HistoricoLista', () => {
  const mockHistorico: ConsultaHistorico[] = [
    {
      id: '1',
      cep: '01310100',
      cidade: 'São Paulo',
      uf: 'SP',
      timestamp: Date.now() - 60000, 
      cepData: {
        cep: '01310100',
        logradouro: 'Av. Paulista',
        bairro: 'Bela Vista',
        cidade: 'São Paulo',
        uf: 'SP',
        provedor: 'BrasilAPI',
      },
    },
    {
      id: '2',
      cep: '20040020',
      cidade: 'Rio de Janeiro',
      uf: 'RJ',
      timestamp: Date.now() - 3600000, 
      cepData: {
        cep: '20040020',
        logradouro: 'Rua da Assembléia',
        bairro: 'Centro',
        cidade: 'Rio de Janeiro',
        uf: 'RJ',
        provedor: 'ViaCEP',
      },
    },
  ];

  it('deve mostrar mensagem quando histórico vazio', () => {
    render(
      <HistoricoLista
        historico={[]}
        onSelect={() => {}}
        onClear={() => {}}
      />
    );

    expect(screen.getByText(/nenhuma consulta realizada/i)).toBeInTheDocument();
  });

  it('deve renderizar lista de consultas', () => {
    render(
      <HistoricoLista
        historico={mockHistorico}
        onSelect={() => {}}
        onClear={() => {}}
      />
    );

    expect(screen.getByText('01310-100')).toBeInTheDocument();
    expect(screen.getByText('São Paulo - SP')).toBeInTheDocument();

    expect(screen.getByText('20040-020')).toBeInTheDocument();
    expect(screen.getByText('Rio de Janeiro - RJ')).toBeInTheDocument();
  });

  it('deve chamar onSelect ao clicar em item', async () => {
    const user = userEvent.setup();
    let selectedCep = '';
    const handleSelect = (cep: string) => { selectedCep = cep; };

    render(
      <HistoricoLista
        historico={mockHistorico}
        onSelect={handleSelect}
        onClear={() => {}}
      />
    );

    await user.click(screen.getByText('01310-100'));
    expect(selectedCep).toBe('01310100');
  });

  it('deve chamar onClear ao clicar em limpar', async () => {
    const user = userEvent.setup();
    let cleared = false;
    const handleClear = () => { cleared = true; };

    render(
      <HistoricoLista
        historico={mockHistorico}
        onSelect={() => {}}
        onClear={handleClear}
      />
    );

    await user.click(screen.getByRole('button', { name: /limpar/i }));
    expect(cleared).toBe(true);
  });

  it('deve mostrar tempo relativo das consultas', () => {
    render(
      <HistoricoLista
        historico={mockHistorico}
        onSelect={() => {}}
        onClear={() => {}}
      />
    );

    const timeElements = screen.getAllByText(/há/i);
    expect(timeElements.length).toBeGreaterThan(0);
  });
});
