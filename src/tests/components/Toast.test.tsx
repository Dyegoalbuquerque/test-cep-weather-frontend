import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toast } from '@/components/Toast/Toast';

describe('Toast', () => {
  it('deve renderizar mensagem de sucesso', () => {
    render(<Toast message="Operação bem-sucedida" type="success" onClose={() => {}} />);
    expect(screen.getByText('Operação bem-sucedida')).toBeInTheDocument();
  });

  it('deve renderizar mensagem de erro', () => {
    render(<Toast message="Erro ao processar" type="error" onClose={() => {}} />);
    expect(screen.getByText('Erro ao processar')).toBeInTheDocument();
  });

  it('deve renderizar mensagem de info', () => {
    render(<Toast message="Informação importante" type="info" onClose={() => {}} />);
    expect(screen.getByText('Informação importante')).toBeInTheDocument();
  });

  it('deve aplicar classe CSS correta para cada tipo', () => {
    const { container, rerender } = render(
      <Toast message="Test" type="success" onClose={() => {}} />
    );
    expect(container.querySelector('.toast--success')).toBeInTheDocument();

    rerender(<Toast message="Test" type="error" onClose={() => {}} />);
    expect(container.querySelector('.toast--error')).toBeInTheDocument();

    rerender(<Toast message="Test" type="info" onClose={() => {}} />);
    expect(container.querySelector('.toast--info')).toBeInTheDocument();
  });

  it('deve chamar onClose ao clicar no botão fechar', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    render(<Toast message="Teste" type="info" onClose={handleClose} />);

    const closeButton = screen.getByRole('button', { name: /fechar/i });
    await user.click(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('deve ter estrutura acessível com botão de fechar', () => {
    const { container } = render(
      <Toast message="Teste" type="success" onClose={() => {}} />
    );
    const closeButton = container.querySelector('.toast__close');
    expect(closeButton).toHaveAttribute('aria-label', 'Fechar');
  });

  it('deve ter role alert para tipos error e success', () => {
    const { container, rerender } = render(
      <Toast message="Erro" type="error" onClose={() => {}} />
    );
    expect(container.querySelector('[role="alert"]')).toBeInTheDocument();

    rerender(<Toast message="Sucesso" type="success" onClose={() => {}} />);
    expect(container.querySelector('[role="alert"]')).toBeInTheDocument();
  });
});
