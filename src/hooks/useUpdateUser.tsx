import { useMutation, useQueryClient } from '@tanstack/react-query';
import userService from '~/services/userService';

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.updateUser,
    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error: Error) => {
      console.error(error.message);
    },
  });
}
