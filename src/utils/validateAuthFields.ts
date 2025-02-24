import { showToast } from './toast';

export const validateFields = (
  fields: { [key: string]: string },
  requiredFields: { key: string; label: string }[]
) => {
  const missingFields = requiredFields.filter(({ key }) => !fields[key]);

  if (missingFields.length > 0) {
    showToast('error', 'Erro!', `Por favor, preencha todos os campos para continuar.`);
    return false;
  }

  return true;
};
