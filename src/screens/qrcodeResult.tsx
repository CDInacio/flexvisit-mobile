import { Text, TouchableOpacity, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '~/navigation';

export default function QRCodeResult() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { data } = route.params as { data: string }; // Dados lidos do QR Code

  return (
    <View className="flex-1 items-center justify-center px-6">
      <Text className="mb-4 text-lg font-bold text-green-600">QR Code Lido com Sucesso!</Text>
      <Text className="mb-6 text-center text-base text-gray-800">{data}</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('QRCode')}
        className="rounded-lg bg-blue-600 px-6 py-3">
        <Text className="text-lg font-semibold text-white">Escanear Novamente</Text>
      </TouchableOpacity>
    </View>
  );
}
