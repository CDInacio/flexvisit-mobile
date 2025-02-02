import { useQuery } from '@tanstack/react-query';
import bookingService from '~/services/bookingservice';
export function useGetUserBookings() {
  return useQuery({
    queryKey: ['user-bookings'],
    queryFn: bookingService.getUserBookings,
    refetchInterval: 3000,
    // staleTime: 1000 * 60 * 5,
  });
}
