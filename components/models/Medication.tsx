export interface Medication {
  name: string;
  time: string;
  medicationFrequency: number;
  daysOfUsage: string;
  isContinuos: boolean;
}

export const defaultMedication: Medication = {
  name: '',
  time: '',
  medicationFrequency: 0,
  daysOfUsage: '',
  isContinuos: false,
};