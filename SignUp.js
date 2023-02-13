import {
    StyleSheet,
    View,
    TouchableOpacity,
    TextInput,
    SafeAreaView
} from 'react-native';
import React, { useContext, useEffect, useState } from "react";
import {
    Avatar,
    Title,
    Caption,
    Text,
    TouchableRipple,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { auth } from './firebase';
import { createUserWithEmailAndPassword} from 'firebase/auth';

const SignUp = () => {

    const navigation = useNavigation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    /*
    useEffect(() => {
        
        const unsubscribe = auth.onAuthStateChanged(user => { 
          if (user) { 
            navigation.replace("NewProfile")
          }
        })
    
        return unsubscribe
      }, []);
      */



    const register = async () => {
        try {
        const user = await createUserWithEmailAndPassword(auth, email, password);
        navigation.replace("NewProfile")
        //console.log(user);
        } catch(error)  {
                alert(error)
            }
    };
    
    

    return (
        <View style={styles.container}>
            <View style={{
                marginLeft: 30,
                alignSelf: 'flex-start',
            }}>
                <Ionicons
                    name="md-caret-back-circle-outline"
                    size={25}
                    color='#755a57'
                    //backgroundColor={colors.background}
                    onPress={() => navigation.replace('LogIn')}
                />
            </View>
            <Title style={styles.welcome}>Welcome</Title>
            <View style={styles.box}>
                <TextInput
                    placeholder="Email:"
                    value={email}
                    placeholderTextColor="#846562"
                    onChangeText={(text) => setEmail(text)}
                    fontSize={15}
                    fontWeight='bold'
                />
            </View>

            <View style={styles.box}>
                <TextInput
                    placeholder="Password:"
                    value={password}
                    placeholderTextColor="#846562"
                    secureTextEntry={true}
                    onChangeText={(text) => setPassword(text)}
                    fontSize={15}
                    fontWeight='bold'
                />
            </View>
            <View>
                <TouchableRipple onPress={register}>
                    <View style={styles.box}>
                        <Text style={styles.text}> Sign up </Text>
                    </View>
                </TouchableRipple>
            </View>

        </View>
    );
}

export default SignUp;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center', 
        backgroundColor: '#f0efeb'
    },
    text: {
        alignSelf: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        color: "#755a57",
        fontFamily: 'JMH'
    },
    box: {
        //alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#fff',
        width: '90%',
        padding: 20,
        paddingBottom: 22,
        borderRadius: 5,
        shadowOpacity: 15,
        //elevation: 15,
        marginTop: 20,
        shadowColor: '#c7a799',
        borderColor: '#c7a799'
    },
    TextInput: {
        height: 50,
        flex: 1,
        padding: 10,
        color: "#755a57",
        fontSize: 16
    },
    welcome: {
        alignSelf: 'center',
        fontSize: 37,
        fontWeight: 'bold',
        color: "#755a57",
        fontFamily: 'SmartWatchBold-z8rd4',
    },

})