import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { fetchCepData } from '@/services/cepService';
import { useHistorico } from '@/hooks/useHistorico';
import type { CepData } from '@/types';
import { CepForm } from '@/components/CepForm/CepForm';
import { CepResult } from '@/components/CepResult/CepResult';
import { WeatherWidget } from '@/components/WeatherWidget/WeatherWidget';
import { HistoricoLista } from '@/components/HistoricoLista/HistoricoLista';
import { Toast } from '@/components/Toast/Toast';
import { Card } from '@/components/Card/Card';
import { Button } from '@/components/Button/Button';
import './Home.css';

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

export function Home() {
  const [cepData, setCepData] = useState<CepData | null>(null);
  const [lastCep, setLastCep] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: '',
    type: 'info',
  });
  const [clearSignal, setClearSignal] = useState(0);

  const { historico, adicionarConsulta, limparHistorico } = useHistorico();

  const cepMutation = useMutation({
    mutationFn: fetchCepData,
    onSuccess: (data) => {
      setCepData(data);
      adicionarConsulta(data);
      setClearSignal((s) => s + 1);
      showToast('CEP encontrado com sucesso!', 'success');
    },
    onError: (error: unknown) => {
      setCepData(null);
      console.error('CEP mutation error:', error);
      const message =
        (error as any)?.message || String(error) || 'Erro ao consultar CEP';
      showToast(message, 'error');
    },
  });

  const showToast = (
    message: string,
    type: 'success' | 'error' | 'warning' | 'info'
  ) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'info' }), 5000);
  };

  const handleCepSubmit = (cep: string) => {
    setLastCep(cep);
    cepMutation.mutate(cep);
  };

  const handleHistoricoSelect = (cep: string) => {
    const item = historico.find((h) => h.cep === cep);
    if (!item) return;

    if (item.cepData) {
      setCepData(item.cepData);
      return;
    }

    cepMutation.mutate(cep);
  };

  return (
    <div className="home">
      <header className="home__header">
        <div className="container">
          <h1 className="home__title">Consulta CEP e Clima</h1>
          <p className="home__subtitle">
            Encontre endereços e previsão do tempo de qualquer localidade
          </p>
        </div>
      </header>

      <main className="home__main">
        <div className="container">
          <div className="home__grid">
            <div className="home__primary">
              <Card title="Consultar CEP">
                <CepForm
                  onSubmit={handleCepSubmit}
                  isLoading={cepMutation.isPending}
                  clearSignal={clearSignal}
                />
              </Card>

              {cepMutation.isError && (
                <Card>
                  <div
                    style={{
                      display: 'flex',
                      gap: 'var(--spacing-md)',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <p>
                        Erro ao consultar CEP:{' '}
                        {(cepMutation.error as any)?.message ||
                          'Erro desconhecido'}
                      </p>
                    </div>
                    <div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => lastCep && cepMutation.mutate(lastCep)}
                      >
                        Tentar novamente
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              {cepData && (
                <>
                  <CepResult data={cepData} />
                  <WeatherWidget cepData={cepData} />
                </>
              )}
            </div>

            <aside className="home__sidebar">
              <HistoricoLista
                historico={historico}
                onSelect={handleHistoricoSelect}
                onClear={limparHistorico}
              />
            </aside>
          </div>
        </div>
      </main>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
}
