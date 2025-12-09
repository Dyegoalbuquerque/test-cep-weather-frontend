import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { isValidCep, maskCep } from '@/utils/cepValidation';
import { Button } from '@/components/Button/Button';
import './CepForm.css';

const cepSchema = z.object({
  cep: z.string().refine(isValidCep, {
    message: 'CEP inválido. Digite 8 dígitos.',
  }),
});

type CepFormData = z.infer<typeof cepSchema>;

interface CepFormProps {
  onSubmit: (cep: string) => void;
  isLoading?: boolean;
  clearSignal?: number;
}

export function CepForm({ onSubmit, isLoading = false, clearSignal }: CepFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<CepFormData>({
    resolver: zodResolver(cepSchema),
    mode: 'onChange',
  });

  const cepValue = watch('cep');

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskCep(e.target.value);
    setValue('cep', masked, { shouldValidate: true });
  };

  const handleFormSubmit = (data: CepFormData) => {
    onSubmit(data.cep);
  };

  useEffect(() => {
    if (typeof clearSignal === 'number') {
      reset({ cep: '' });
    }
  }, [clearSignal, reset]);

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="cep-form">
      <div className="cep-form__field">
        <label htmlFor="cep" className="cep-form__label">
          CEP
        </label>
        <input
          {...register('cep')}
          id="cep"
          type="text"
          placeholder="00000-000"
          maxLength={9}
          className={`cep-form__input ${errors.cep ? 'cep-form__input--error' : ''}`}
          onChange={handleCepChange}
          disabled={isLoading}
          autoComplete="postal-code"
        />
        {errors.cep && (
          <span className="cep-form__error" role="alert">
            {errors.cep.message}
          </span>
        )}
      </div>

      <Button
        type="submit"
        isLoading={isLoading}
        disabled={!cepValue || !!errors.cep}
      >
        Consultar
      </Button>
    </form>
  );
}
