import React from 'react';
import {
  View,
  Text,
  StyleSheet
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import Game from './screens/Game';
import FoodPrint from './screens/FoodPrint';
import Community from './screens/Community';
import Settings from './screens/Settings';
import {Feather, MaterialCommunityIcons} from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const screenOptionStyle = {
    headerShown: false
}

const BottomTab = () => {
    return (
        <Tab.Navigator
            screenOptions = {screenOptionStyle}
            tabBarShowLabel = {{
                showLabel: false
            }}
            >
            <Tab.Screen name= "HomeScreen" component={HomeScreen}
                options= {{
                    tabBarIcon: ({focused}) => (
                        <View style= {{
                            position: 'absolute',
                            top: '25%',
                        }}>
                            <Feather
                            name= 'home'
                            size= {26}
                            color= {focused? '#bfbfbf' : '#c7a799'}
                            ></Feather>
                        </View>
                    )
                }}/>
            <Tab.Screen name= "FoodPrint" component={FoodPrint}
                options= {{
                    tabBarIcon: ({focused}) => (
                        <View style= {{
                            position: 'absolute',
                            top: '25%'
                        }}>
                            <Ionicons
                            name= 'bar-chart-outline'
                            size= {26}
                            color= {focused? '#bfbfbf' : '#c7a799'}
                            ></Ionicons>
                        </View>
                    )
                }}
            />
            <Tab.Screen name= "Settings" component={Settings}
                options= {{
                    tabBarIcon: ({focused}) => (
                        <View style= {{
                            position: 'absolute',
                            top: '25%'
                        }}>
                            <Ionicons
                            name= 'ios-settings-outline'
                            size= {26}
                            color= {focused? '#bfbfbf' : '#c7a799'}
                            ></Ionicons>
                        </View>
                    )
                }}
            />
        </Tab.Navigator>
    )
}

export default BottomTab;