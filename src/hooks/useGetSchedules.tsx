import { useQuery } from '@tanstack/react-query';
import { getSchedules } from '~/api/schedule/shedules';
import scheduleService from '~/services/scheduleSercive';

export function useGetSchedule() {
  return useQuery({
    queryKey: ['schedules'],
    queryFn: scheduleService.getSchedules,
    refetchInterval: 3000,
  });
}
