import React from 'react';
import {  creativeStackNavigator } from '@react-navigation/stack';

import Settings from './screens/Settings';

const RootStack = createStactNavigator();

const RootStackScreen = ({navigation}) => (
    <RootStack.Navigator headerMode='none'>
        <RootStackScreen name='SignIn' component={SignIn}/>
        <RootStackScreen name='Settings' component={Settings}/>
    </RootStack.Navigator>    
);

export default RootStackScreen;