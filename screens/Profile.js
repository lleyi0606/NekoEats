import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    TextInput,
    TouchableOpacity
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableRipple } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import BottomTab from '../BottomTab';
import { auth, fs } from '../firebase';
import { collection, setDoc, doc, getDoc} from 'firebase/firestore';

export default function Profile() {

    const [newName, setNewName] = useState("");
    const [newAge, setNewAge] = useState(0);
    const [newGender, setNewGender] = useState("");
    const [newRace, setNewRace] = useState("");
    const [newAllergies, setNewAllergies] = useState("");
    const [newHeight, setNewHeight] = useState(0);
    const [newWeight, setNewWeight] = useState(0);
    const [users, setUsers] = useState([]);

    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState(null);
    const [gender, setGender] = React.useState([
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'Female' }
    ]);

    const [openR, setOpenR] = React.useState(false);
    const [valueR, setValueR] = React.useState(null);

    const [race, setRace] = React.useState([
        { label: 'Chinese', value: 'chinese' },
        { label: 'Malay', value: 'malay' },
        { label: 'Indian', value: 'indian' },
        { label: 'Others', value: 'others' }
    ]);

    const usersCollection = doc(fs, 'userData', auth.currentUser?.email);

    useEffect(() => {
    
        const getUsers = async () => {
          try {
            const docSnap = await getDoc(usersCollection);
            setUsers(docSnap.data());
            console.log(docSnap.data());
          } catch (error) {
            console.log(error)
          }
        };
        getUsers();

        /*const maintainData = async () => {
            await
            setDoc(usersCollection,
                {
                    Name: users.Name,
                    Allergies: users.Allergies,
                    Age: users.Age,
                    Race: users.Race,
                    Height: users.Height,
                    Weight: users.Weight,
                    Gender: users.Gender,

                })
                .catch((error) => console.log(error));
        };
        maintainData();*/
      }, []);
    
    const updateData = async () => {
        const usersCollection = doc(fs, "userData", auth.currentUser?.email);
        await
            setDoc(usersCollection,
                {
                    Name: newName,
                    Allergies: newAllergies,
                    Age: Number(newAge),
                    Race: newRace,
                    Height: Number(newHeight),
                    Weight: Number(newWeight),
                    Gender: newGender,

                })
                .catch((error) => console.log(error));
                navigation.navigate("BottomTab")
    }

    const navigation = useNavigation();

   
    return (
        <View>

            <View style={{ marginLeft: 15, justifyContent: 'flex-start', paddingTop: 40 }}>
                <Ionicons
                    name="md-caret-back-circle-outline"
                    size={25}
                    color='#755a57'
                    //backgroundColor={colors.background}
                    onPress={() => navigation.navigate(BottomTab)}
                />
            </View>

            <View style={styles.action}>
                <MaterialCommunityIcons name="account-outline" size={25} color={"#755a57"} style={{ marginLeft: 15, marginTop: 0 }} />
                <TextInput
                    defaultValue={users.Name}
                    placeholder={users.Name}
                    placeholderTextColor="#666666"
                    autoCorrect={false}
                    style={{
                        flex: 1,
                        color: "#755a57",
                        fontSize: 16,
                        paddingLeft: 10,
                        marginTop: 0
                    }}
                    onChange={(event) => {setNewName(event.nativeEvent.text) }}
                />
            </View>

            <View style={styles.action}>
                <MaterialCommunityIcons name="account-filter-outline" size={25} color={"#755a57"} style={{ marginLeft: 15, marginTop: 0 }} />
                <TextInput
                    defaultValue={users.Allergies}
                    placeholder={users.Name}
                    placeholderTextColor="#666666"
                    autoCorrect={true}
                    style={{
                        flex: 1,
                        color: "#755a57",
                        fontSize: 16,
                        paddingLeft: 10,
                        marginTop: 0
                    }}
                    onChange={(event) => { setNewAllergies(event.nativeEvent.text) }}
                />
            </View>

            <View style={styles.action}>
                <MaterialCommunityIcons name="account-details-outline" size={25} color={"#755a57"} style={{ marginLeft: 15, marginTop: 0 }} />
                <TextInput
                    placeholder= {"" + users.Age}
                    placeholderTextColor="#666666"
                    //defaultValue= {"" + users.Age}
                    autoCorrect={false}
                    keyboardType='numeric'
                    onChange={(event) => { setNewAge(event.nativeEvent.text) }}
                    style={{
                        flex: 1,
                        color: "#755a57",
                        fontSize: 16,
                        paddingLeft: 10,
                        marginTop: 0
                    }}
                />
            </View>

            <View style={styles.action}>
                <MaterialCommunityIcons name="ruler" size={25} color={"#755a57"} style={{ marginLeft: 15, marginTop: 0 }} />
                <TextInput
                    placeholder={"" + users.Height}
                    placeholderTextColor="#666666"
                    //defaultValue={users.Height + ""}
                    autoCorrect={false}
                    keyboardType='numeric'
                    onChange={(event) => { setNewHeight(event.nativeEvent.text) }}
                    style={{
                        flex: 1,
                        color: "#755a57",
                        fontSize: 16,
                        paddingLeft: 10,
                        marginTop: 0
                    }}
                />
            </View>

            <View style={styles.action}>
                <MaterialCommunityIcons name="scale-bathroom" size={25} color={"#755a57"} style={{ marginLeft: 15, marginTop: 0 }} />
                <TextInput
                    placeholder= {"" + users.Weight}
                    placeholderTextColor="#666666"
                    //defaultValue={users.Weight + ""}
                    autoCorrect={false}
                    style={{
                        flex: 1,
                        color: "#755a57",
                        fontSize: 16,
                        paddingLeft: 10,
                        marginTop: 0
                    }}
                    keyboardType='numeric'
                    onChange={(event) => { setNewWeight(event.nativeEvent.text) }}
                />
            </View>

            <View style={{ flexDirection: 'row', width: '70%' }}>
                <MaterialCommunityIcons name="gender-male-female" size={25} color={"#755a57"} style={{ marginLeft: 15, marginTop: 10 }} />
                <DropDownPicker
                    open={open}
                    value={value}
                    items={gender}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setGender}
                    dropDownContainerStyle={{
                        backgroundColor: '#d9c7bf',
                        zIndex: 1000,
                        elevation: 1000,
                        marginLeft: 7
                    }}
                    placeholder=" Biological gender"
                    placeholderTextColor="#666666"
                    defaultIndex={0}
                    containerStyle={{ height: 40 }}
                    dropDownDirection="TOP"
                    style={{ marginLeft: 7, borderColor: '#755a57', backgroundColor: '#fff' }}
                    onChangeValue={(value) => setNewGender("" + value)}

                />
            </View>

            <View style={{ flexDirection: 'row', width: '70%', paddingTop: 30 }}>
                <MaterialCommunityIcons name="account-box-multiple-outline" size={25} color={"#755a57"} style={{ marginLeft: 15, marginTop: 10 }} />
                <DropDownPicker
                    open={openR}
                    value={valueR}
                    items={race}
                    setOpen={(val) => (setOpenR(val))}
                    setValue={setValueR}
                    setItems={setRace}
                    dropDownContainerStyle={{
                        backgroundColor: '#d9c7bf',
                        zIndex: 999,
                        elevation: 1000,
                        marginLeft: 7,
                    }}
                    placeholder=" Race"
                    placeholderTextColor="#666666"
                    defaultIndex={0}
                    containerStyle={{ height: 40 }}
                    style={{ marginLeft: 7, borderColor: '#755a57', backgroundColor: '#fff' }}
                    onChangeValue={((value) =>  setNewRace("" + value))}
                    dropDownDirection='TOP'
                />
            </View>

            <View style={styles.container}>
                <TouchableRipple onPress={() => updateData()}>
                    <View style={styles.box}>
                        <Text style={styles.text}> Save </Text>
                    </View>
                </TouchableRipple>
            </View>



        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        //flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        color: "#755a57",
        fontFamily: 'JMH'
    },
    box: {
        alignItems: 'center',
        //flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#fff',
        //width: '90%',
        padding: 20,
        paddingBottom: 22,
        borderRadius: 5,
        shadowOpacity: 15,
        //elevation: 15,
        marginTop: 35,
        shadowColor: '#c7a799',
        borderColor: '#c7a799'
    },
    TextInput: {

        flex: 1,
        color: "#755a57",
        fontSize: 16,
        paddingLeft: 10,
        marginTop: 13

    },
    welcome: {
        alignSelf: 'center',
        fontSize: 37,
        fontWeight: 'bold',
        color: "#755a57",
        fontFamily: 'SmartWatchBold-z8rd4',
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5,

    },

})