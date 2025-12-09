import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function formatRelativeTime(timestamp: number): string {
  return formatDistanceToNow(timestamp, {
    addSuffix: true,
    locale: ptBR,
  });
}

export function formatDate(date: string | Date): string {
  if (typeof date === 'string') {
    const [year, month, day] = date.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    return d.toLocaleDateString('pt-BR');
  }
  return date.toLocaleDateString('pt-BR');
}

export function formatTemperature(temp: number): string {
  return `${Math.round(temp)}°C`;
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('pt-BR');
}
