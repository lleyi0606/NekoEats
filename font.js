import * as Font from 'expo-font';

const useFonts = async () => {
  await Font.loadAsync({
    'SMARTWATCH': require('./assets/fonts/SMARTWATCH.ttf'),
    'SmartWatchBold-z8rd4': require('./assets/fonts/SmartWatchBold-z8rd4.ttf'),
    'JMH': require('./assets/fonts/JMHHermes3000.otf')
  });
};

export default useFonts;