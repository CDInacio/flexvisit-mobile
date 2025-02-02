import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './tab-navigator';
import LoginScreen from '~/screens/login';
import SignupScreen from '~/screens/signup';
import Booking from '~/screens/booking';
import useAuthStore from '~/store/store';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';
import QRCodeResult from '~/screens/qrcodeResult';
import axios from 'axios';
import Config from '~/utils/api';
import type { User } from '~/types/user';

export type RootStackParamList = {
  TabNavigator: undefined;
  Agendamento: { id: string };
  Login: undefined;
  Signup: undefined;
  QRCode: undefined;
  QRCodeResult: { data: string };
};

const Stack = createStackNavigator<RootStackParamList>();

function defineInterceptor() {
  axios.interceptors.request.use(
    async (config) => {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
}

export default function RootStack() {
  const { setUserData, user } = useAuthStore();
  const token = AsyncStorage.getItem('userToken');
  const [isLoading, setIsLoading] = useState(true); // Estado de carregamento
  const [initialRoute, setInitialRoute] = useState<'Login' | 'TabNavigator'>('Login');

  useEffect(() => {
    const getUser = async () => {
      try {
        const userStorage = await AsyncStorage.getItem('user');
        console.log(userStorage);
        if (userStorage) {
          setUserData(JSON.parse(userStorage));
          setInitialRoute('TabNavigator'); // Redireciona para a TabNavigator se o usuário existir
        } else {
          setInitialRoute('Login'); // Redireciona para a tela de Login
        }
      } catch (e) {
        console.error('Erro ao carregar usuário:', e);
      } finally {
        setIsLoading(false); // Finaliza o carregamento
      }
    };
    getUser();
  }, [setUserData]);

  defineInterceptor();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen
          name="TabNavigator"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
        <Stack.Screen
          name="Agendamento"
          component={Booking}
          options={{
            presentation: 'modal',
            headerBackTitle: 'Custom Back',
            headerBackTitleStyle: { fontSize: 30 },
          }}
        />
        <Stack.Screen name="QRCodeResult" component={QRCodeResult} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
