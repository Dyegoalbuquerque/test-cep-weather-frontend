import { useState, useCallback, useEffect } from 'react';
import { STORAGE_KEYS, HISTORY_LIMIT } from '@/config/constants';
import type { ConsultaHistorico } from '@/types';


export function useHistorico() {
  const [historico, setHistorico] = useState<ConsultaHistorico[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (stored) {
        const parsed = JSON.parse(stored) as ConsultaHistorico[];
        setHistorico(parsed);
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    }
  }, []);

  const saveToStorage = useCallback((data: ConsultaHistorico[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(data));
    } catch (error) {
      console.error('Erro ao salvar histórico:', error);
    }
  }, []);

 const adicionarConsulta = useCallback(
  (cepData: any) => {
    setHistorico((prev) => {

      const filtered = prev.filter((item) => item.cep !== cepData.cep);

      const novaConsulta: ConsultaHistorico = {
        id: Date.now().toString(),
        cep: cepData.cep,
        cidade: cepData.cidade,
        uf: cepData.uf,
        timestamp: Date.now(),
        cepData: cepData
      };

      const updated = [novaConsulta, ...filtered].slice(0, HISTORY_LIMIT);
      saveToStorage(updated);
      return updated;
    });
  },
  [saveToStorage]
);

  const limparHistorico = useCallback(() => {
    setHistorico([]);
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
  }, []);

  return {
    historico,
    adicionarConsulta,
    limparHistorico,
  };
}
