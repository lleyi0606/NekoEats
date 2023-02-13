import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TextInput, Alert, FlatList, Modal } from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Axios from 'axios';
import { auth, db } from './firebase';
import { getDatabase, ref, child, get, update } from "firebase/database";

function Manual() {

    const [meal, setMeal] = useState("")
    const [recipes, setRecipes] = useState("")
    const [alert, setAlert] = useState("") 
    const [foodSelectedID, setFoodSelectedID] = useState("")
    const [foodSelectedTitle, setFoodSelectedTitle] = useState("")
    const [uid, setUid] = useState(auth.currentUser?.uid)
    const [mealCount, setMealCount] = useState(0);
    const [counter, setCounter] = useState(0);

    const [existingCarb, setExistingCarb] = useState(0)
    const [existingFat, setExistingFat] = useState(0)
    const [existingProtein, setExistingProtein] = useState(0)
    const [existingFibre, setExistingFibre] = useState(0)

    /* const [carb, setCarb] = useState(0)
    const [fat, setFat] = useState(0)
    const [protein, setProtein] = useState(0)
    const [fibre, setFibre] = useState(0) */

    useEffect(() => {
        const dbRef = ref(getDatabase());
        const fetchData = () => {
            get(child(dbRef, uid)).then((snapshot) => {
            if (snapshot.exists()) {
                console.log(snapshot.val());
                setMealCount(snapshot.val().mealCount)
                setExistingCarb(snapshot.val().carbCount)
                setExistingFat(snapshot.val().fatCount)
                setExistingProtein(snapshot.val().proteinCount)
                setExistingFibre(snapshot.val().fibreCount)
                setCounter(snapshot.val().counter)
            } else {
                console.log("Failed to fetch userdata");
            }
            }).catch((error) => {
            console.error(error);
        }); }
        fetchData();
    }, []);

    const createAlert = () => {
    Alert.alert(
      "Error!",
      alert,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => console.log("OK Pressed") }
      ]
    ); 
    }

    const url = `https://api.spoonacular.com/recipes/autocomplete?apiKey=05d4acea441c4cbda60f9ab6d5f22324&query=${meal}&number=10`

    const navigation = useNavigation()

    const findMeals = async () => {
        if (meal !== "") {
            const result = await Axios.get(url);
            if (result.data.length === 0) {
                setAlert("No food with such name");
                return createAlert()
            }
            console.log(result.data);
            setRecipes(result.data);
            setMeal("");
        } else { 
            setAlert("Please input your meal")
            return createAlert()
        }
    }

    const nutritionUrl = `https://api.spoonacular.com/recipes/${foodSelectedID}/nutritionWidget.json?apiKey=05d4acea441c4cbda60f9ab6d5f22324`
    // const nutritionUrl = `https://api.spoonacular.com/recipes/${foodSelectedID}}/information?apiKey=053f245371824675a22b327aaed541ea&includeNutrition=true`
    // const nutritionUrl = `https://api.spoonacular.com/recipes/${foodSelectedID}/information?apiKey=053f245371824675a22b327aaed541ea&includeNutrition=true`

    const logMeal = () => { 
        getNutrition();
        // writeData();
        console.log(foodSelectedTitle + " logged");
    }
    
    const getNutrition = async () => {
        if (foodSelectedID !== "") {
            const result = await Axios.get(nutritionUrl);
            if (result.data.length === 0) {
                setAlert("Data not found");
                return createAlert();
            }
            console.log(result.data);
            const carb = parseInt(result.data.carbs.slice(0, -1));
            const fat = parseInt(result.data.fat.slice(0, -1)); 
            const protein = parseInt((result.data.protein.slice(0, -1)));
            const fibre = parseInt((helperFindFiber(result.data.good))); 
    

            console.log("CHECK:", carb, fat, protein, fibre)

            function helperFindFiber(goodArray) { 
                for (let i = 0; i < goodArray.length; i++) {
                    if (goodArray[i].title === "Fiber") {
                        return parseInt(goodArray[i].amount.slice(0, -1));
                    }
                }
            }

            update(ref(db, uid + "/meals/" + mealCount), {
                index: mealCount, 
                name: foodSelectedTitle, 
                foodID: foodSelectedID,
                carb, 
                protein, 
                fat, 
                fibre, 
                counter
            }) 
            .then(update(ref(db, uid), {
                mealCount: mealCount + 1,
                counter: counter + 1, 
                carbCount: existingCarb + carb, 
                proteinCount: existingProtein + protein, 
                fatCount: existingFat + fat, 
                fibreCount: existingFibre + fibre  
            }))
            .then(
                Alert.alert(
                    "Success!",
                    foodSelectedTitle + " is logged",
                    [
                      {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                      },
                      { text: "OK", onPress: () => console.log("OK Pressed") }
                    ]
                  )
            )

        } else { 
            setAlert("Please choose your meal")
        }
    } 

    function writeData() {
        console.log("in writeData():" + carb, fat, protein, fibre);

        update(ref(db, uid), {
            mealCount: mealCount + 1,
            carbCount: existingCarb + carb, 
            proteinCount: existingProtein + protein, 
            fatCount: existingFat + fat, 
            fibreCount: existingFibre + fibre  
        })
        .then(
            Alert.alert(
                "Success!",
                foodSelectedTitle + " is logged",
                [
                  {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                  },
                  { text: "OK", onPress: () => console.log("OK Pressed") }
                ]
              )
        )
    }

    function renderResults() { 

        const [modalVisible, setModalVisible] = useState(false);

        const renderItem = ({item}) => (
            <View>

                <Modal 
                    animationType = "slide"
                    transparent 
                    visible = {modalVisible}
                    backdropOpacity = {0.3}
                    onRequestClose = {() => {
                        setModalVisible(!modalVisible);
                    }}
                  >
                      <View style={styles.centeredView}>
                        <View style={styles.modalView}>

                            <View style={{
                                    marginTop: 12,
                                    marginLeft: 12
                                }}>
                                <AntDesign
                                    name="closecircleo"
                                    size={25}
                                    color='#755a57'
                                    onPress={() => {setModalVisible(!modalVisible); setFoodSelectedID(""); setFoodSelectedTitle("");}}
                                />
                            </View>
                            <Text style = {styles.illText}>Do you wish to log:</Text>
                            <Text style = {styles.mealText}>{foodSelectedTitle}</Text>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => {logMeal(); setModalVisible(!modalVisible); setFoodSelectedID(""); setFoodSelectedTitle("");}}
                            >
                                <Text style={styles.modalButtonText}>Yes</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                  </Modal> 
                
            <TouchableOpacity
                style = {{marginBottom: 10, marginTop: 5}}
                onPress = {() => {setModalVisible(true); setFoodSelectedID(item.id); setFoodSelectedTitle(item.title);}}
            >
                <View> 
                    <Text style = {styles.foodText}>{item.title}</Text>
                </View>
            </TouchableOpacity>
            </View>
        )
        return (
            <View>
                <Text style = {styles.recoText}>Select the closest match to your meal</Text>
                <FlatList 
                data={recipes}
                keyExtractor={item => `${item.id}`}
                renderItem={renderItem}
                contentContainerStyle = {{
                    paddingHorizontal: 20, 
                    paddingBottom: 300
                }}
                style = {styles.reco}
                />
            </View>
        )
    }


    return (
        <SafeAreaView>
            <View style={{ marginLeft: 30,
            alignSelf: 'flex-start',
            }}>
                <Ionicons
                    name="md-caret-back-circle-outline"
                    size={25}
                    color='#755a57'
                    onPress={() => navigation.goBack()}
                />
            </View>
            <View style = {styles.inputView}>
                <TextInput
                placeholder="Input your meal"
                value={meal}
                placeholderTextColor="#fff"
                onChangeText={(meal) => setMeal(meal)}
                style = {styles.TextInput}
                />
            </View>
            <TouchableOpacity style = {styles.searchBtn} onPress={findMeals}>
                <Text style = {styles.searchText}>Search</Text>
            </TouchableOpacity>
            {renderResults()}
        </SafeAreaView>
    );
}

export default Manual;

const styles = StyleSheet.create({
    inputView: {
        backgroundColor: "#d9c7bf",
        borderRadius: 5,
        width: "90%",
        height: 45,
        marginTop: 5,
        alignItems: "center",
        alignSelf: "center"
      },
     
      TextInput: {
        height: 50,
        flex: 1,
        padding: 10,
      }, 
      searchBtn: { 
          backgroundColor: "#c7a799", 
          alignSelf: "center", 
          width: "50%", 
          borderRadius: 30, 
          height: 50, 
          alignItems: "center", 
          marginTop: 30, 
          paddingVertical: 2, 
          marginBottom: 20
      }, 
      searchText: { 
          color: "#fff", 
          fontWeight: "600", 
          padding: 10, 
          fontSize: 20
      }, 
      reco: { 
        backgroundColor: "#d9c7bf",
        borderTopLeftRadius: 20, 
        borderTopRightRadius: 20, 
        paddingHorizontal: 0,
        paddingTop: 20, 
        paddingBottom: 200
    }, 
    recoText: { 
        fontSize: 16,
        marginLeft: 10,
        color: "#d9c7bf",
        fontWeight: "bold",
        paddingTop: 5
    }, 

    foodText: { 
        fontSize: 15,
        color: "#FFF",
        fontWeight: "600",
        paddingTop: 5
    }, 
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
      },
      modalView: {
        width: "90%", 
        backgroundColor: "#fff",
        borderRadius: 20,
        paddingHorizontal: 2, 
        paddingBottom: 20,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4
      },
      button: {
        borderRadius: 20,
        paddingVertical: 10,
        marginVertical: 5,
        backgroundColor: "#c7ac99", 
        marginHorizontal: 100, 
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4, 
        alignItems: "center"
      }, 
      modalButtonText: { 
        color: "#FFF", 
        fontWeight: "600", 
        fontSize: 17
    }, 
    illText: { 
        color: "#c7ac99",
        fontWeight: "500", 
        fontSize: 16, 
        alignSelf: 'center'
    }, 
    mealText: { 
        color: "#755a57",
        fontWeight: "600", 
        fontSize: 18, 
        alignSelf: 'center', 
        paddingVertical: 5
    }
});