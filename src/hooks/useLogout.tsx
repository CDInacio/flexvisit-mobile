import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import useAuthStore from '~/store/store';

export function useLogout() {
  const { setUserData } = useAuthStore();
  const navigation = useNavigation<any>();

  const logout = () => {
    setUserData(null);
    AsyncStorage.removeItem('user');
    AsyncStorage.removeItem('userToken');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return logout;
}
