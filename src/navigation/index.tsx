import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './tab-navigator';
import LoginScreen from '~/screens/login';
import SignupScreen from '~/screens/signup';
import Booking from '~/screens/booking';
import useAuthStore from '~/store/store';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, useColorScheme, View } from 'react-native';
import QRCodeResult from '~/screens/qrcodeResult';
import axios from 'axios';

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

export const LightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#FFFFFF', // slate-50 (background claro)
    text: '#0f172a', // slate-900 (texto escuro)
    card: '#ffffff', // branco para cartões
    border: '#e2e8f0', // slate-200 (borda clara)
    primary: '#2563eb', // blue-600 (cor principal)
    notification: '#f43f5e', // rose-500
  },
};

export const DarkThemeCustom = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#1f2937', // slate-800 (fundo escuro)
    text: '#f1f5f9', // slate-100 (texto claro)
    card: '#111827', // slate-900 (cartões escuros)
    border: '#334155', // slate-700 (borda escura)
    primary: '#3b82f6', // blue-500 (cor principal)
    notification: '#f43f5e', // rose-500
  },
};

export default function RootStack() {
  const colorScheme = useColorScheme();
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
    <View className="flex-1 bg-red-400">
      <NavigationContainer theme={colorScheme === 'dark' ? DarkThemeCustom : LightTheme}>
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
    </View>
  );
}
