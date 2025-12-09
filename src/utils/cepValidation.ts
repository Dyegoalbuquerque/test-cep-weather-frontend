
export function isValidCep(cep: string): boolean {
  const cleanCep = cep.replace(/\D/g, '');
  return cleanCep.length === 8 && /^\d{8}$/.test(cleanCep);
}

export function cleanCep(cep: string): string {
  return cep.replace(/\D/g, '');
}


export function formatCep(cep: string): string {
  const clean = cleanCep(cep);
  if (clean.length !== 8) return cep;
  return `${clean.slice(0, 5)}-${clean.slice(5)}`;
}


export function maskCep(value: string): string {
  const clean = value.replace(/\D/g, '');
  if (clean.length <= 5) {
    return clean;
  }
  return `${clean.slice(0, 5)}-${clean.slice(5, 8)}`;
}
