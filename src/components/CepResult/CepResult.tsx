import type { CepData } from '@/types';
import { formatCep } from '@/utils/cepValidation';
import { Card } from '@/components/Card/Card';
import './CepResult.css';

interface CepResultProps {
  data: CepData;
}

export function CepResult({ data }: CepResultProps) {
  const formatCoord = (n?: number) =>
    typeof n === 'number' && Number.isFinite(n) ? n.toFixed(6) : '';
  return (
    <Card className="cep-result">
      <div className="cep-result__header">
        <h3 className="cep-result__title">Endereço Encontrado</h3>
        <span className="cep-result__provider">{data.provedor}</span>
      </div>

      <div className="cep-result__grid">
        <div className="cep-result__item">
          <span className="cep-result__label">CEP:</span>
          <span className="cep-result__value">{formatCep(data.cep)}</span>
        </div>

        <div className="cep-result__item">
          <span className="cep-result__label">Logradouro:</span>
          <span className="cep-result__value">{data.logradouro || 'N/A'}</span>
        </div>

        <div className="cep-result__item">
          <span className="cep-result__label">Bairro:</span>
          <span className="cep-result__value">{data.bairro || 'N/A'}</span>
        </div>

        <div className="cep-result__item">
          <span className="cep-result__label">Cidade:</span>
          <span className="cep-result__value">{data.cidade}</span>
        </div>

        <div className="cep-result__item">
          <span className="cep-result__label">UF:</span>
          <span className="cep-result__value">{data.uf}</span>
        </div>

        {data.ibge && (
          <div className="cep-result__item">
            <span className="cep-result__label">Código IBGE:</span>
            <span className="cep-result__value">{data.ibge}</span>
          </div>
        )}

        {data.coordenadas && 
         Number.isFinite(data.coordenadas.latitude) && 
         Number.isFinite(data.coordenadas.longitude) && (
          <>
            <div className="cep-result__item">
              <span className="cep-result__label">Latitude:</span>
              <span className="cep-result__value">
                {formatCoord(data.coordenadas.latitude)}
              </span>
            </div>

            <div className="cep-result__item">
              <span className="cep-result__label">Longitude:</span>
              <span className="cep-result__value">
                {formatCoord(data.coordenadas.longitude)}
              </span>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
