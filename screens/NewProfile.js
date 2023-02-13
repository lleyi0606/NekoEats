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
import Settings from './Settings';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableRipple, useTheme } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import BottomTab from '../BottomTab';
import { auth, db, fs } from '../firebase';
import { collection, setDoc, doc } from 'firebase/firestore';
import { set, ref } from 'firebase/database';

export default function Profile() {

    const [newName, setNewName] = useState("");
    const [newAge, setNewAge] = useState(0);
    const [newGender, setNewGender] = useState("");
    const [newRace, setNewRace] = useState("");
    const [newAllergies, setNewAllergies] = useState("");
    const [newHeight, setNewHeight] = useState(0);
    const [newWeight, setNewWeight] = useState(0);

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

    const addUserData = async () => {
        writeUserData();
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
    };

    /* function writeMacros() { 
        // assume male and lightly active, Men BMR = 66 + (13.7 X weight in kg) + (5 x height in cm) – (6.8 x age in yrs)
        // source: https://steelfitusa.com/blogs/health-and-wellness/calculate-tdee#:~:text=TDEE%20%3D%20BMR%20%2B%20TEF%20%2B%20NEAT%20%2B%20TEA&text=Now%2C%20let's%20take%20a%20look,can%20calculate%20your%20individual%20TDEE.
        // const tdee = users.Gender === "Male" ? (66 + (13.7 * users.Weight) + (5 * users.Height) - (6.8 * users.Age)) * 1.375 : (655 + (9.6 * users.Weight) + (1.8 * users.Height) - (4.7 * users.Age)) * 1.375 
        const tdee = (66 + (13.7 * newWeight) + (5 * newHeight) - (6.8 * users.newAge)) * 1.375

        // source: https://healthyeater.com/flexible-dieting-calculator 
        // 4 calories/gram of protein and carb
        // 9 calories/gram of fat 
        const fatGoal = tdee*0.3/9
        const proteinGoal = users.newWeight*2.20462*0.65
        const carbGoal = (tdee - fatGoal*9 - proteinGoal*4)/4

        console.log(tdee, fatGoal, proteinGoal, carbGoal)

        update(ref(db, auth.currentUser?.uid), {
            fatGoal, 
            proteinGoal, 
            carbGoal
        }); 
    } */

    const tdee = (66 + (13.7 * newWeight) + (5 * newHeight) - (6.8 * newAge)) * 1.375

    const writeUserData = () => {
        set(ref(db, auth.currentUser?.uid), {
            counter: 0, 
            mealCount: 0, 
            carbCount: 0, 
            proteinCount: 0, 
            fatCount: 0, 
            fibreCount: 0, 
            fatGoal: tdee*0.3/9, 
            proteinGoal: newWeight*2.20462*0.65, 
            carbGoal: (tdee - tdee*0.3 - newWeight*2.20462*0.65*4)/4,
            fibreGoal: newGender === 'Female' ? 21 : 30
        })
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
                    placeholder=" Name"
                    placeholderTextColor="#666666"
                    autoCorrect={false}
                    value={newName}
                    style={{
                        flex: 1,
                        color: "#755a57",
                        fontSize: 16,
                        paddingLeft: 10,
                        marginTop: 0
                    }}
                    onChange={(event) => { setNewName(event.nativeEvent.text) }}
                />
            </View>

            <View style={styles.action}>
                <MaterialCommunityIcons name="account-filter-outline" size={25} color={"#755a57"} style={{ marginLeft: 15, marginTop: 0 }} />
                <TextInput
                    placeholder=" Allergies"
                    placeholderTextColor="#666666"
                    autoCorrect={false}
                    value={newAllergies}
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
                    placeholder=" Age"
                    placeholderTextColor="#666666"
                    autoCorrect={false}
                    keyboardType='numeric'
                    value={newAge}
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
                    placeholder=" Height(cm)"
                    placeholderTextColor="#666666"
                    autoCorrect={false}
                    keyboardType='numeric'
                    value={newHeight}
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
                    placeholder=" Weight(kg)"
                    placeholderTextColor="#666666"
                    autoCorrect={false}
                    value={newWeight}
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
                    onChangeItem={(value) => setNewGender("" + value)}

                />
            </View>

            <View style={{ flexDirection: 'row', width: '70%', paddingTop: 30 }}>
                <MaterialCommunityIcons name="account-box-multiple-outline" size={25} color={"#755a57"} style={{ marginLeft: 15, marginTop: 10 }} />
                <DropDownPicker
                    open={openR}
                    value={valueR}
                    items={race}
                    setOpen={setOpenR}
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
                    onChangeItem={(value) => setNewRace("" + value)}
                    dropDownDirection='TOP'
                />
            </View>

            <View style={styles.container}>
                <TouchableRipple onPress={addUserData}>
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