import { FontAwesome } from '@expo/vector-icons';
import type { is } from 'date-fns/locale';
import { View } from 'lucide-react-native';
import { Text, TouchableOpacity } from 'react-native';

interface NotificationsProps {
  unreadNotifications: any[];
  onPress: () => void;
  isDropdownVisible: boolean;
}

export default function Notifications({
  unreadNotifications,
  onPress,
  isDropdownVisible,
}: NotificationsProps) {
  return (
    <>
      <TouchableOpacity onPress={onPress}>
        <FontAwesome name="bell-o" size={20} color="black" />
        {unreadNotifications.length > 0 && (
          <View className="right-0-top-1.5 absolute h-5 w-5 items-center justify-center rounded-full bg-red-600">
            <Text className="text-xs font-bold text-white">{unreadNotifications.length}</Text>
          </View>
        )}
      </TouchableOpacity>

      {isDropdownVisible && (
        <View className="absolute left-4 top-5  mt-2 w-60 rounded bg-white shadow-lg">
          <Text className="px-4 py-2 font-bold text-gray-700">Notificações</Text>
          {unreadNotifications.map((notification) => (
            <View className="mb-2 rounded bg-gray-100 p-2 shadow">
              <Text className="font-bold text-gray-800">{notification.message}</Text>
              <Text className="text-sm text-gray-600">{notification.description}</Text>
            </View>
          ))}
        </View>
      )}
    </>
  );
}
