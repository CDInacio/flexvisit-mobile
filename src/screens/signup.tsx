import React, { useState } from 'react';
import Input from '~/components/Input';
import { Alert, SafeAreaView, Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { Button } from '~/components/Button';
import { useNavigation } from '@react-navigation/native';
import { useSignup } from '~/hooks/useSignup';
import { showToast } from '~/utils/toast';
import Toast from 'react-native-toast-message';
import { validateFields } from '~/utils/validateAuthFields';

export default function SignupScreen() {
  const { mutate: singup, isPending: isLoadingSignup } = useSignup();
  const navigation = useNavigation<any>();
  const [formData, setFormData] = useState({
    fullname: '',
    document: '',
    email: '',
    phoneNumber: '',
    password: '',
  });

  const handleInputChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const { fullname, document, email, phoneNumber, password } = formData;

    const requiredFields = [
      { key: 'fullname', label: 'Nome completo' },
      { key: 'document', label: 'Documento' },
      { key: 'email', label: 'Email' },
      { key: 'phoneNumber', label: 'Telefone' },
      { key: 'password', label: 'Senha' },
    ];

    if (!validateFields(formData, requiredFields)) {
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      showToast('error', 'Erro!', 'Por favor, insira um email válido.');
      return false;
    }

    if (!phoneNumber) {
      showToast('error', 'Erro!', 'Por favor, insira um número de telefone válido.');
      return false;
    }

    if (!password) {
      showToast('error', 'Erro!', 'Por favor, insira uma senha válida.');
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
      console.log(formData);
      singup(formData);
    }
  };

  return (
    <SafeAreaView style={styles.rootContainer}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Cadastro</Text>
        <View style={styles.spacer} />
        <Input
          placeholder="Nome completo"
          value={formData.fullname}
          onChangeText={(value) => handleInputChange('fullname', value)}
        />
        <Input
          placeholder="Documento (CPF/RG)"
          value={formData.document}
          onChangeText={(value) => handleInputChange('document', value)}
        />
        <Input
          placeholder="Email"
          value={formData.email}
          onChangeText={(value) => handleInputChange('email', value)}
        />
        <Input
          placeholder="Telefone"
          value={formData.phoneNumber}
          onChangeText={(value) => handleInputChange('phoneNumber', value)}
        />
        <Input
          placeholder="Senha"
          secureTextEntry
          value={formData.password}
          onChangeText={(value) => handleInputChange('password', value)}
        />
        <Button onPress={handleSubmit} className="w-full bg-gray-800">
          {isLoadingSignup ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text className="text-lg font-bold text-white">Cadastrar</Text>
          )}
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
