import React, { useState } from 'react';
import { View, Text, Button, Platform } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

interface TimePickerProps {
  label?: string;
  value: string;
  onChange: (time: string) => void;
}

export default function TimePicker({ label = 'Horário', value, onChange }: TimePickerProps) {
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowPicker(false);

    if (selectedDate) {
      const hours = selectedDate.getHours().toString().padStart(2, '0');
      const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
      const formattedTime = `${hours}:${minutes}`;
      onChange(formattedTime);
    }
  };

  const showTimePicker = () => setShowPicker(true);

  return (
    <View style={{ marginTop: 20 }}>
      <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>{label}</Text>
      <Button title={value || 'Selecionar horário'} onPress={showTimePicker} />

      {showPicker && (
        <DateTimePicker
          mode="time"
          value={new Date()}
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
        />
      )}
    </View>
  );
}
