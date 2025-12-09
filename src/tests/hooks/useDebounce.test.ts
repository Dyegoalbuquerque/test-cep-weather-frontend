import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce, useDebouncedCallback } from '@/hooks/useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('useDebounce', () => {
    it('deve retornar valor inicial imediatamente', () => {
      const { result } = renderHook(() => useDebounce('initial', 500));
      expect(result.current).toBe('initial');
    });

    it('deve debounce mudanças de valor', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'initial', delay: 500 } }
      );

      expect(result.current).toBe('initial');

      rerender({ value: 'updated', delay: 500 });
      expect(result.current).toBe('initial');

      act(() => {
        vi.advanceTimersByTime(300);
      });
      expect(result.current).toBe('initial');

      act(() => {
        vi.advanceTimersByTime(200);
      });
      expect(result.current).toBe('updated'); 
    });

    it('deve cancelar debounce anterior quando valor muda rapidamente', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 500),
        { initialProps: { value: 'first' } }
      );

      rerender({ value: 'second' });
      act(() => vi.advanceTimersByTime(300));

      rerender({ value: 'third' });
      act(() => vi.advanceTimersByTime(300));

      expect(result.current).toBe('first'); 

      act(() => vi.advanceTimersByTime(200));
      expect(result.current).toBe('third');
    });

    it('deve funcionar com diferentes tipos de dados', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 300),
        { initialProps: { value: 0 } }
      );

      expect(result.current).toBe(0);

      rerender({ value: 42 });
      act(() => vi.advanceTimersByTime(300));
      expect(result.current).toBe(42);
    });
  });

  describe('useDebouncedCallback', () => {
    it('deve debounce chamadas de callback', () => {
      const callback = vi.fn();
      const { result } = renderHook(() => useDebouncedCallback(callback, 500));

      act(() => {
        result.current();
      });

      expect(callback).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('deve cancelar chamada anterior quando chamado novamente', () => {
      const callback = vi.fn();
      const { result } = renderHook(() => useDebouncedCallback(callback, 500));

      act(() => {
        result.current('first');
        vi.advanceTimersByTime(300);
        result.current('second');
        vi.advanceTimersByTime(300);
        result.current('third');
      });

      expect(callback).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith('third');
    });

    it('deve passar argumentos corretamente', () => {
      const callback = vi.fn();
      const { result } = renderHook(() => 
        useDebouncedCallback((a: number, b: string) => callback(a, b), 300)
      );

      act(() => {
        result.current(42, 'test');
      });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(callback).toHaveBeenCalledWith(42, 'test');
    });

    it('deve limpar timeout ao desmontar', () => {
      const callback = vi.fn();
      const { result, unmount } = renderHook(() => 
        useDebouncedCallback(callback, 500)
      );

      act(() => {
        result.current();
      });

      unmount();

      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(callback).not.toHaveBeenCalled();
    });
  });
});
