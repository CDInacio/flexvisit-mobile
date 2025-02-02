import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { useState } from 'react';
import RNPickerSelect from 'react-native-picker-select';

import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '~/navigation';
import { useGetBookings } from '~/hooks/useGetBookings';
import type { Booking } from '~/types/booking';
import { formatDate } from '~/utils/formatDate';
import Badge from '~/components/Badge';
import { getFirstNames } from '~/utils/formateName';
import { FontAwesome } from '@expo/vector-icons';

type BookingNavigationProp = StackNavigationProp<RootStackParamList, 'Agendamento'>;

function BookingList({
  bookings,
  filter,
  onPress,
}: {
  bookings: Booking[] | undefined;
  filter: string | null;
  onPress: (id: string) => void;
}) {
  const filteredBookings =
    filter && filter !== 'all'
      ? bookings?.filter((booking: Booking) => booking.status === filter)
      : bookings;

  return (
    <>
      {filteredBookings?.map((booking: Booking, index: number) => (
        <TouchableOpacity
          onPress={() => onPress(booking.id)}
          key={index}
          className={`mb-4 flex flex-row justify-between rounded-lg bg-white p-4 shadow-md`}>
          {/* Informações do agendamento */}
          <View className="flex-1 pr-4">
            <Text className="mb-3 text-lg font-bold">
              {getFirstNames(booking?.user?.fullname, 2)}
            </Text>
            <View className="flex flex-row items-center">
              <FontAwesome className="mr-1" name="calendar" size={15} color="black" />
              <Text className="text-gray-800">{(booking.data as any).data}</Text>
            </View>
            <View className="mt-1 flex flex-row items-center">
              <FontAwesome className="mr-1" name="clock-o" size={15} color="black" />
              <Text className="text-sm text-gray-600">
                {(booking as any).data.starttime} - {(booking as any).data.endtime}
              </Text>
            </View>
          </View>

          <View className="flex items-center ">
            <Badge status={(booking as any).status} />
          </View>
        </TouchableOpacity>
      ))}
    </>
  );
}

export default function Bookings() {
  const navigation = useNavigation<BookingNavigationProp>();
  const [filter, setFilter] = useState<string | null>(null);

  const { data: allBookings } = useGetBookings();
  console.log(allBookings);
  const handleGoToDetailsPage = (id: string) => {
    navigation.navigate('Agendamento', { id });
  };

  return (
    <SafeAreaView className="mt-4 flex-1 ">
      {/* Header */}
      <Text className="text-center text-xl font-bold text-gray-800">Agendamentos</Text>

      {/* Dropdown para Filtro */}
      <View className="m-4">
        <RNPickerSelect
          onValueChange={(value) => setFilter(value)}
          placeholder={{
            label: 'Selecione um status...',
            value: 'all',
          }}
          items={[
            { label: 'Pendente', value: 'pendente' },
            { label: 'Aprovado', value: 'aprovado' },
            { label: 'Cancelado', value: 'cancelado' },
            { label: 'Concluído', value: 'concluido' },
            { label: 'Todos', value: 'all' },
          ]}
          style={{
            inputAndroid: {
              width: '30%',
              height: 50,
              backgroundColor: '#ffffff',
              paddingHorizontal: 10,
              paddingVertical: 8,
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 5,
              color: 'black',
            },
            inputIOS: {
              backgroundColor: '#ffffff',
              paddingHorizontal: 10,
              paddingVertical: 8,
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 5,
              color: 'black',
            },
          }}
        />
      </View>

      <ScrollView className="flex-1 px-4 py-6 " contentContainerStyle={{ paddingBottom: 20 }}>
        <BookingList bookings={allBookings} filter={filter} onPress={handleGoToDetailsPage} />
      </ScrollView>
    </SafeAreaView>
  );
}
