interface WeatherStatProps {
  label: string;
  value: string | number;
  icon?: string;
  large?: boolean;
  ariaLabel?: string;
}

export function WeatherStat({ 
  label, 
  value, 
  icon, 
  large = false,
  ariaLabel 
}: WeatherStatProps) {
  return (
    <div className="weather-stat" aria-label={ariaLabel}>
      <span className="weather-stat__label">
        {icon && <span className="weather-stat__icon" aria-hidden="true">{icon}</span>}
        {label}
      </span>
      <span className={`weather-stat__value ${large ? 'weather-stat__value--large' : ''}`}>
        {value}
      </span>
    </div>
  );
}
