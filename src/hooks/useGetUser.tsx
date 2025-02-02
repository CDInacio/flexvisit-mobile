import { useQuery } from '@tanstack/react-query';
import userService from '~/services/userService';

export function useGetUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: userService.getUserInfo,
    refetchInterval: 3000,
    // staleTime: 1000 * 60 * 5,
  });
}
