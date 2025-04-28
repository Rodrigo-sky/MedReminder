import React from 'react';
import { useColorScheme, View } from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';
import HomeScreen from './components/pages/HomesScreen';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const safePadding = '5%';

  return (
    <View style={[backgroundStyle, { padding: safePadding }]}>
      <HomeScreen isDarkMode={isDarkMode}></HomeScreen>
    </View>
  );
}

export default App;
