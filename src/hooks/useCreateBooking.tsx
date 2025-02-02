import { useMutation, useQueryClient } from '@tanstack/react-query';
import bookingService from '~/services/bookingservice';

export function useCreateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bookingService.createBooking,
    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ['user-bookings'] });
    },
    onError: (error: Error) => {
      console.error(error.message);
      // notify('error', {
      //   params: {
      //     title: 'Hello',
      //     description: 'Wow, that was easy',
      //   },
      // })
    },
  });
}
