import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from '@/components/Card/Card';

describe('Card', () => {
  it('deve renderizar children', () => {
    render(<Card>Conteúdo do card</Card>);
    expect(screen.getByText('Conteúdo do card')).toBeInTheDocument();
  });

  it('deve aplicar className adicional', () => {
    const { container } = render(
      <Card className="custom-class">Teste</Card>
    );
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('card');
    expect(card.className).toContain('custom-class');
  });

  it('deve renderizar como div por padrão', () => {
    const { container } = render(<Card>Teste</Card>);
    expect(container.querySelector('div.card')).toBeInTheDocument();
  });

  it('deve aceitar múltiplos children', () => {
    render(
      <Card>
        <h1>Título</h1>
        <p>Parágrafo</p>
      </Card>
    );
    expect(screen.getByText('Título')).toBeInTheDocument();
    expect(screen.getByText('Parágrafo')).toBeInTheDocument();
  });
});
