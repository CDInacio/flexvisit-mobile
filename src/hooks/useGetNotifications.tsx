import { useQuery } from '@tanstack/react-query';
import { getNotifications } from '~/api/notifications/notifications';
import notificationService from '~/services/notificationService';
import { Notification } from '~/types/notification';

export function useGetNotifications() {
  return useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: notificationService.getNotifications,
  });
}
