import { FontAwesome } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import Badge from '../Badge';
import type { Booking } from '~/types/booking';

interface BookingItemProps {
  booking: Booking;
  handleGoToDetailsPage: (id: string) => void;
}

export default function BookingItem({ booking, handleGoToDetailsPage }: BookingItemProps) {
  return (
    <TouchableOpacity
      onPress={() => handleGoToDetailsPage(booking.id)}
      className={`mb-4 flex w-full flex-row justify-between rounded-lg bg-white p-4 shadow-md`}>
      <View className="flex-1 pr-4">
        <Text className="mb-3 text-lg font-bold">{booking?.form?.form_name || 'Form Name'}</Text>
        <View className="flex flex-row items-center">
          <FontAwesome className="mr-1" name="calendar" size={15} color="black" />
          <Text className="text-gray-800">
            {(booking?.data as any)?.data || 'Data not available'}
          </Text>
        </View>
        <View className="mt-1 flex flex-row items-center">
          <FontAwesome className="mr-1" name="clock-o" size={15} color="black" />
          <Text className="text-sm text-gray-600">
            {(booking?.data as any)?.starttime || 'Start time not available'} -{' '}
            {(booking?.data as any)?.endtime || 'End time not available'}
          </Text>
        </View>
      </View>

      <View className="flex items-center ">
        <Badge status={(booking?.status as any) || 'Unknown'} />
      </View>
    </TouchableOpacity>
  );
}
