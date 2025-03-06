import { useMutation } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import userService from '~/services/userService';
import type { UserSignupCredentials } from '~/types/user';
import { showToast } from '~/utils/toast';

export function useSignup() {
  const navigation = useNavigation<any>();
  return useMutation({
    mutationFn: (data: UserSignupCredentials) => userService.signup(data),
    onSuccess: async (data) => {
      showToast('success', 'Sucesso!', 'Usuário cadastrado com sucesso.');
      if (data) {
        setTimeout(() => {
          navigation.navigate('Login');
        }, 2000);
      }
    },
    onError: (error) => {
      console.log(error);
      showToast('error', 'Erro!', error.message);
    },
  });
}
