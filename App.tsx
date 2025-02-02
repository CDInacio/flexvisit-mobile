import './global.css';

import 'react-native-gesture-handler';
import { createNotifications } from 'react-native-notificated';
const { NotificationsProvider, useNotifications, ...events } = createNotifications();

import RootStack from './src/navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RootStack />
    </QueryClientProvider>
  );
}
