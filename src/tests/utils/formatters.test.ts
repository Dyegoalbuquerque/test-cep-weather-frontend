import { describe, it, expect } from 'vitest';
import { formatTemperature, formatDate } from '@/utils/formatters';

describe('formatters', () => {
  describe('formatTemperature', () => {
    it('deve formatar temperatura com símbolo de graus', () => {
      expect(formatTemperature(25.5)).toBe('26°C');
      expect(formatTemperature(0)).toBe('0°C');
      expect(formatTemperature(-5.3)).toBe('-5°C');
    });

    it('deve arredondar valores', () => {
      expect(formatTemperature(25.4)).toBe('25°C');
      expect(formatTemperature(25.6)).toBe('26°C');
    });
  });

  describe('formatDate', () => {
    it('deve formatar data no padrão brasileiro', () => {
      const date = new Date(2024, 0, 15);
      const formatted = formatDate(date);
      expect(formatted).toMatch(/15\/01\/2024/);
    });

    it('deve aceitar string como entrada', () => {
      const formatted = formatDate('2024-01-15');
      expect(formatted).toContain('2024');
    });
  });
});
