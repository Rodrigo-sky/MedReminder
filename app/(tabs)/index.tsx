import React from 'react';
import { StyleSheet } from 'react-native';
import MedReminder from '../../assets/images/MedReminder';
import { Text, View } from '@/components/Themed';
import { MedicationService } from '@/services/MedicationService';
import { Medication } from '@/components/models/Medication';
import { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import MedicationCard from '@/components/MedicationCard';

export default function TabOneScreen() {
  const [medications, setMedications] = useState<Medication[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchMedications = async () => {
        const data = await MedicationService.getAll();
        console.log('Medications:', data);
        setMedications(data);
      };

      fetchMedications();
    }, [])
  );

  if (medications.length == 0) {
    return (
    <View style={styles.container}>
      <MedReminder style={styles.img} lightColor="#000" darkColor="#fff"/>
      <Text style={styles.welcome}>Adicione um medicamento</Text>
    </View>
  );
  } else {
    return (
      <View style={{padding: 20, width: '100%'}}>
        {medications.map((medication, index) => (
          <MedicationCard key={index} {...medication} />
        ))}
      </View>
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
  img:{
    width: 200,
    height: 200,
    marginBottom: 20,
  }
});
