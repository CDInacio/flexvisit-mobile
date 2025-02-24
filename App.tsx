import './global.css';

import 'react-native-gesture-handler';
// import { createNotifications } from 'react-native-notificated';
// const { NotificationsProvider, useNotifications, ...events } = createNotifications();

import RootStack from './src/navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as Font from 'expo-font';
import { Text, View } from 'react-native';

const queryClient = new QueryClient();

export default function App() {
  const [fontsLoaded] = Font.useFonts({
    'Montserrat-Regular': require('./assets/fonts/Montserrat-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <QueryClientProvider client={queryClient}>
      <RootStack />
    </QueryClientProvider>
  );
}
