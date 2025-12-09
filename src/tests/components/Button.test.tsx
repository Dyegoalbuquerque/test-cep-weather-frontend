import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/Button/Button';
import userEvent from '@testing-library/user-event';

describe('Button', () => {
  it('deve renderizar com texto correto', () => {
    render(<Button>Clique aqui</Button>);
    expect(screen.getByText('Clique aqui')).toBeInTheDocument();
  });

  it('deve aplicar variant correta', () => {
    const { rerender } = render(<Button variant="primary">Botão</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn--primary');

    rerender(<Button variant="secondary">Botão</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn--secondary');
  });

  it('deve mostrar estado de loading', () => {
    render(<Button isLoading>Enviar</Button>);
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('deve desabilitar quando loading', () => {
    render(<Button isLoading>Enviar</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('deve chamar onClick quando clicado', async () => {
    const user = userEvent.setup();
    let clicked = false;
    const handleClick = () => { clicked = true; };

    render(<Button onClick={handleClick}>Clique</Button>);
    
    await user.click(screen.getByRole('button'));
    expect(clicked).toBe(true);
  });

  it('não deve chamar onClick quando desabilitado', async () => {
    const user = userEvent.setup();
    let clicked = false;
    const handleClick = () => { clicked = true; };

    render(<Button onClick={handleClick} disabled>Clique</Button>);
    
    await user.click(screen.getByRole('button'));
    expect(clicked).toBe(false);
  });
});
