import React, { useContext, useEffect, useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image
} from 'react-native';

import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";

import {
  Avatar,
  Title,
  Caption,
  Text,
  TouchableRipple,
  Divider,
} from 'react-native-paper';

import { auth, db, fs } from '../firebase';
import { useNavigation } from '@react-navigation/core';
import { createStackNavigator } from "@react-navigation/stack";
import * as ImagePicker from 'expo-image-picker';
import UserAvatar from 'react-native-user-avatar';
import { collection, getDoc, snapshotEqual, doc } from "firebase/firestore";

const Settings = () => {

  const [users, setUsers] = useState({});


  useEffect(() => {
    // let isSubscribed = true;

    const getUsers = async () => {
      const usersCollection = doc(fs, 'userData', auth.currentUser?.email);
      try {
        const docSnap = await getDoc(usersCollection);
        setUsers(docSnap.data());
        console.log(docSnap.data());
      } catch (error) {
        console.log(error)
      }
    };
    getUsers();
  }, []);


  const navigation = useNavigation();

  const [selectedImage, setSelectedImage] = useState(null);

  let openImagePickerAsync = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true
    });

    console.log(pickerResult);

    if (!pickerResult.cancelled) {
      setSelectedImage({ localUri: pickerResult.uri });
    }
    selectedImage({ uri: 'https://thumbs.dreamstime.com/b/isolated-artistic-drawing-cat-profile-color-sketch-white-background-135822849.jpg' })
  };




  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("LogIn")
      })
      .catch(error => alert(error.message))
  }

  return (
    <View style={styles.container}>
      <View style={{ paddingTop: 27, marginRight: 10, alignSelf: 'flex-end', position: 'relative' }}>
        <Feather.Button
          name="edit-3"
          size={25}
          color='#755a57'
          backgroundColor='#fff'
          onPress={() => navigation.navigate('Profile')}
        />
      </View>

      <View style={{ paddingTop: 0, width: '100%', backgroundColor: '#fff', height: 150, position: 'relative' }}>
        <TouchableOpacity onPress={openImagePickerAsync}
          style={{ padding: 0, width: '100%', height: 150, resizeMode: 'cover', backgroundColor: '#755a57' }}>

          {selectedImage && <Image source={{ uri: selectedImage.localUri }} style={{ padding: 0, width: '100%', height: 150, resizeMode: 'cover' }} />}
          <View></View>
          <View></View>
        </TouchableOpacity>
      </View>

      <View style={{ alignItems: 'center' }}>


        <UserAvatar name= {users.Name}
          //source={{
          //url: 'https://thumbs.dreamstime.com/b/isolated-artistic-drawing-cat-profile-color-sketch-white-background-135822849.jpg'
          //}}
          size={140} style={{
            width: 140, height: 140,
            borderRadius: 100, marginTop: -70, backgroundColor: '#c7a799',
            height: 140, alignContent: 'center'
          }} />
        
        <Text style={{ fontsize: 25, fontWeight: 'bold', paddingTop: 7, paddingBottom: 5, color: '#bfbfbf' }}> Name: {users.Name} </Text>
        <Text style={{ fontsize: 15, fontWeight: 'bold', color: '#bfbfbf' }}>
          Age: {users.Age} </Text>
        <Text style={{ fontsize: 15, fontWeight: 'bold', color: '#bfbfbf' }}>
          Gender: {users.Gender}
        </Text>
        <Text style={{ fontsize: 15, fontWeight: 'bold', color: '#bfbfbf', paddingBottom: 5 }}>
          Email: {auth.currentUser?.email}
        </Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{
          borderBottomColor: '#c7a799',
          borderBottomWidth: 1,
          borderTopColor: '#c7a799',
          borderTopWidth: 1,
          flexDirection: 'row',
          height: 100,
        }}>
          <View style={{
            width: '50%',
            alignItems: 'center',
            justifyContent: 'center',
            borderRightColor: '#c7a799',
            borderRightWidth: 1
          }}>
            <Title> {users.Height} cm</Title>
            <Caption>Height</Caption>
          </View>
          <View style={{
            width: '50%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Title> {users.Weight} kg</Title>
            <Caption>Weight</Caption>
          </View>
        </View>
        <TouchableRipple onPress={() => { }}>
          <View style={styles.box}>
            <MaterialCommunityIcons name="account-box-multiple-outline" size={20}></MaterialCommunityIcons>
            <Text style={styles.boxText}> <Divider></Divider>
              Race: {users.Race} </Text>
          </View>
        </TouchableRipple>
        <TouchableRipple onPress={() => { }}>
          <View style={styles.box}>
            <MaterialCommunityIcons name="account-filter-outline" size={20}></MaterialCommunityIcons>

            <Text style={styles.boxText}> <Divider></Divider>
              Allergies: {users.Allergies} </Text>

          </View>
        </TouchableRipple>
        <TouchableRipple onPress={() => { }}>
          <View style={styles.box}>
            <MaterialCommunityIcons name="help-network-outline" size={20}></MaterialCommunityIcons>
            <Text style={styles.boxText}> Support</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple
          onPress={handleSignOut}>
          <View style={styles.box}>
            <MaterialCommunityIcons name="arrow-up-thin" size={20}></MaterialCommunityIcons>
            <Text style={styles.boxText}> Sign Out</Text>
          </View>
        </TouchableRipple>
      </ScrollView>
    </View>
  )
}


export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    //alignItems: 'center',
    backgroundColor: '#fff'
  },
  box: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#fff',
    width: '90%',
    padding: 20,
    paddingBottom: 22,
    borderRadius: 5,
    shadowOpacity: 15,
    elevation: 15,
    marginTop: 20,
    shadowRadius: 5,
    shadowColor: '#c7a799',
    borderColor: '#c7a799'
  },
  boxText: {
    fontSize: 16,
    alignSelf: 'center'
  }
})