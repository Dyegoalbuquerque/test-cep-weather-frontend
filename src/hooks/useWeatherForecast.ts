import { useQuery } from '@tanstack/react-query';
import { API_CONFIG } from '@/config/constants';
import type { CepData, WeatherData } from '@/types';
import { fetchWeatherData, geocodeCityState } from '@/services/weatherService';

export function useWeatherForecast(cepData: CepData, days: number) {
  const hasCoordinatesFromCep =
    typeof cepData.coordenadas?.latitude === 'number' &&
    typeof cepData.coordenadas?.longitude === 'number' &&
    Number.isFinite(cepData.coordenadas.latitude) &&
    Number.isFinite(cepData.coordenadas.longitude);

  const geocodeQuery = useQuery({
    queryKey: ['geocode', cepData.cidade, cepData.uf],
    queryFn: () => geocodeCityState(cepData.cidade, cepData.uf),
    enabled: !hasCoordinatesFromCep && !!cepData.cidade && !!cepData.uf,
    staleTime: API_CONFIG.WEATHER.CACHE_TIME,
    retry: 2
  });

  const latitude =
    hasCoordinatesFromCep
      ? cepData.coordenadas!.latitude
      : geocodeQuery.data?.latitude;

  const longitude =
    hasCoordinatesFromCep
      ? cepData.coordenadas!.longitude
      : geocodeQuery.data?.longitude;

  const hasValidLatLon =
    typeof latitude === 'number' &&
    !Number.isNaN(latitude) &&
    typeof longitude === 'number' &&
    !Number.isNaN(longitude) &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude);

  const weatherQuery = useQuery<WeatherData>({
    queryKey: ['weather', latitude, longitude, days],
    queryFn: () =>
      fetchWeatherData(
        latitude as number,
        longitude as number,
        cepData.cidade,
        cepData.uf
      ),
    enabled: hasValidLatLon,
    staleTime: API_CONFIG.WEATHER.CACHE_TIME,
    retry: 2
  });

  return {
    weather: weatherQuery,
    geocode: geocodeQuery,
  } as const;
}

export default useWeatherForecast;
