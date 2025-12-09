import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

export function LoadingSpinner({ size = 'md', message }: LoadingSpinnerProps) {
  return (
    <div className="loading-spinner">
      <div className={`spinner spinner--${size}`} />
      {message && <p className="loading-spinner__message">{message}</p>}
    </div>
  );
}
