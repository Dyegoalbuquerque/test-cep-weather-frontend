import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useHistorico } from '@/hooks/useHistorico';

const fakeCepData = {
  cep: '01310100',
  logradouro: 'Av. Paulista',
  bairro: 'Bela Vista',
  cidade: 'São Paulo',
  uf: 'SP',
};

describe('useHistorico', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('deve iniciar com histórico vazio', () => {
    const { result } = renderHook(() => useHistorico());
    expect(result.current.historico).toEqual([]);
  });

  it('deve adicionar consulta ao histórico', () => {
    const { result } = renderHook(() => useHistorico());

    act(() => {
      result.current.adicionarConsulta(fakeCepData);
    });

    expect(result.current.historico).toHaveLength(1);

    expect(result.current.historico[0]).toMatchObject({
      cep: '01310100',
      cidade: 'São Paulo',
      uf: 'SP',
      cepData: fakeCepData,
    });
  });

  it('deve remover duplicatas do mesmo CEP', () => {
    const { result } = renderHook(() => useHistorico());

    act(() => {
      result.current.adicionarConsulta(fakeCepData);
      result.current.adicionarConsulta(fakeCepData);
    });

    expect(result.current.historico).toHaveLength(1);
  });

  it('deve limitar histórico ao máximo configurado', () => {
    const { result } = renderHook(() => useHistorico());

    act(() => {
      for (let i = 0; i < 15; i++) {
        result.current.adicionarConsulta({
          ...fakeCepData,
          cep: `0000000${i}`.slice(-8),
        });
      }
    });

    expect(result.current.historico.length).toBeLessThanOrEqual(10);
  });

  it('deve limpar histórico', () => {
    const { result } = renderHook(() => useHistorico());

    act(() => {
      result.current.adicionarConsulta(fakeCepData);
    });

    expect(result.current.historico).toHaveLength(1);

    act(() => {
      result.current.limparHistorico();
    });

    expect(result.current.historico).toEqual([]);
  });

  it('deve persistir histórico no localStorage', () => {
    const { result } = renderHook(() => useHistorico());

    act(() => {
      result.current.adicionarConsulta(fakeCepData);
    });

    const stored = localStorage.getItem('cep-history');
    expect(stored).toBeTruthy();

    const parsed = JSON.parse(stored!);
    expect(parsed).toHaveLength(1);

    expect(parsed[0]).toMatchObject({
      cep: '01310100',
      cidade: 'São Paulo',
      uf: 'SP',
      cepData: fakeCepData,
    });
  });
});
