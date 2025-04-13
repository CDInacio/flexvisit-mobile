import { FontAwesome } from '@expo/vector-icons';
import {
  Image,
  Pressable,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserBadge } from '~/components/userBdge';
import { useGetUser } from '~/hooks/useGetUser';
import { useLogout } from '~/hooks/useLogout';
import { formatDate } from '~/utils/formatDate';
import { useState, useEffect } from 'react';
import { useUpdateUser } from '~/hooks/useUpdateUser';
import { ScrollView } from 'react-native-gesture-handler';
import { showToast } from '~/utils/toast';
import Toast from 'react-native-toast-message';
import { useQueryClient } from '@tanstack/react-query';

export default function Profile({ route }: { route: { name: string } }) {
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useGetUser();
  const logout = useLogout();
  const { mutate: updateUser, isPending: isLoadingUpdateUser } = useUpdateUser();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    fullname: '',
    email: '',
    phoneNumber: '',
    document: '',
  });

  const [initialUserData, setInitialUserData] = useState({
    fullname: '',
    email: '',
    phoneNumber: '',
    document: '',
  });

  useEffect(() => {
    if (user) {
      const userData = {
        fullname: user.fullname || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        document: user.document || '',
      };
      setUserData(userData);
      setInitialUserData(userData);
    }
  }, [user]);

  const handleChange = (field: string, value: string) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateUser(
      { id: user?.id, data: userData },
      {
        onSuccess: () => {
          showToast('success', 'Pronto!', 'Informações atualizadas com sucesso');
        },
        onError: (error: Error) => {
          showToast('error', 'Erro!', error.message);
        },
      }
    );
  };

  const handleCancel = () => {
    setUserData(initialUserData);
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#121212" />
      </View>
    );
  }

  return (
    <SafeAreaView className="mt-4 flex-1 px-5">
      <View className="mt-4 flex items-center">
        <Text className="font-extrabold">{route.name}</Text>
      </View>
      <KeyboardAvoidingView
        behavior="padding"
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <Pressable onPress={() => logout(queryClient)} className="items-end justify-end">
              <FontAwesome name="sign-out" size={24} color="black" />
            </Pressable>
            <View className="mt-5 flex flex-row justify-center ">
              <View className="flex items-center">
                <Image
                  source={{ uri: user?.profileImage }}
                  className="mb-3 h-52 w-52 rounded-full "
                />
                <UserBadge userAccesLevel={user?.role} />
                <Text className="mt-2 font-extrabold">{user?.fullname}</Text>
              </View>
            </View>
            <View className="flex-1">
              <View className="py-8">
                <View className="flex flex-row items-start gap-3 text-red-300">
                  <FontAwesome name="envelope" size={24} color="#6b7280" />
                  <View>
                    <Text className="text-gray-500">Email</Text>
                    {isEditing ? (
                      <TextInput
                        value={userData.email}
                        onChangeText={(value) => handleChange('email', value)}
                        className="font-bold"
                        placeholder="Digite o email"
                      />
                    ) : (
                      <Text className="font-bold">{userData.email}</Text>
                    )}
                  </View>
                </View>
              </View>
              <View className="h-[0.5px] bg-gray-500"></View>

              <View className="py-8">
                <View className="flex flex-row items-start gap-3 text-red-300">
                  <FontAwesome name="phone" size={24} color="#6b7280" />
                  <View>
                    <Text className="text-gray-500">Telefone</Text>
                    {isEditing ? (
                      <TextInput
                        value={userData.phoneNumber}
                        onChangeText={(value) => handleChange('phoneNumber', value)}
                        className="font-bold"
                        placeholder="Digite o telefone"
                      />
                    ) : (
                      <Text className="font-bold">{userData.phoneNumber}</Text>
                    )}
                  </View>
                </View>
              </View>
              <View className="h-[0.5px] bg-gray-500"></View>

              <View className="py-8">
                <View className="flex flex-row items-start gap-3 text-red-300">
                  <FontAwesome name="id-card" size={24} color="#6b7280" />
                  <View>
                    <Text className="text-gray-500">Documento</Text>
                    {isEditing ? (
                      <TextInput
                        value={userData.document}
                        onChangeText={(value) => handleChange('document', value)}
                        className="font-bold"
                        placeholder="Digite o documento"
                      />
                    ) : (
                      <Text className="font-bold">{userData.document}</Text>
                    )}
                  </View>
                </View>
              </View>
              <View className="h-[0.5px] bg-gray-500"></View>
              <View className="py-8">
                <View className="flex flex-row items-start gap-3 text-red-300">
                  <FontAwesome name="calendar" size={24} color="#6b7280" />
                  <View>
                    <Text className="text-gray-500">Entrou em</Text>
                    <Text className="font-bold">{formatDate(user?.createdAt)}</Text>
                  </View>
                </View>
              </View>
              {isEditing ? (
                <View className="flex flex-row gap-4 py-8">
                  <TouchableOpacity className="rounded bg-gray-800 px-6 py-3" onPress={handleSave}>
                    {isLoadingUpdateUser ? (
                      <ActivityIndicator size={'small'} color="#ffff" />
                    ) : (
                      <Text className="font-bold text-white">Salvar</Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="rounded border-[1.5px] border-gray-800 bg-white px-6 py-3 "
                    onPress={handleCancel}>
                    <Text className="font-bold text-gray-800">Cancelar</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  className="rounded-lg bg-[#383838] px-6 py-3 "
                  onPress={() => setIsEditing(true)}>
                  <Text className="text-center text-lg font-bold text-white">Editar</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <Toast />
    </SafeAreaView>
  );
}
