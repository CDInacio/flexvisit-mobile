import { Text, View, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
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
import { Button, Divider, Menu, PaperProvider } from 'react-native-paper';

type BookingRouteProp = RouteProp<RootStackParamList, 'Agendamento'>;

export default function Booking({ route }: { route: BookingRouteProp }) {
  const { user } = useAuthStore();
  const bookingId = route.params.id;
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const { data: booking, isLoading: isBookingLoading } = useGetBooking(bookingId);
  const formId = booking?.form?.id;
  const { data: form, isLoading: isFormLoading } = useGetForm(formId!);
  const { mutate: updateStatus, isPending: isLoading } = useUpdateBooking();
  const [statusToUpdate, setStatusToUpdate] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [isObservationModalVisible, setIsObservationModalVisible] = useState(false);
  const [observation, setObservation] = useState('');

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

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

  const openObservationModal = (newStatus: string) => {
    setStatusToUpdate(newStatus);
    setIsObservationModalVisible(true);
  };

  const confirmStatusUpdate = () => {
    setIsObservationModalVisible(false);
    if (statusToUpdate) {
      Alert.alert(
        'Confirmação',
        `Tem certeza que deseja alterar o status para "${statusToUpdate}"?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Confirmar',
            onPress: () => {
              if (booking && user) {
                updateStatus(
                  {
                    id: booking.id,
                    status: statusToUpdate,
                    userId: user.id,
                    role: user.role,
                    booking,
                    observation: observation || booking.observation || '',
                  },
                  {
                    onSuccess: () => {
                      showToast('success', 'Sucesso!', 'Agendamento atualizado com sucesso');
                      setObservation(''); // Limpa o campo após atualização
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
    }
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
              <View className="flex-row justify-end">
                <Button onPress={() => setIsObservationModalVisible(false)}>Cancelar</Button>
                <Button onPress={confirmStatusUpdate} mode="contained" className="ml-2">
                  Confirmar
                </Button>
              </View>
            </View>
          </View>
        </Modal>

        {user?.role === 'ADMIN' || user?.role === 'ATTENDANT' ? (
          <View className="relative mt-4 flex-row justify-center">
            <Menu
              visible={visible}
              onDismiss={closeMenu}
              anchor={
                <Button
                  mode="contained"
                  onPress={openMenu}
                  disabled={isLoading}
                  style={{ backgroundColor: '#1f2937' }}>
                  {isLoading ? (
                    <ActivityIndicator color="#ffff" />
                  ) : (
                    <Text className="font-semibold text-white ">Alterar Status</Text>
                  )}
                </Button>
              }>
              <Menu.Item onPress={() => openObservationModal('aprovado')} title="Aprovar" />
              <Divider />
              <Menu.Item onPress={() => openObservationModal('concluido')} title="Concluir" />
              <Divider />
              <Menu.Item onPress={() => openObservationModal('cancelado')} title="Cancelar" />
            </Menu>
          </View>
        ) : null}

        <Toast />
      </ScrollView>
    </PaperProvider>
  );
}
