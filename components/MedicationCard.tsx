import { Text, View } from '@/components/Themed';
import { Medication } from './models/Medication';
import { StyleSheet } from 'react-native';

export default function MedicationCard(medication: Medication) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{medication.name}</Text>
            <Text style={styles.time}>{medication.time}</Text>
            <Text >{medication.times.length}x por dia</Text>
            <Text >Durante {medication.daysOfUsage ? medication.daysOfUsage : 1} dia(s)</Text>
            <Text>{medication.times.map((time) => time).join(', ')}</Text>
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    time :{
        fontSize: 60,
    },
    text: {
        fontSize: 16,
        color: '#666',
    }, 
    separator: {
        marginVertical: 1,
        height: 2,
        width: '95%',
        marginTop: 10,
        marginBottom: 20,
    },
});
