export interface Medication {
  name: string;
  time: string;
  timesPerDay: string;
  daysOfUsage: string;
  isContinuos: boolean;
}

export const defaultMedication: Medication = {
  name: '',
  time: '',
  timesPerDay: '',
  daysOfUsage: '',
  isContinuos: false,
};