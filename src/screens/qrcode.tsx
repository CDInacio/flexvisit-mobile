import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '~/navigation';

export default function QRCode() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const qrCodeLock = useRef(false);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'QRCode'>>();

  if (!permission) {
    return <View className="flex-1" />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text className="mb-4 text-center text-lg text-gray-700">
          Precisamos da sua permissão para acessar a câmera.
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          className="rounded border border-gray-800 px-4 py-2">
          <Text className="text-lg text-gray-800">Conceder Permissão</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }

  function handleBarcodeScanned(data: string) {
    if (!qrCodeLock.current) {
      qrCodeLock.current = true;
      navigation.navigate('QRCodeResult', { data });
      setTimeout(() => {
        qrCodeLock.current = false;
      }, 3000);
    }
  }

  return (
    <View className="flex-1">
      <CameraView
        style={{ flex: 1 }}
        facing={facing}
        onBarcodeScanned={({ data }) => handleBarcodeScanned(data)}>
        <View className="absolute bottom-10 left-0 right-0 flex-row justify-center">
          <TouchableOpacity
            onPress={toggleCameraFacing}
            className="rounded-lg bg-gray-900 px-6 py-3">
            <Text className="text-lg font-semibold text-white">Alternar Câmera</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}
