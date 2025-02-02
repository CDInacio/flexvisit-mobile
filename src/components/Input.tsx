import { StyleSheet, TextInput, type TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
}

export default function Input({ placeholder, value, onChangeText, ...props }: InputProps) {
  return (
    <TextInput
      {...props}
      style={styles.input}
      value={value}
      placeholder={placeholder}
      onChangeText={onChangeText}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    width: '100%', // Largura dos inputs para preencher o container
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20, // Espaçamento entre os inputs
  },
});
