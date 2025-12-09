export interface BrasilAPICepResponse {
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  location: {
    type: string;
    coordinates: {
      longitude: string;
      latitude: string;
    };
  };
  service: string;
}

export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

export interface CepData {
  cep: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  uf: string;
  ibge?: string;
  coordenadas?: {
    latitude: number;
    longitude: number;
  };
  provedor: 'BrasilAPI' | 'ViaCEP';
}

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

export interface GeocodingResponse {
  results?: GeocodingResult[];
}

export interface WeatherCurrentData {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  time: string;
}

export interface WeatherDailyData {
  date: string;
  temperatureMin: number;
  temperatureMax: number;
}

export interface WeatherData {
  current: WeatherCurrentData;
  daily: WeatherDailyData[];
  location: {
    cidade: string;
    uf: string;
    latitude: number;
    longitude: number;
  };
}

export interface OpenMeteoForecastResponse {
  latitude: number;
  longitude: number;
  current: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
}

export interface ConsultaHistorico {
  id: string;
  cep: string;
  cidade: string;
  uf: string;
  timestamp: number;
  cepData: CepData;
}
