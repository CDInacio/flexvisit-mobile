import { Text, View, TouchableOpacity, Alert, Modal, TextInput, Pressable } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { useGetBooking } from '~/hooks/userGetBooking';
import { useUpdateBooking } from '~/hooks/useUpdateBooking';
import useAuthStore from '~/store/store';
import { useEffect, useState } from 'react';
import { useGetForm } from '~/hooks/useGetForm';
import Badge from '~/components/Badge';
import { format } from 'date-fns';
import Toast from 'react-native-toast-message';
import { showToast } from '~/utils/toast';
import type { RootStackParamList } from '~/navigation';
import { ScrollView } from 'react-native-gesture-handler';
import { Image } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { PaperProvider } from 'react-native-paper';

type BookingRouteProp = RouteProp<RootStackParamList, 'Agendamento'>;

export default function Booking({ route }: { route: BookingRouteProp }) {
  const { user } = useAuthStore();
  const bookingId = route.params.id;
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const { data: booking, isLoading: isBookingLoading } = useGetBooking(bookingId);
  const formId = booking?.form?.id;
  const { data: form, isLoading: isFormLoading } = useGetForm(formId!);
  const { mutate: updateStatus, isPending: isLoading } = useUpdateBooking();
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [isObservationModalVisible] = useState(false);
  const [observation, setObservation] = useState('');
  const [statusModalVisible, setStatusModalVisible] = useState(false);

  useEffect(() => {
    if (booking?.data) {
      setFormData(
        Object.keys(booking.data).reduce((acc: { [key: string]: any }, key) => {
          acc[key.toLowerCase()] = (booking.data as { [key: string]: any })[key];
          return acc;
        }, {})
      );
    }
  }, [booking]);

  const confirmStatusUpdate = (newStatus: string) => {
    setStatusModalVisible(false);
    Alert.alert('Confirmação', `Deseja alterar o status para "${newStatus}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Confirmar',
        onPress: () => {
          if (booking && user) {
            updateStatus(
              {
                id: booking.id,
                status: newStatus,
                userId: booking.user?.id,
                role: booking.user?.role,
                booking,
                observation: observation || booking.observation || '',
              },
              {
                onSuccess: () => {
                  showToast('success', 'Sucesso!', 'Agendamento atualizado com sucesso');
                  setObservation('');
                },
                onError: () => {
                  showToast('error', 'Erro!', 'Erro ao atualizar agendamento');
                },
              }
            );
          } else {
            showToast('error', 'Erro!', 'Erro ao atualizar agendamento');
          }
        },
      },
    ]);
  };

  if (isBookingLoading || isFormLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#374151" />
      </View>
    );
  }

  return (
    <PaperProvider>
      <ScrollView className="my-4 flex-1 bg-gray-100 px-4">
        <View className="rounded-lg bg-[#383838] p-4 shadow-md">
          <Text className="mb-3 text-xl font-bold text-gray-100">{booking?.form?.form_name}</Text>
          <Text className="text-sm text-gray-300">{booking?.form?.form_description}</Text>
        </View>
        <View className="my-4">
          <Badge status={booking.status} />
        </View>

        <View className="mb-4 rounded-lg bg-white p-4 shadow-md">
          <Text className="mb-3 text-lg font-semibold text-gray-700">Detalhes da Reserva:</Text>
          {form?.form_fields.map((field: any, i: number) => (
            <View key={i} className="flex flex-row flex-wrap">
              <Text className="mr-2 font-extrabold text-gray-700">{field.field_name}:</Text>
              <Text className="text-gray-600 ">
                {formData[field.field_name.toLowerCase()] || ''}
              </Text>
            </View>
          ))}
        </View>

        <View className="mb-4 rounded-lg bg-gray-200 p-4 shadow-md">
          <Text className="mb-2 text-lg font-semibold text-gray-700">Informações adicionais:</Text>
          <Text className="text-gray-600">
            <Text className="mr-1 font-semibold">Observação: </Text>
            {booking.observation || 'Nenhuma observação'}
          </Text>
          <Text className="text-gray-600">
            <Text className="mr-1 font-semibold">Criado em: </Text>
            {format(new Date(booking.createdAt), 'dd/MM/yyyy: HH:mm')}
          </Text>
        </View>

        {booking.qrCode && (
          <TouchableOpacity onPress={() => setQrModalVisible(true)} className="mb-4 items-center">
            <Text className="mb-2 text-lg font-semibold text-gray-700">QR Code do Agendamento</Text>
            <Image source={{ uri: booking.qrCode }} className="h-40 w-40 rounded-lg" />
          </TouchableOpacity>
        )}

        <Modal visible={qrModalVisible} transparent={true} animationType="fade">
          <View className="flex-1 items-center justify-center bg-black/70">
            <TouchableOpacity
              onPress={() => setQrModalVisible(false)}
              className="absolute right-5 top-5 p-2">
              <Text className="text-xl text-white">X</Text>
            </TouchableOpacity>
            <Image
              source={{ uri: booking.qrCode }}
              className="h-96 w-96 rounded-lg"
              resizeMode="contain"
            />
          </View>
        </Modal>

        <Modal visible={isObservationModalVisible} transparent={true} animationType="slide">
          <View className="flex-1 items-center justify-center bg-black/50">
            <View className="w-4/5 rounded-lg bg-white p-6">
              <Text className="mb-2 text-lg font-semibold text-gray-700">
                Adicionar Observação:
              </Text>
              <TextInput
                className="mb-4 rounded-lg border border-gray-300 bg-white p-3 text-gray-700"
                placeholder="Digite uma observação opcional..."
                value={observation}
                onChangeText={setObservation}
                multiline
              />
            </View>
          </View>
        </Modal>

        {user?.role === 'ADMIN' || user?.role === 'ATTENDANT' ? (
          <TouchableOpacity
            className="rounded-lg bg-[#383838] px-6 py-3 "
            onPress={() => setStatusModalVisible(true)}>
            {isLoading ? (
              <ActivityIndicator />
            ) : (
              <Text className="text-center text-lg font-bold text-white">Editar</Text>
            )}
          </TouchableOpacity>
        ) : null}
        <Modal visible={statusModalVisible} transparent={true} animationType="slide">
          <View className="flex-1 items-center justify-center bg-black/50">
            <View className="w-4/5 rounded-lg bg-white p-6">
              <View>
                <Text className="mb-4 text-center  text-lg font-semibold text-gray-700">
                  Selecione um novo status:
                </Text>
                <Pressable onPress={() => confirmStatusUpdate('aprovado')}>
                  <Text className="my-4 text-center text-gray-800">Aprovar</Text>
                </Pressable>
                <Pressable onPress={() => confirmStatusUpdate('concluido')}>
                  <Text className="my-4 text-center text-gray-800">Concluir</Text>
                </Pressable>
                <Pressable onPress={() => confirmStatusUpdate('cancelado')}>
                  <Text className="my-4 text-center text-gray-800">Cancelar</Text>
                </Pressable>
                <Pressable onPress={() => setStatusModalVisible(false)}>
                  <Text className="my-4 text-center text-gray-800">Fechar</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
        <Toast />
      </ScrollView>
    </PaperProvider>
  );
}
