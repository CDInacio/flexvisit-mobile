import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import type { QueryClient } from '@tanstack/react-query';
import useAuthStore from '~/store/store';

export function useLogout() {
  const { setUserData } = useAuthStore();
  const navigation = useNavigation<any>();

  const logout = (queryClient: QueryClient) => {
    setUserData(null);
    queryClient.clear();
    AsyncStorage.removeItem('user');
    AsyncStorage.removeItem('userToken');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return logout;
}
