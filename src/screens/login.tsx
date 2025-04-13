import React, { useState } from 'react';
import Input from '~/components/Input';
import { Alert, SafeAreaView, Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSignin } from '~/hooks/useSignin';
import useAuthStore from '~/store/store';
import { Button } from '~/components/Button';
import { validateFields } from '~/utils/validateAuthFields';
import Toast from 'react-native-toast-message';
import { showToast } from '~/utils/toast';

export default function LoginScreen() {
  // const { user } = useAuthStore();
  const { mutate: signin, isPending: isLoading } = useSignin();
  const navigation = useNavigation<any>();
  const [form, setForm] = useState({ email: '', password: '' });

  // Função para atualizar os campos do formulário
  const handleInputChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  // Função de validação
  const validateForm = () => {
    const { email, password } = form;

    const requiredFields = [
      { key: 'email', label: 'Email' },
      { key: 'password', label: 'Senha' },
    ];

    if (!validateFields(form, requiredFields)) {
      return;
    }

    if (!email) {
      showToast('error', 'Erro!', 'Por favor, insira um email válido.');
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      showToast('error', 'Erro!', 'Por favor, insira um email válido.');
      return false;
    }

    if (!password) {
      showToast('error', 'Erro!', 'Por favor, insira uma senha válida.');
      return false;
    }

    if (password.length < 6) {
      showToast('error', 'Erro!', 'A senha deve ter pelo menos 6 caracteres.');
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      signin(form);
    }
  };

  return (
    <SafeAreaView style={styles.rootContainer}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Login</Text>
        <View style={styles.spacer} />
        <Input
          placeholder="Email"
          value={form.email}
          onChangeText={(value) => handleInputChange('email', value)}
        />
        <Input
          placeholder="Senha"
          secureTextEntry
          value={form.password}
          onChangeText={(value) => handleInputChange('password', value)}
        />
        <Button
          onPress={handleSubmit}
          className={`w-full ${isLoading ? 'bg-gray-600' : 'bg-slate-800'}`}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text className="text-lg font-bold text-white">Entrar</Text>
          )}
        </Button>
        <View>
          <Text style={styles.authModeText}>
            Ainda não possui uma conta?{' '}
            <Text style={styles.boldText} onPress={() => navigation.navigate('Signup')}>
              Cadastre-se aqui.
            </Text>
          </Text>
        </View>
      </View>
      <Toast />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginVertical: 150,
  },
  spacer: {
    marginVertical: 20,
  },
  boldText: {
    fontWeight: '900',
  },
  authModeText: {
    marginVertical: 10,
    textAlign: 'center',
  },
});
