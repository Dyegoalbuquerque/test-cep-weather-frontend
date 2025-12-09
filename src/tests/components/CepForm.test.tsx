import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CepForm } from '@/components/CepForm/CepForm';

describe('CepForm', () => {
  it('deve renderizar formulário', () => {
    render(<CepForm onSubmit={() => {}} />);
    expect(screen.getByLabelText(/cep/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /consultar/i })).toBeInTheDocument();
  });

  it('deve aplicar máscara de CEP', async () => {
    const user = userEvent.setup();
    render(<CepForm onSubmit={() => {}} />);

    const input = screen.getByLabelText(/cep/i) as HTMLInputElement;
    await user.type(input, '01310100');

    expect(input.value).toBe('01310-100');
  });

  it('deve validar CEP inválido', async () => {
    const user = userEvent.setup();
    render(<CepForm onSubmit={() => {}} />);

    const input = screen.getByLabelText(/cep/i);
    await user.type(input, '123');

    expect(screen.getByText(/cep inválido/i)).toBeInTheDocument();
  });

  it('deve chamar onSubmit com CEP válido', async () => {
    const user = userEvent.setup();
    let submittedCep = '';
    const handleSubmit = (cep: string) => { submittedCep = cep; };

    render(<CepForm onSubmit={handleSubmit} />);

    const input = screen.getByLabelText(/cep/i);
    const button = screen.getByRole('button', { name: /consultar/i });

    await user.type(input, '01310100');
    await user.click(button);

    expect(submittedCep).toBe('01310-100');
  });

  it('deve desabilitar botão quando loading', () => {
    render(<CepForm onSubmit={() => {}} isLoading />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('deve desabilitar input quando loading', () => {
    render(<CepForm onSubmit={() => {}} isLoading />);
    expect(screen.getByLabelText(/cep/i)).toBeDisabled();
  });
});
