import { describe, it, expect } from 'vitest';
import { isValidCep, cleanCep, formatCep, maskCep } from '@/utils/cepValidation';

describe('cepValidation', () => {
  describe('isValidCep', () => {
    it('deve validar CEP com 8 dígitos', () => {
      expect(isValidCep('12345678')).toBe(true);
      expect(isValidCep('01310-100')).toBe(true);
    });

    it('deve rejeitar CEP inválido', () => {
      expect(isValidCep('1234567')).toBe(false);
      expect(isValidCep('123456789')).toBe(false);
      expect(isValidCep('abcdefgh')).toBe(false);
      expect(isValidCep('')).toBe(false);
    });
  });

  describe('cleanCep', () => {
    it('deve remover caracteres não numéricos', () => {
      expect(cleanCep('12345-678')).toBe('12345678');
      expect(cleanCep('12.345-678')).toBe('12345678');
      expect(cleanCep('12345678')).toBe('12345678');
    });
  });

  describe('formatCep', () => {
    it('deve formatar CEP com hífen', () => {
      expect(formatCep('12345678')).toBe('12345-678');
      expect(formatCep('01310100')).toBe('01310-100');
    });

    it('deve retornar entrada original se inválida', () => {
      expect(formatCep('123')).toBe('123');
      expect(formatCep('12345-678')).toBe('12345-678');
    });
  });

  describe('maskCep', () => {
    it('deve aplicar máscara durante digitação', () => {
      expect(maskCep('12345')).toBe('12345');
      expect(maskCep('123456')).toBe('12345-6');
      expect(maskCep('12345678')).toBe('12345-678');
    });

    it('deve limitar a 8 dígitos', () => {
      expect(maskCep('123456789')).toBe('12345-678');
    });
  });
});
