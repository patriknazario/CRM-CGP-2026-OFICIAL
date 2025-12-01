
// Calcula quantos dias faltam até uma data específica
export const getDaysUntil = (dateString: string): number => {
  const target = new Date(dateString);
  const today = new Date();
  const diff = target.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

// Verifica se deve exibir o alerta de viabilidade
// Regra: Menos de 15 inscrições E faltam 7 dias ou menos (e não é data passada)
export const shouldShowViabilityAlert = (inscricoes: number, dataInicio: string): boolean => {
  const days = getDaysUntil(dataInicio);
  return inscricoes < 15 && days <= 7 && days >= 0;
};
