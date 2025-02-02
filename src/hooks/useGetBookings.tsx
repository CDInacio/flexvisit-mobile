import { useQuery } from '@tanstack/react-query';
import bookingService from '~/services/bookingservice';
export function useGetBookings() {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: bookingService.getBookings,
    refetchInterval: 5000,
  });
}
