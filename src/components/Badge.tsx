import React from 'react';
import { Text, View } from 'react-native';

type BadgeProps = {
  status: string;
};

export default function Badge({ status }: BadgeProps) {
  const badgeColor =
    status === 'pendente'
      ? 'bg-yellow-300 text-yellow-800'
      : status === 'aprovado'
        ? 'bg-green-300 text-green-800'
        : status === 'cancelado'
          ? 'bg-red-300 text-red-900'
          : status === 'concluido'
            ? 'bg-sky-300 text-sky-800'
            : 'bg-gray-400';

  return (
    <View className={`flex w-24 rounded-full px-2 py-1 ${badgeColor} items-center justify-center`}>
      <Text className="text-xs font-semibold capitalize ">{status}</Text>
    </View>
  );
}
