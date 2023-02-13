import React from 'react';
import { AntDesign } from '@expo/vector-icons';
import { StyleSheet, 
  TouchableOpacity,
  Text, 
  SafeAreaView, 
  View,
AppRegistry } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';

const Start = () => {

  const navigation = useNavigation();
  
  return (
    <SafeAreaView
      style={{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0efeb',
      }}>
      <View>
      <Text style = {{fontSize:35, fontWeight: 'bold', color: '#c7a799', paddingBottom: 10, fontFamily: 'SmartWatchBold-z8rd4'}}>
        NekoEats
      </Text>
      </View>
      <TouchableOpacity style={{
        backgroundColor: '#c7a799', 
        padding:15, 
        width:'50%', 
        flexDirection:'row', 
        justifyContent:'space-between',
        
      }}
      onPress={() => navigation.navigate('LogIn')}>
          
          <Text style={{
            fontWeight:'bold',
            fontSize: 25,
            color: '#fff',
            fontFamily: 'SMARTWATCH', 
            paddingRight: 8
          }}>
            Let's Begin
          </Text>
          <AntDesign name = "rightcircleo" size={22} color='#fff'/>
          
        </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Start;

AppRegistry.registerComponent('Appname', () => App);
