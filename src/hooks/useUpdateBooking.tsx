import { useMutation } from '@tanstack/react-query';
import bookingService from '~/services/bookingservice';

export function useUpdateBooking() {
  return useMutation({
    mutationFn: bookingService.updateBookingStatus,
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
