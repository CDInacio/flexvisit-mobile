import { FontAwesome } from '@expo/vector-icons';
import { Text, View } from 'react-native';

export function DashboardItem({
  text,
  value,
  icon,
  color,
}: {
  text: string;
  value: number;
  icon: string;
  color: string;
}) {
  return (
    <View className=" flex flex-row justify-between rounded border-[1px] border-gray-400 p-6">
      <View>
        <Text className="text-3xl font-semibold">{value}</Text>
        <Text className="mt-2">{text}</Text>
      </View>
      <FontAwesome name={icon as keyof typeof FontAwesome.glyphMap} size={40} color={color} />
    </View>
  );
}
