import { useMutation } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import useAuthStore from '~/store/store';
import userService from '~/services/userService';

export function useSignin() {
  const { setUserData } = useAuthStore();

  const navigation = useNavigation<any>();
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      userService.login(email, password),
    onSuccess: async (data) => {
      if (data) {
        setUserData(data.user);
        navigation.reset({
          index: 0,
          routes: [{ name: 'TabNavigator' }],
        });
      }
    },
  });
}
