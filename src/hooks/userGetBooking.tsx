import { useQuery } from '@tanstack/react-query';
import bookingService from '~/services/bookingservice';

export function useGetBooking(id: string) {
  return useQuery({
    queryKey: ['booking', id],
    queryFn: ({ queryKey }) => bookingService.getBooking(queryKey[1]),
    // staleTime: 3000,
    // refetchOnWindowFocus: false,
  });
}
