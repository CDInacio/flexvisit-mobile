import { useEffect, useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  ActivityIndicator,
  Text,
  View,
  ScrollView,
  TextInput,
  Pressable,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useCreateBooking } from '~/hooks/useCreateBooking';
import { useGetForms } from '~/hooks/useGetForms';
import { useGetSchedule } from '~/hooks/useGetSchedules';
import { showToast } from '~/utils/toast';
import RNPickerSelect from 'react-native-picker-select';
import { formatDate } from '~/utils/formatDate';
import Toast from 'react-native-toast-message';
import type { Dates, Timeslot } from '~/types/date';

interface Form {
  [key: string]: unknown;
}

interface FormField {
  id: string;
  field_name: string;
  field_type: string;
  field_required: boolean;
  formId: string;
  options?: string[];
}

export default function NewBooking() {
  const [formData, setFormData] = useState<Form>({});
  const { mutate: createBooking, isPending } = useCreateBooking();
  const { data: form } = useGetForms();
  const { data: dates } = useGetSchedule();
  const [availableSlots, setAvailableSlots] = useState<Timeslot[]>([]);
  const userForm = form?.find((f: any) => f.isActive === true);

  const [date, setDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  const capitalizeFirstLetter = (text: string) => {
    return text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : '';
  };

  const handleConfirm = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setDate(selectedDate);
      setFormData({ ...formData, data: formatDate(selectedDate.toISOString()) });
    }
    setShowPicker(false);
  };

  const openPicker = () => setShowPicker(true);

  const handleMultipleChoiceChange = (fieldName: string, option: string) => {
    setFormData((prevData) => {
      const selectedOptions = Array.isArray(prevData[fieldName]) ? prevData[fieldName] : [];
      const newOptions = selectedOptions.includes(option)
        ? selectedOptions.filter((item: string) => item !== option)
        : [...selectedOptions, option];

      return { ...prevData, [fieldName]: newOptions };
    });
  };

  const handleBooking = () => {
    let hasMissingFields = false;
    let missingFields: string[] = [];

    userForm?.form_fields.forEach((field: FormField) => {
      let fieldValue = formData[field.field_name];

      if (field.field_name === 'Data') {
        fieldValue = formData[field.field_name.toLowerCase()];
      }

      if (field.field_required && Array.isArray(fieldValue) && fieldValue.length === 0) {
        hasMissingFields = true;
        missingFields.push(field.field_name);
      } else if (field.field_required && (fieldValue === undefined || fieldValue === '')) {
        hasMissingFields = true;
        missingFields.push(field.field_name);
      }
    });

    if (hasMissingFields) {
      showToast(
        'error',
        'Erro!',
        `Preencha todos os campos obrigatórios: ${missingFields.join(', ')}`
      );
      return;
    }

    if (availableSlots.length === 0) {
      showToast('error', 'Erro!', 'Selecione um horário disponível');
      return;
    }

    if (Object.keys(formData).length === 0) {
      showToast('error', 'Erro!', 'Preencha todos os campos');
      return;
    }

    const data = { formId: userForm.id, ...formData };
    createBooking(data, {
      onSuccess: () => {
        showToast('success', 'Sucesso!', 'Agendamento criado com sucesso');
        setFormData({});
        setAvailableSlots([]);
      },
      onError: (error: Error) => {
        console.error(error.message);
      },
    });
  };

  useEffect(() => {
    if (formData.data && dates) {
      const matchingTimeslots = dates
        .filter((schedule: Dates) => schedule.date === formData.data)
        .flatMap((schedule: Dates) => schedule.timeslots);
      setAvailableSlots(matchingTimeslots);
    }
  }, [formData.data, dates]);

  return (
    <ScrollView className="mb-5 flex-1 px-5">
      <Text className="mb-5 mt-5 text-3xl font-bold">{userForm?.form_name}</Text>
      <Text className="text-justify text-gray-600">{userForm?.form_description}</Text>

      <View className="mt-5">
        {userForm?.form_fields.map((item: FormField, i: number) => {
          const renderRequiredAsterisk = item.field_required ? (
            <Text className="text-red-400">*</Text>
          ) : null;

          return (
            <View key={i} className="mb-5">
              {/* Text and Number Fields */}
              {(item.field_type === 'text' || item.field_type === 'number') && (
                <>
                  <Text className="mb-2 font-bold">
                    {capitalizeFirstLetter(item.field_name)} {renderRequiredAsterisk}
                  </Text>
                  <TextInput
                    onChangeText={(text) => setFormData({ ...formData, [item.field_name]: text })}
                    className="rounded border-[1px] border-gray-600 px-3"
                    keyboardType={item.field_type === 'number' ? 'numeric' : 'default'}
                  />
                </>
              )}

              {/* Date Field */}
              {item.field_type === 'data' && (
                <View className="mt-4">
                  <TouchableOpacity
                    onPress={openPicker}
                    className="flex flex-row items-center rounded-lg border-[1px] border-gray-600 bg-white px-4 py-3 shadow-sm">
                    <FontAwesome name="calendar" size={24} color="black" />
                    <Text className="mr-2 text-gray-800">Selecione uma data</Text>
                  </TouchableOpacity>

                  {date && (
                    <Text className="mt-4 text-lg text-gray-800">
                      Data Selecionada: {format(date, 'dd/MM/yyyy', { locale: ptBR })}
                    </Text>
                  )}

                  {showPicker && (
                    <DateTimePicker
                      value={date || new Date()}
                      mode="date"
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      onChange={handleConfirm}
                      locale="pt-BR"
                    />
                  )}

                  {availableSlots.length > 0 ? (
                    <View>
                      <Text className="mb-4 text-lg font-bold">Horários Disponíveis</Text>
                      <View className="flex flex-row flex-wrap justify-center gap-2">
                        {availableSlots.map((slot: Timeslot, i) => (
                          <Pressable
                            key={i}
                            disabled={!slot.available}
                            onPress={() =>
                              setFormData({
                                ...formData,
                                starttime: slot.starttime,
                                endtime: slot.endtime,
                              })
                            }>
                            <View
                              className={`${
                                slot.starttime === formData.starttime &&
                                slot.endtime === formData.endtime &&
                                'bg-gray-800 text-white'
                              } flex items-center justify-center rounded-lg border-[1px] ${
                                slot.available ? 'border-gray-800' : 'border-gray-300'
                              } bg-gray-100 px-4 py-2 shadow-sm`}
                              style={{ minWidth: 100, margin: 4 }}>
                              <Text
                                className={`${
                                  slot.available ? 'text-gray-800' : 'text-gray-300'
                                } ${slot.starttime === formData.starttime && slot.endtime === formData.endtime && 'font-bold text-white'}`}
                                style={{ textAlign: 'center' }}>
                                {`${slot.starttime} - ${slot.endtime}`}
                              </Text>
                            </View>
                          </Pressable>
                        ))}
                      </View>
                    </View>
                  ) : formData.data && availableSlots.length === 0 ? (
                    <Text className="">Nenhum horário disponível</Text>
                  ) : null}
                </View>
              )}

              {/* Multiple Choice Field with Checkboxes */}
              {item.field_type === 'multiple_choice' && (
                <View>
                  <Text className="mb-2 font-bold">
                    {capitalizeFirstLetter(item.field_name)} {renderRequiredAsterisk}
                  </Text>
                  {item.options?.map((option, i) => (
                    <View key={i} className="flex flex-row items-center">
                      <Pressable
                        onPress={() => handleMultipleChoiceChange(item.field_name, option)}
                        style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 4 }}>
                        <View
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: 4,
                            borderWidth: 2,
                            borderColor:
                              Array.isArray(formData[item.field_name]) &&
                              (formData[item.field_name] as string[]).includes(option)
                                ? '#93c5fd'
                                : 'gray',
                            marginRight: 8,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          {Array.isArray(formData[item.field_name]) &&
                            (formData[item.field_name] as string[]).includes(option) && (
                              <View
                                style={{
                                  width: 12,
                                  height: 12,
                                  borderRadius: 6,
                                  backgroundColor: '#93c5fd',
                                }}
                              />
                            )}
                        </View>
                        <Text>{option}</Text>
                      </Pressable>
                    </View>
                  ))}
                </View>
              )}

              {/* Dropdown Field using RNPickerSelect */}
              {item.field_type === 'dropdown' && (
                <View>
                  <Text className="mb-2 font-bold">
                    {capitalizeFirstLetter(item.field_name)} {renderRequiredAsterisk}
                  </Text>
                  <RNPickerSelect
                    onValueChange={(value) =>
                      setFormData({ ...formData, [item.field_name]: value })
                    }
                    items={(item.options ?? []).map((option) => ({
                      label: option,
                      value: option,
                    }))}
                    value={formData[item.field_name]}
                    style={{
                      inputIOS: {
                        height: 40,
                        paddingHorizontal: 10,
                        borderWidth: 1,
                        borderColor: '#ccc',
                        borderRadius: 4,
                        marginVertical: 8,
                      },
                      inputAndroid: {
                        borderColor: '#ccc',
                      },
                    }}
                    placeholder={{ label: 'Selecione uma opção...', value: null }}
                  />
                </View>
              )}
            </View>
          );
        })}

        <Pressable onPress={handleBooking} style={({ pressed }) => [{ backgroundColor: '' }]}>
          {isPending ? (
            <ActivityIndicator size="small" />
          ) : (
            <Text className="rounded bg-gray-800 px-5 py-3 text-center text-xl font-bold text-white">
              Agendar
            </Text>
          )}
        </Pressable>
      </View>
      <Toast />
    </ScrollView>
  );
}
