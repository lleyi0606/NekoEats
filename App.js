import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, useNavigation } from '@react-navigation/native-stack';
import BottomTab from './BottomTab';
import LogIn from "./LogIn";
import SignUp from "./SignUp";
import Manual from './Manual';
import Profile from './screens/Profile'
import Start from "./screens/Start"
import NewProfile from './screens/NewProfile'
import NewProfile2 from './screens/NewProfile2'
import AppLoading from 'expo-app-loading';
import useFonts from './font';
import Settings from './screens/Settings';
import CameraFood from './CameraFood';

export default function App() {

  const [IsReady, SetIsReady] = useState(false);

  const LoadFontsAndRestoreToken = async () => {
    await useFonts();
  };

  if (!IsReady) {
    return (
      <AppLoading
        startAsync={LoadFontsAndRestoreToken}
        onFinish={() => SetIsReady(true)}
        onError={() => { }}
      />
    );
  }

  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Start"
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name='BottomTab' component={BottomTab} />
        <Stack.Screen name='LogIn' component={LogIn} />
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen name='SignUp' component={SignUp}/>
        <Stack.Screen name='Profile' component={Profile} />
        <Stack.Screen name='Settings' component={Settings}/>
        <Stack.Screen name='Manual' component={Manual}/>
        <Stack.Screen name='NewProfile' component={NewProfile}/>
        <Stack.Screen name='NewProfile2' component={NewProfile2}/>
        <Stack.Screen name='CameraFood' component={CameraFood}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}