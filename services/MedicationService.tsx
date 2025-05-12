import AsyncStorage from '@react-native-async-storage/async-storage';
import { Medication } from '@/components/models/Medication';

const MEDICATION_STORAGE_KEY = 'medications';

export const MedicationService = {
  async getAll(): Promise<Medication[]> {
    try {
      const data = await AsyncStorage.getItem(MEDICATION_STORAGE_KEY);
      if (data) {
        // console.log('Dados recuperados do AsyncStorage (string):', data);
        const parsedData = JSON.parse(data);
        // console.log('Dados recuperados do AsyncStorage (objeto):', parsedData);
        return parsedData;
      }
      return [];
    } catch (error) {
      console.error('Erro ao buscar medicamentos:', error);
      return [];
    }
  },

  async save(medication: Medication): Promise<void> {
    try {
      const medications = await this.getAll();
      medications.push(medication);
      await AsyncStorage.setItem(MEDICATION_STORAGE_KEY, JSON.stringify(medications));
      console.log('Medicamento salvo com sucesso:', medication);
    } catch (error) {
      console.error('Erro ao salvar medicamento:', error);
    }
  },

  async update(index: number, updatedMedication: Medication): Promise<void> {
    try {
      const medications = await this.getAll();
      if (index >= 0 && index < medications.length) {
        medications[index] = updatedMedication;
        await AsyncStorage.setItem(MEDICATION_STORAGE_KEY, JSON.stringify(medications));
      } else {
        console.error('Índice inválido para atualização.');
      }
    } catch (error) {
      console.error('Erro ao atualizar medicamento:', error);
    }
  },

  async delete(index: number): Promise<void> {
    try {
      const medications = await this.getAll();
      if (index >= 0 && index < medications.length) {
        medications.splice(index, 1);
        await AsyncStorage.setItem(MEDICATION_STORAGE_KEY, JSON.stringify(medications));
      } else {
        console.error('Índice inválido para exclusão.');
      }
    } catch (error) {
      console.error('Erro ao excluir medicamento:', error);
    }
  },

  async deleteAll(): Promise<void> {
    try {
      await AsyncStorage.removeItem(MEDICATION_STORAGE_KEY);
      console.log('Todos os medicamentos foram excluídos com sucesso.');
    } catch (error) {
      console.error('Erro ao excluir todos os medicamentos:', error);
    }
  },
};