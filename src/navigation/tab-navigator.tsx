import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '~/screens/home';
import Bookings from '~/screens/bookings';
import { TabBarIcon } from '../components/TabBarIcon';
import useAuthStore from '~/store/store';
import QRCode from '~/screens/qrcode';
import NewBooking from '~/screens/newBookings';
import Profile from '~/screens/profile';

export type TabParamList = {
  Home: undefined;
  Agendamentos: undefined;
  QRCode: undefined;
  'Novo agendamento': undefined;
  Perfil: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const getTabTitle = (tabName: string, role?: string): string => {
  if (!role) return tabName;

  switch (tabName) {
    case 'Agendamentos':
      return 'Gerenciar Agendamentos';
    case 'Novo':
      return 'Novo Agendamento';
    case 'QRCode':
      return 'Escanear QR Code';
    default:
      return tabName;
  }
};

export default function TabNavigator() {
  const { user } = useAuthStore();

  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Início',
          headerShown: false,
          tabBarActiveTintColor: '#1f2937',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      {user?.role === 'ATTENDANT' ||
        (user?.role === 'ADMIN' && (
          <Tab.Screen
            name="QRCode"
            component={QRCode}
            options={{
              tabBarActiveTintColor: '#1f2937',
              title: getTabTitle('QRCode'),
              headerShown: false,
              tabBarIcon: ({ color }) => <TabBarIcon name="qrcode" color={color} />,
            }}
          />
        ))}
      {user?.role === 'USER' && (
        <Tab.Screen
          name="Novo agendamento"
          component={NewBooking}
          options={{
            tabBarActiveTintColor: '#1f2937',
            title: getTabTitle('Novo', user?.role),
            tabBarIcon: ({ color }) => <TabBarIcon name="plus" color={color} />,
          }}
        />
      )}
      {user?.role !== 'USER' && (
        <Tab.Screen
          name="Agendamentos"
          component={Bookings}
          options={{
            headerShown: false,
            tabBarActiveTintColor: '#1f2937',
            tabBarIcon: ({ color }) => <TabBarIcon name="folder" color={color} />,
          }}
        />
      )}
      <Tab.Screen
        name="Perfil"
        component={Profile}
        options={{
          title: getTabTitle('Perfil'),
          headerShown: false,
          tabBarActiveTintColor: '#1f2937',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
