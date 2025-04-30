import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  Modal,
  TextInput,
  StyleSheet,
  ScrollView,
  Switch,
} from 'react-native';
import Slider from '@react-native-community/slider';
import DateTimePicker from '@react-native-community/datetimepicker';
import Logo from '../Logo';

interface HomeScreenProps {
  isDarkMode: boolean;
}

type ItemMed = {
  name: string;
  times_per_day: number;
  horarios: string[];
};

export default function HomeScreen({ isDarkMode }: HomeScreenProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [itemName, setItemName] = useState('');
  const [firstHorario, setFirstHorario] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [items, setItems] = useState<ItemMed[]>([]);
  const [intervalHours, setIntervalHours] = useState(8);
  const [isDoseUnica, setIsDoseUnica] = useState(false);

  const timesPerDay = Math.floor(24 / intervalHours);
  const color = isDarkMode ? '#fff' : '#000';

  function formatTime(date: Date): string {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function generateHorarios(start: Date, interval: number, count: number): string[] {
    const result: string[] = [];
    let current = new Date(start);
    for (let i = 0; i < count; i++) {
      result.push(formatTime(current));
      current = new Date(current.getTime() + interval * 60 * 60 * 1000);
    }
    return result;
  }

  function handleAddItem() {
    const horarios = isDoseUnica
      ? [formatTime(firstHorario)]
      : generateHorarios(firstHorario, intervalHours, timesPerDay);

    const newItem: ItemMed = {
      name: itemName,
      times_per_day: isDoseUnica ? 1 : timesPerDay,
      horarios,
    };
    setItems([...items, newItem]);
    setItemName('');
    setIntervalHours(8);
    setIsDoseUnica(false);
    setModalVisible(false);
  }

  return (
    <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <ScrollView>
        <Logo fillColor={color} style={{ width: 200, marginBottom: 10 }} />
        <Text style={{ color: color, fontSize: 18, textAlign: 'center', paddingLeft: 30 }}>
          Toque na tela e adicione um medicamento
        </Text>

        <FlatList
          data={items}
          keyExtractor={(item, index) => index.toString()}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Text style={{ color: color }}>{item.name} - {item.times_per_day}x ao dia</Text>
              <Text style={{ color: color, fontSize: 12 }}>{item.horarios.join(', ')}</Text>
            </View>
          )}
          style={{ marginTop: 20, width: '80%' }}
        />

        <Button color="black" title="Adicionar Item" onPress={() => setModalVisible(true)} />

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.title}>Adicionar Novo Medicamento</Text>
              <TextInput
                placeholder="Nome do medicamento"
                value={itemName}
                onChangeText={setItemName}
                style={styles.input}
              />

              <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
                <Text style={{ marginRight: 10 }}>Dose única?</Text>
                <Switch value={isDoseUnica} onValueChange={setIsDoseUnica} />
              </View>

              {!isDoseUnica && (
                <>
                  <Text style={{ marginTop: 10, fontWeight: 'bold' }}>
                    Intervalo entre doses: {intervalHours} horas
                  </Text>
                  <Slider
                    style={{ width: 200 }}
                    minimumValue={2}
                    maximumValue={12}
                    step={1}
                    value={intervalHours}
                    onValueChange={setIntervalHours}
                    minimumTrackTintColor="#1EB1FC"
                    maximumTrackTintColor="#d3d3d3"
                  />
                  <Text style={{ marginBottom: 10 }}>Equivale a {timesPerDay}x ao dia</Text>
                </>
              )}

              <Button title="Selecionar horário inicial" onPress={() => setShowPicker(true)} />
              <Text style={{ marginVertical: 10 }}>Horário inicial: {formatTime(firstHorario)}</Text>

              {showPicker && (
                <DateTimePicker
                  value={firstHorario}
                  is24Hour={true}
                  mode="time"
                  display="spinner"
                  onChange={(_, selectedDate) => {
                    setShowPicker(false);
                    if (selectedDate) setFirstHorario(selectedDate);
                  }}
                />
              )}

              <Button title="Salvar" onPress={handleAddItem} />
              <Button title="Cancelar" onPress={() => setModalVisible(false)} color="red" />
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  listItem: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    width: '100%',
    padding: 8,
    marginVertical: 5,
    borderRadius: 4,
  },
});
