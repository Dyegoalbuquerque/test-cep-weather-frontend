import { useState } from 'react';
import type { CepData } from '@/types';
import useWeatherForecast from '@/hooks/useWeatherForecast';
import { Card } from '@/components/Card/Card';
import { Button } from '@/components/Button/Button';
import { LoadingSpinner } from '@/components/LoadingSpinner/LoadingSpinner';
import { formatTemperature, formatDate, formatDateTime } from '@/utils/formatters';
import './WeatherWidget.css';

interface WeatherWidgetProps {
  cepData: CepData;
}

export function WeatherWidget({ cepData }: WeatherWidgetProps) {
  const [forecastDays, setForecastDays] = useState(7);
  const { weather, geocode } = useWeatherForecast(cepData, forecastDays);
  const { data, isLoading, error, refetch } = weather;
  const geocodeLoading = geocode.isLoading;

  const handleDaysChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForecastDays(parseInt(e.target.value));
  };

  if (isLoading || geocodeLoading) {
    return (
      <Card>
        <LoadingSpinner message="Carregando dados climáticos..." />
      </Card>
    );
  }

  if (error || geocode.error) {
    const errorMessage = error 
      ? 'Erro ao carregar dados climáticos.' 
      : 'Erro ao geocodificar localização. Verifique cidade e UF.';
    
    return (
      <Card>
        <div className="weather-widget__error">
          <p>{errorMessage}</p>
          {error && (
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-sm)' }}>
              {(error as any)?.message || 'Erro desconhecido'}
            </p>
          )}
          {geocode.error && (
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-sm)' }}>
              {(geocode.error as any)?.message || 'Erro de geocodificação'}
            </p>
          )}
          <Button onClick={() => refetch()} variant="outline" size="sm">
            Tentar novamente
          </Button>
        </div>
      </Card>
    );
  }

  if (!data) return null;

  return (
    <Card className="weather-widget">
      <div className="weather-widget__header">
        <div>
          <h3 className="weather-widget__title">Clima</h3>
          <p className="weather-widget__location">
            <span className="weather-widget__icon" aria-hidden="true">📍</span>
            {data.location.cidade} - {data.location.uf}
          </p>
          <p className="weather-widget__coords" aria-label={`Coordenadas: latitude ${data.location.latitude.toFixed(4)}, longitude ${data.location.longitude.toFixed(4)}`}>
            {data.location.latitude.toFixed(4)}°, {data.location.longitude.toFixed(4)}°
          </p>
        </div>

        <div className="weather-widget__days-selector">
          <label htmlFor="forecast-days">
            <span className="weather-widget__icon" aria-hidden="true">📊</span>
            Dias de previsão:
          </label>
          <select
            id="forecast-days"
            value={forecastDays}
            onChange={handleDaysChange}
            className="weather-widget__select"
            aria-label="Selecionar número de dias para previsão do tempo"
          >
            {Array.from({ length: 7 }, (_, i) => i + 1).map((days) => (
              <option key={days} value={days}>
                {days} {days === 1 ? 'dia' : 'dias'}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="weather-widget__current">
        <h4>Clima Atual</h4>
        <div className="weather-widget__current-grid">
          <div className="weather-widget__stat" aria-label="Temperatura atual">
            <span className="weather-widget__stat-label">
              <span className="weather-widget__icon" aria-hidden="true">🌡️</span>
              Temperatura:
            </span>
            <span className="weather-widget__stat-value weather-widget__stat-value--large">
              {formatTemperature(data.current.temperature)}
            </span>
          </div>
          <div className="weather-widget__stat" aria-label="Sensação térmica">
            <span className="weather-widget__stat-label">
              <span className="weather-widget__icon" aria-hidden="true">🌤️</span>
              Sensação Térmica:
            </span>
            <span className="weather-widget__stat-value">
              {formatTemperature(data.current.apparentTemperature)}
            </span>
          </div>
          <div className="weather-widget__stat" aria-label="Umidade relativa">
            <span className="weather-widget__stat-label">
              <span className="weather-widget__icon" aria-hidden="true">💧</span>
              Umidade:
            </span>
            <span className="weather-widget__stat-value">
              {data.current.humidity}%
            </span>
          </div>
        </div>
        <div className="weather-widget__observed">
          <small>
            <span className="weather-widget__icon" aria-hidden="true">🕐</span>
            Observado em: {formatDateTime(data.current.time)}
          </small>
        </div>
      </div>
      <div className="weather-widget__forecast">
        <h4>Previsão</h4>

        <div className="weather-widget__forecast-grid">
          {data.daily.slice(0, forecastDays).map((day, index) => {
            const isToday = index === 0;

            return (
              <div
                key={`${day.date}-${index}`}
                className={`weather-widget__forecast-card ${
                  isToday ? 'weather-widget__forecast-card--today' : ''
                }`}
                aria-label={`Previsão para ${isToday ? 'hoje' : formatDate(day.date)}`}
              >
                <div className="weather-widget__forecast-date">
                  <span className="weather-widget__icon" aria-hidden="true">📅</span>

                  {isToday ? 'Hoje' : formatDate(day.date)}
                </div>

                <div className="weather-widget__forecast-temps">
                  <span className="weather-widget__temp weather-widget__temp--max" title="Temperatura máxima">
                    <span aria-hidden="true">↑</span> {formatTemperature(day.temperatureMax)}
                  </span>
                  <span className="weather-widget__temp weather-widget__temp--min" title="Temperatura mínima">
                    <span aria-hidden="true">↓</span> {formatTemperature(day.temperatureMin)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </Card>
  );
}
