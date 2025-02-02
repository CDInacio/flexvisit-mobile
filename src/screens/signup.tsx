import React, { useState } from 'react';
import Input from '~/components/Input';
import { Alert, SafeAreaView, Text, View, StyleSheet } from 'react-native';
import { Button } from '~/components/Button';
import { useNavigation } from '@react-navigation/native';

export default function SignupScreen() {
  const navigation = useNavigation<any>();
  const [form, setForm] = useState({ email: '', password: '' });

  // Função para atualizar os campos do formulário
  const handleInputChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  // Função de validação
  const validateForm = () => {
    const { email, password } = form;

    if (!email) {
      Alert.alert('Erro', 'O campo Email é obrigatório.');
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Erro', 'Por favor, insira um Email válido.');
      return false;
    }

    if (!password) {
      Alert.alert('Erro', 'O campo Senha é obrigatório.');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.');
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Formulário enviado com sucesso:', form);
      Alert.alert('Sucesso', 'Login realizado com sucesso!');
    }
  };

  return (
    <SafeAreaView style={styles.rootContainer}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Cadastro</Text>
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
        <Button onPress={handleSubmit} className="w-full bg-gray-800">
          <Text className="text-lg font-bold text-white">Cadastrar</Text>
        </Button>
        <View>
          <Text style={styles.authModeText}>
            Ja possui uma conta?{' '}
            <Text style={styles.boldText} onPress={() => navigation.navigate('Login')}>
              Entre aqui.
            </Text>
          </Text>
        </View>
      </View>
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
