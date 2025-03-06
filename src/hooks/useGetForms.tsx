import { useQuery } from '@tanstack/react-query';
import formService from '~/services/formService';

export function useGetForms() {
  return useQuery({
    queryKey: ['forms'],
    queryFn: formService.getForms,
  });
}
