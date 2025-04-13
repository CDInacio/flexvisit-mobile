import { Text } from 'react-native';

interface StatusBadgeProps {
  userAccesLevel: string;
}

const translateAccesLevel = (text: string) => {
  switch (text) {
    case 'ADMIN':
      return 'Administrador';
    case 'VISITOR':
      return 'Visitante';
    case 'ATTENDANT':
      return 'Atendente';
    case 'COORDINATOR':
      return 'Coordenador';
    default:
      return 'Desconhecido';
  }
};

export function UserBadge({ userAccesLevel }: StatusBadgeProps) {
  switch (userAccesLevel) {
    case 'ADMIN':
      return (
        <Text className=" w-28 rounded-full bg-yellow-200 px-2 py-1 text-center text-xs font-semibold text-yellow-800">
          {translateAccesLevel(userAccesLevel)}
        </Text>
      );
    case 'VISITOR':
      return (
        <Text className=" w-20 rounded-full bg-green-200 px-2 py-1 text-center text-xs font-semibold text-green-800">
          {translateAccesLevel(userAccesLevel)}
        </Text>
      );
    case 'ATTENDANT':
      return (
        <Text className="w-28 rounded-full bg-blue-200 px-2 py-1 text-center text-xs font-semibold text-blue-800">
          {translateAccesLevel(userAccesLevel)}
        </Text>
      );
    case 'COORDINATOR':
      return (
        <Text className=" w-28 rounded-full bg-red-200 px-2 py-1 text-center text-xs font-semibold text-red-800">
          {translateAccesLevel(userAccesLevel)}
        </Text>
      );
    default:
      return (
        <Text className="w-28 rounded-full bg-gray-200 px-2 py-1 text-center text-xs font-semibold text-gray-800">
          {translateAccesLevel(userAccesLevel)}
        </Text>
      );
  }
}
