import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Alert, Switch, Platform, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { ThemedDropDownPicker, TextInput, Text, View } from '@/components/Themed';
import { defaultMedication, Medication } from '@/components/models/Medication';
import React, { useState } from 'react';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { MedicationService } from '@/services/MedicationService';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function ModalScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params as { medication?: Medication; index?: number };

  const [medication, setMedication] = useState<Medication>(params?.medication || defaultMedication);
  const handleChange = <K extends keyof Medication>(key: K, value: Medication[K]) => {
    setMedication((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  const [showPicker, setShowPicker] = useState(false);
  const [frequencyOpen, setFrequencyOpen] = useState(false);
  const [frequencyItems, setFrequencyItems] = useState([
    { label: 'Uso único', value: 0 },
    ...Array.from({ length: 12 }, (_, i) => ({
      label: `a cada ${i + 1} hora${i === 0 ? '' : 's'}`,
      value: i + 1,
    }))
  ]);

  const calculateTimes = (startTime: string, frequency: number): string[] => {
    if (frequency === 0) {
      // Uso único: retorna apenas o horário inicial
      return [startTime];
    }

    const times: string[] = [];
    const [startHour, startMinute] = startTime.split(':').map(Number);

    let currentHour = startHour;
    let currentMinute = startMinute;

    while (times.length < Math.floor(24 / frequency)) {
      const formattedTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      times.push(formattedTime);

      currentHour += frequency;
      if (currentHour >= 24) {
        currentHour -= 24;
      }
    }

    return times;
  };

  const handleSubmit = () => {
    if (!medication.name || !medication.time) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
      return;
    }

    const calculatedTimes = calculateTimes(medication.time, medication.medicationFrequency);
    setMedication((prev) => ({ ...prev, times: calculatedTimes }));

    if (typeof params?.index === 'number') {
      MedicationService.update(params.index, { ...medication, times: calculatedTimes });
    } else {
      MedicationService.save({ ...medication, times: calculatedTimes });
    }
    console.log('Dados do Medicamento', { ...medication, times: calculatedTimes });
    navigation.goBack(); // Volta para a tela anterior
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
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
            <Text style={styles.label}>Frequência</Text>
            <ThemedDropDownPicker
              open={frequencyOpen}
              value={medication.medicationFrequency}
              items={frequencyItems}
              setOpen={setFrequencyOpen}
              setValue={(callback) => handleChange('medicationFrequency', typeof callback === 'function' ? callback(medication.medicationFrequency) : callback)}
              setItems={setFrequencyItems}
              placeholder='Selecione a frequência'
              scrollViewProps={{persistentScrollbar: true}}
              style={[styles.dropdown, styles.input]}
              dropDownContainerStyle={[styles.dropdownContainer, styles.input]}
              textStyle={styles.dropdownText}
              labelStyle={styles.dropdownLabel}
              arrowIconStyle={{display: 'none'}}
              onChangeValue={(value) => handleChange('medicationFrequency', value)}
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

          {!medication.isContinuos && (
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
          )}

          <View style={styles.buttonContainer}>
            <Button color={"blue"} title="Salvar" onPress={handleSubmit} />
          </View>

          {typeof params?.index === 'number' && (
            <View style={styles.buttonContainer}>
              <Button
                color="red"
                title="Excluir"
                onPress={() => {
                  MedicationService.delete(params.index!);
                  navigation.goBack();
                }}
              />
            </View>
          )}
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
  dropdown: {
    width: '10%',
    alignContent: 'center',
    borderBottomColor: 'none', 
    borderWidth: 0,
    justifyContent: 'flex-end',
  },
  dropdownContainer: {
    width: '10%',
    borderBottomColor: 'none', 
    borderWidth: 0,
    justifyContent: 'flex-end',
  },
  dropdownText: {
    textAlign: 'right',
  },
  dropdownLabel: {
    textAlign: 'right',
  },
  switch: {
    // height: 40,
  },
});
