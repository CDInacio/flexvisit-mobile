import { useQuery } from '@tanstack/react-query';
import { getForm } from '~/api/form/form';
import formService from '~/services/formService';

export function useGetForm(id: string) {
  return useQuery({
    queryKey: ['form', id],
    queryFn: ({ queryKey }) => formService.getForm(queryKey[1]),
  });
}
