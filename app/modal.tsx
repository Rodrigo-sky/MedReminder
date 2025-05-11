import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Alert, Switch, Platform, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { TextInput, Text, View } from '@/components/Themed';
import { defaultMedication, Medication } from '@/components/models/Medication';
import React, { useState } from 'react';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

export default function ModalScreen() {

  const [medication, setMedication] = useState<Medication>(defaultMedication);
  const handleChange = <K extends keyof Medication>(key: K, value: Medication[K]) => {
    setMedication((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  const [showPicker, setShowPicker] = useState(false);
  const handleSubmit = () => {
    Alert.alert('Dados do Medicamento', JSON.stringify(medication, null, 2));
    console.log('Dados do Medicamento', medication);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={styles.title}>Modal</Text>
          {/* Use a light status bar on iOS to account for the black space above the modal */}
          <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />

          <View style={styles.formContainer}>
            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Paracetamol"
              value={medication.name}
              onChangeText={(value) => handleChange('name', value)}
            />
          </View>

          <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

          <View style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <TouchableOpacity style={styles.formContainer} onPress={() => setShowPicker(true)}>
              <Text style={styles.label}>Horário</Text>
              <Text style={{ paddingHorizontal: 10 }}>{medication.time || "00:00"}</Text>
            </TouchableOpacity>
          </View>

          {showPicker && (
            <DateTimePicker
              mode="time"
              value={new Date(`1970-01-01T${medication.time || "00:00"}:00`)}
              is24Hour={true}
              display="spinner"
              onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
                if (selectedDate) {
                  const hours = selectedDate.getHours();
                  const minutes = selectedDate.getMinutes();
                  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                  handleChange('time', formattedTime);
                }
                setShowPicker(false); // Fecha o picker após a seleção
              }}
            />
          )}


          <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

          <View style={styles.formContainer}>
            <Text style={styles.label}>Vezes por dia</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 3"
              keyboardType="numeric"
              value={medication.medicationFrequency.toString()}
              onChangeText={(value) => handleChange('medicationFrequency', Number(value))}
            />
          </View>

          <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

          <View style={styles.formContainer}>
            <Text style={styles.label}>Uso contínuo?</Text>
            <Switch
              style={styles.switch}
              value={medication.isContinuos}
              onValueChange={(value) => handleChange('isContinuos', value)}
            />
          </View>

          <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

          <View style={styles.formContainer}>
            <Text style={styles.label}>Dias de uso</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 7"
              keyboardType="numeric"
              value={medication.daysOfUsage}
              onChangeText={(value) => handleChange('daysOfUsage', value)}
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button color={"blue"} title="Salvar" onPress={handleSubmit} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    borderWidth: 0,
    minHeight: 50,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 1,
    height: 2,
    width: '90%',
  },
  label: {
    textAlign: 'left',
    fontSize: 16,
    fontWeight: 'bold',
    width: '35%',
    paddingLeft: 10,
  },
  input: {
    textAlign: 'right',
    width: '65%',
    minHeight: 40,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignContent: 'center',
  },
  buttonContainer: {
    marginTop: 20,
  },
  switch: {
    // height: 40,
  },
});
