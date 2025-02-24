import React, { useState } from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import { useGetNotifications } from '~/hooks/useGetNotifications';
import { useGetBookings } from '~/hooks/useGetBookings';
import { PieChart } from 'react-native-gifted-charts';
import useAuthStore from '~/store/store';
import type { Notification } from '~/types/notification';
import type { TabParamList } from '~/navigation/tab-navigator';
import { getFirstNames } from '~/utils/formateName';
import { useGetUserBookings } from '~/hooks/useGetUserBookings';
import type { Booking } from '~/types/booking';
import Badge from '~/components/Badge';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '~/navigation';
import { ActivityIndicator } from 'react-native-paper';

type HomeScreenProps = BottomTabScreenProps<TabParamList, 'Home'>;
type BookingNavigationProp = StackNavigationProp<RootStackParamList, 'Agendamento'>;

export default function HomeScreen({ route }: HomeScreenProps) {
  const { data: userBookings, refetch } = useGetUserBookings();
  const navigation = useNavigation<BookingNavigationProp>();
  const { user } = useAuthStore();
  const { data: bookings, isLoading } = useGetBookings();
  const { data: notifications } = useGetNotifications();
  const unreadNotifications: Notification[] =
    notifications?.filter((n: Notification) => !n.read) || [];
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const handleGoToDetailsPage = (id: string) => {
    navigation.navigate('Agendamento', { id });
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const closeDropdown = () => {
    setDropdownVisible(false);
  };

  const countByStatus = (data: any[]) => {
    const counts = { aprovado: 0, cancelado: 0, concluido: 0, pendente: 0 };
    data.forEach((item: { status: 'aprovado' | 'cancelado' | 'concluido' | 'pendente' }) => {
      if (counts[item.status as keyof typeof counts] !== undefined) {
        counts[item.status] += 1;
      }
    });
    return counts;
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      // toast({
      //   variant: 'destructive',
      //   title: 'Erro',
      //   description: 'Falha ao atualizar os agendamentos',
      // });
    } finally {
      setIsRefreshing(false);
    }
  };

  const statusCounts = countByStatus(bookings || []);
  const total = Object.values(statusCounts).reduce((sum, count) => sum + count, 0);

  const pieData = [
    {
      value: statusCounts.aprovado || 0,
      color: '#4ade80',
      gradientCenterColor: '#2ed573',
      label: 'Aprovado',
    },
    {
      value: statusCounts.cancelado || 0,
      color: '#fb7185',
      gradientCenterColor: '#ff5252',
      label: 'Cancelado',
    },
    {
      value: statusCounts.concluido || 0,
      color: '#38bdf8',
      gradientCenterColor: '#0ea5e9',
      label: 'Concluído',
    },
    {
      value: statusCounts.pendente || 0,
      color: '#fbbf24',
      gradientCenterColor: '#f59f00',
      label: 'Pendente',
    },
  ];

  const renderDot = (color: string) => (
    <View className="mr-2 h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
  );

  const renderLegendComponent = () => (
    <View className="flex-row flex-wrap justify-start">
      {pieData.map((item, index) => (
        <View key={index} className="mx-2 mb-2 flex-row items-center">
          {renderDot(item.color)}
          <Text className="text-slate-700">
            {item.label}: {item.value}
          </Text>
        </View>
      ))}
    </View>
  );

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <View className="mb-2 rounded bg-gray-100 p-2 shadow">
      <Text className="font-bold text-gray-800">{item.message}</Text>
      <Text className="text-sm text-gray-600">{item.description}</Text>
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={closeDropdown}>
      <SafeAreaView className="mt-4 flex-1">
        {user?.role !== 'USER' && (
          <View className="mt-4 flex-row items-center justify-between  gap-3  px-5">
            <TouchableOpacity>
              <Image source={{ uri: user?.profileImage }} className="h-8 w-8 rounded-full" />
            </TouchableOpacity>
            <Text className="font-bold">{route.name}</Text>
            <View className="flex-row items-center gap-3 px-5">
              <TouchableOpacity onPress={toggleDropdown}>
                <FontAwesome name="bell-o" size={20} color="black" />
                {unreadNotifications.length > 0 && (
                  <View className="absolute -top-1.5 right-0 h-5 w-5 items-center justify-center rounded-full bg-red-600">
                    <Text className="text-xs font-bold text-white">
                      {unreadNotifications.length}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              {dropdownVisible && (
                <View className="absolute right-4  top-7  mt-2 w-60 rounded bg-white shadow-lg">
                  <Text className="px-4 py-2 font-bold text-gray-700">Notificações</Text>
                  <FlatList
                    data={unreadNotifications}
                    keyExtractor={(item) => item.id}
                    renderItem={renderNotificationItem}
                    contentContainerStyle={{ padding: 8 }}
                  />
                </View>
              )}
            </View>
          </View>
        )}
        {user?.role === 'ADMIN' || user?.role === 'COORDINATOR' || user?.role === 'ATTADANT' ? (
          <View className="mx-4 mt-10">
            <Text
              style={{ fontFamily: 'Montserrat-Regular' }}
              className="font-montserrat_medium mb-3 text-xl font-bold text-slate-900">
              Agendamentos por Status
            </Text>
            <View className="overflow-hidden break-normal rounded border border-gray-400 p-3">
              <View style={{ padding: 20, alignItems: 'center' }}>
                <PieChart
                  data={pieData}
                  donut
                  showGradient
                  sectionAutoFocus
                  radius={90}
                  innerRadius={60}
                  centerLabelComponent={() => (
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                      <Text className="text-slate-700">{total}</Text>
                      <Text className="text-slate-700">Total</Text>
                    </View>
                  )}
                />
              </View>
              {renderLegendComponent()}
            </View>
          </View>
        ) : (
          <View className=" flex-1   px-2">
            <View className="z-50 flex flex-row justify-end gap-2">
              <TouchableWithoutFeedback onPress={closeDropdown}>
                <View className="flex-1">
                  <View className="mt-4 flex-row items-center gap-3 px-5">
                    <TouchableOpacity onPress={toggleDropdown}>
                      <FontAwesome name="bell-o" size={20} color="black" />
                      {unreadNotifications.length > 0 && (
                        <View className="right-0-top-1.5 absolute h-5 w-5 items-center justify-center rounded-full bg-red-600">
                          <Text className="text-xs font-bold text-white">
                            {unreadNotifications.length}
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>

                    {dropdownVisible && (
                      <View className="absolute left-4 top-5  mt-2 w-60 rounded bg-white shadow-lg">
                        <Text className="px-4 py-2 font-bold text-gray-700">Notificações</Text>
                        <FlatList
                          data={unreadNotifications}
                          keyExtractor={(item) => item.id}
                          renderItem={renderNotificationItem}
                          contentContainerStyle={{ padding: 8 }}
                        />
                      </View>
                    )}
                  </View>
                </View>
              </TouchableWithoutFeedback>
              <TouchableOpacity>
                <Image source={{ uri: user?.profileImage }} className="h-8 w-8 rounded-full" />
              </TouchableOpacity>
            </View>
            <View className="items-center">
              <Image source={{ uri: user?.profileImage }} className="h-52 w-52 rounded-full" />
              <Text className="mt-4 text-2xl font-bold text-[#0F172A]">
                {getFirstNames(user?.fullname, 1)}
              </Text>
              <Text className="text-gray-600">{user?.email}</Text>
            </View>
            <Text className="mt-10 px-2 py-6 text-start text-lg font-semibold text-slate-600">
              Meus agendamentos <Text className=" text-slate-500">{userBookings?.length}</Text>
            </Text>

            {isLoading ? (
              <ActivityIndicator size="small" color="#0000ff" />
            ) : (
              <ScrollView
                className="px-1"
                refreshControl={
                  <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
                }>
                {userBookings?.map((booking: Booking, index: number) => (
                  <TouchableOpacity
                    onPress={() => handleGoToDetailsPage(booking.id)}
                    key={index}
                    className={`mb-4 flex w-full flex-row justify-between rounded-lg   border border-gray-300 bg-white p-4`}>
                    {/* Informações do agendamento */}
                    <View className="flex-1 pr-4">
                      <Text className="mb-3  text-lg font-bold">{booking?.form?.form_name}</Text>
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
              </ScrollView>
            )}
          </View>
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
