import React from 'react';
import { Pressable, StyleSheet, RefreshControl } from 'react-native';
import MedReminder from '../../assets/images/MedReminder';
import { Text, View, ScrollView } from '@/components/Themed';
import { MedicationService } from '@/services/MedicationService';
import { Medication } from '@/components/models/Medication';
import { useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import MedicationCard from '@/components/MedicationCard';

export default function TabOneScreen() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<any>();

  const fetchMedications = async () => {
    setRefreshing(true);
    const data = await MedicationService.getAll();
    setMedications(data);
    setRefreshing(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchMedications();
    }, [])
  );

  if (medications.length == 0) {
    return (
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchMedications} />
        }
      ><View>
          <MedReminder style={styles.img} lightColor="#000" darkColor="#fff" />
          <Text style={styles.welcome}>Adicione um medicamento</Text>
        </View>
      </ScrollView>
    );
  } else {
    return (
      <ScrollView
        contentContainerStyle={{ padding: 20, width: '100%' }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchMedications} />
        }
      >
        <View>
          {medications.map((medication, index) => (
            <Pressable key={index} onPress={() => navigation.navigate('modal', { medication, index })}>
              <MedicationCard {...medication} />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcome: {
    fontSize: 16,
    fontWeight: 'semibold',
  },
  img: {
    width: 200,
    height: 200,
    marginBottom: 20,
  }
});
