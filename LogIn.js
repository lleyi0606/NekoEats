import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import { auth } from './firebase'


function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => { 
      if (user) { 
        navigation.replace('BottomTab')
      }
    })

    return unsubscribe
  }, [])

  const handleSignUp = () => { 
    auth 
      .createUserWithEmailAndPassword(email, password)
      .then(userCredentials => { 
        const user = userCredentials.user; 
        console.log('Registered with', user.email); 
      })
      .catch(error => alert(error.message))
  }

  const handleLogIn = () => { 
    auth 
      .signInWithEmailAndPassword(email, password)
      .then(userCredentials => { 
        const user = userCredentials.user; 
        console.log('Logged in with:', user.email); 
      })
      .catch(error => alert(error.message))
  }

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require("./assets/temp.jpeg")} />
      <Text style ={styles.logoText}>Welcome to NekoEats.</Text>
 
      <StatusBar style="a uto" />
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Email."
          value={email}
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setEmail(text)}
        />
      </View>
 
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Password."
          value={password}
          placeholderTextColor="#003f5c"
          secureTextEntry={true}
          onChangeText={(text) => setPassword(text)}
        />
      </View>
 
      <TouchableOpacity>
        <Text style={styles.forgot_button}>Forgot Password?</Text>
      </TouchableOpacity>
 
      <TouchableOpacity style={styles.loginBtn} onPress={handleLogIn}>
        <Text style={styles.loginText}>LOGIN</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.replace('SignUp')}>
        <Text style={styles.signup_button}>Sign up.</Text>
      </TouchableOpacity>
    </View>
  );
}

export default LogIn;
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
 
  image: {
    marginBottom: 10,
  },

  logoText: { 
      marginVertical: 15, 
      fontSize: 20, 
      fontWeight: 'bold',
      color: "#755a57",
      marginBottom: 40
  },
 
  inputView: {
    backgroundColor: "#d9c7bf",
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginBottom: 20,
    alignItems: "center",
  },
 
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
  },
 
  forgot_button: {
    height: 30,
    marginBottom: 20,
  },
 
  loginBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: "#c7a799",
  },

  signup_button: {
    height: 30,
    marginBottom: 30,
  },
});