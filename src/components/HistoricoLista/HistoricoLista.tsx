import type { ConsultaHistorico } from '@/types';
import { formatCep } from '@/utils/cepValidation';
import { formatRelativeTime } from '@/utils/formatters';
import { Card } from '@/components/Card/Card';
import { Button } from '@/components/Button/Button';
import './HistoricoLista.css';

interface HistoricoListaProps {
  historico: ConsultaHistorico[];
  onSelect: (cep: string) => void;
  onClear: () => void;
}

export function HistoricoLista({
  historico,
  onSelect,
  onClear,
}: HistoricoListaProps) {
  if (historico.length === 0) {
    return (
      <Card>
        <div className="historico__empty">
          <p>Nenhuma consulta realizada ainda.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="historico__header">
        <h3 className="historico__title">Histórico de Consultas</h3>
        <Button onClick={onClear} variant="outline" size="sm">
          Limpar histórico
        </Button>
      </div>

      <ul className="historico__list">
        {historico.map((item) => (
          <li key={item.id} className="historico__item">
            <button
              onClick={() => onSelect(item.cep)}
              className="historico__button"
            >
              <div className="historico__info">
                <span className="historico__cep">{formatCep(item.cep)}</span>
                <span className="historico__location">
                  {item.cidade} - {item.uf}
                </span>
              </div>
              <span className="historico__time">
                {formatRelativeTime(item.timestamp)}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </Card>
  );
}
