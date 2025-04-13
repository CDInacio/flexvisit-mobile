import { useQuery } from '@tanstack/react-query';
import notificationService from '~/services/notificationService';
import { Notification } from '~/types/notification';

export function useGetNotifications() {
  return useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: notificationService.getNotifications,
  });
}
