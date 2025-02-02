import { useQuery } from '@tanstack/react-query';
import { getForms } from '~/api/form/form';
import formService from '~/services/formService';

export function useGetForms() {
  return useQuery({
    queryKey: ['forms'],
    queryFn: formService.getForms,
  });
}
