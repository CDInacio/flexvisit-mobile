import { Text, View, TouchableOpacity, Alert, Modal } from 'react-native';
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

// Type for route parameters
type BookingRouteProp = RouteProp<RootStackParamList, 'Agendamento'>;

export default function Booking({ route }: { route: BookingRouteProp }) {
  const { user } = useAuthStore();
  const bookingId = route.params.id;
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const { data: booking } = useGetBooking(bookingId);
  const formId = booking?.form?.id;
  const { data: form } = useGetForm(formId!);
  const { mutate: updateStatus, isPending: isLoading } = useUpdateBooking();

  // Estado para controlar a exibição do modal do QR Code
  const [qrModalVisible, setQrModalVisible] = useState(false);

  useEffect(() => {
    if (booking?.data) {
      setFormData(
        Object.keys(booking.data).reduce((acc: { [key: string]: any }, key) => {
          acc[key.toLowerCase()] = (booking.data as { [key: string]: any })[key]; // Normaliza as chaves para minúsculas
          return acc;
        }, {})
      );
    }
  }, [booking]);

  const handleUpdateStatus = (newStatus: string) => {
    Alert.alert(
      'Confirmação',
      `Tem certeza que deseja alterar o status para "${newStatus}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () => {
            if (booking && user) {
              updateStatus(
                {
                  id: booking.id,
                  status: newStatus,
                  userId: user.id,
                  role: user.role,
                  booking,
                  observation: booking.observation || '',
                },
                {
                  onSuccess: () => {
                    showToast('success', 'Sucesso!', 'Agendamento atualizado com sucesso');
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
      ],
      { cancelable: true }
    );
  };

  if (!booking) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg text-gray-500">Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="mt-4 flex-1 bg-gray-100 px-4">
      <View className="rounded-lg bg-gray-800 p-4 shadow-md">
        <Text className="mb-3 text-xl font-bold text-gray-100">{booking?.form?.form_name}</Text>
        <Text className="text-sm text-gray-300">{booking?.form?.form_description}</Text>
      </View>
      <View className="my-4">
        <Badge status={booking.status} />
      </View>

      <View className="mb-4 rounded-lg bg-white p-4 shadow-md">
        <Text className="mb-3 text-lg font-semibold text-gray-700">Detalhes da Reserva:</Text>
        {form?.form_fields.map((field: any, i: number) => (
          <View key={i}>
            <Text className="mr-2 font-extrabold text-gray-700">{field.field_name}</Text>
            <Text className="text-gray-600 ">
              : {formData[field.field_name.toLowerCase()] || ''}
            </Text>
          </View>
        ))}
      </View>

      {/* Informações Adicionais */}
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

      {/* QR Code */}
      {booking.qrCode && (
        <TouchableOpacity onPress={() => setQrModalVisible(true)} className="mb-4 items-center">
          <Text className="mb-2 text-lg font-semibold text-gray-700">QR Code do Agendamento</Text>
          <Image source={{ uri: booking.qrCode }} className="h-40 w-40 rounded-lg" />
        </TouchableOpacity>
      )}

      {/* Modal para Exibir o QR Code Ampliado */}
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

      {/* Botões de Ação */}
      {user?.role === 'ADMIN' || user?.role === 'ATTENDANT' ? (
        <View className="mt-4 flex-row justify-around gap-3 space-x-4">
          <TouchableOpacity
            className="flex-1 rounded-lg bg-green-400 px-6 py-3 text-center"
            onPress={() => handleUpdateStatus('aprovado')}
            disabled={isLoading}>
            <Text className="text-center text-lg font-semibold text-white">Aprovar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 rounded-lg bg-blue-400 px-6 py-3 text-center"
            onPress={() => handleUpdateStatus('concluido')}
            disabled={isLoading}>
            <Text className="text-center text-lg font-semibold text-white">Concluir</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 rounded-lg bg-red-400 px-6 py-3 text-center"
            onPress={() => handleUpdateStatus('cancelado')}
            disabled={isLoading}>
            <Text className="text-center text-lg font-semibold text-white">Cancelar</Text>
          </TouchableOpacity>
        </View>
      ) : null}
      <Toast />
    </ScrollView>
  );
}
