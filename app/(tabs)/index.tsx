import { StyleSheet } from 'react-native';
import MedReminder from '../../assets/images/MedReminder';
import { Text, View } from '@/components/Themed';

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <MedReminder style={styles.img} lightColor="#000" darkColor="#fff"/>
      <Text style={styles.welcome}>Adicione um medicamento</Text>
    </View>
  );
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
