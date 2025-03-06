import { useQuery } from '@tanstack/react-query';
import bookingService from '~/services/bookingservice';
import formService from '~/services/formService';

export function useGetDataOverView() {
  return useQuery({
    queryKey: ['dataOverview'],
    queryFn: bookingService.getDataOverview,
  });
}
