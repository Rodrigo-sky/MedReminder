import React from 'react';
import { View, Text } from 'react-native';
import Logo from '../Logo';

interface HomeScreenProps {
  isDarkMode: boolean;
}

export default function HomeScreen({ isDarkMode }: HomeScreenProps) {

  const color = isDarkMode ? '#fff' : '#000';

  return (
    <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <Logo fillColor={color} width={200}/>
      <Text style={{color: color, fontSize: 18, textAlign: 'center'}}>Bem Vindo{'\n'}Adicione um medicamento</Text>
    </View>
  );
}
