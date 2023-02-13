import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  FlatList, ScrollView, LogBox, Alert, Image, Dimensions
} from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { getDatabase, ref, child, get, remove, update } from "firebase/database";
import { auth, db, fs } from '../firebase';
import { MaterialCommunityIcons, Entypo, Foundation } from "@expo/vector-icons";
import { TouchableOpacity, Swipeable } from 'react-native-gesture-handler';
import SwipeView from 'react-native-swipeview';
import { reloadAsync } from 'expo-updates';

export default function FoodPrint() {

    const [users, setUsers] = useState({});
    const [uid, setUid] = useState(auth.currentUser?.uid); 
    const [currMealCount, setCurrMealCount] = useState(0);
    const [activeRowKey, setActiveRowKey] = useState(null);

    /* const [existingCarb, setExistingCarb] = useState(0)
    const [existingFat, setExistingFat] = useState(0)
    const [existingProtein, setExistingProtein] = useState(0)
    const [existingFibre, setExistingFibre] = useState(0) */

    useEffect(() => {
        loadUserData()
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    }, []); 

    const loadUserData = () => {
        const dbRef = ref(getDatabase());
        const getUsers = async () => {
        get(child(dbRef, auth.currentUser?.uid)).then((snapshot) => {
          if (snapshot.exists()) {
            console.log(snapshot.val());
            setUsers(snapshot.val())
          } else {
            console.log("No name available");
          }
        }).catch((error) => {
          console.error(error);
        });
        }
        getUsers();
    }
    


    function header() { 
        return (
            <SafeAreaView style = {styles.header}> 
                    <Text style = {styles.headerText}>Your Progress</Text>
            </SafeAreaView>
        )
    }

    function helpExtract(item, prop) {
        if (item === undefined) {
            return null; 
        } else { 
            if (prop === "index") {
                return item.index
            } else if (prop === "foodID") {
                return item.foodID
            } else if (prop === "name") {
                return item.name
            } else if (prop === "protein") {
                return item.protein + "g"
            } else if (prop === "carb") {
                return item.carb + "g"
            } else if (prop === "fat") {
                return item.fat + "g"
            } else if (prop === "fibre") {
                return item.fibre + "g"
            }
        }
    }

    function renderLoggedMeals() { 

        /* this.leftOpenValue = Dimensions.get('window').width;
        this.rightOpenValue = -Dimensions.get('window').width; */


        const renderItem = ({item}) => (     
                            <View style = {{flexDirection: "row", alignSelf: "center"}}>   
                            <View
                                style = {{marginVertical: 10, marginRight: 10, width: "35%", backgroundColor: "#ebe5e1", padding: 3, shadowColor: "#000", 
                                shadowOffset: {
                                width: 0,
                                height: 2
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 4}}
                            >
                                <View> 
                                    <Text style = {styles.mealText}>{helpExtract(item, "name")}</Text>
                                </View>
                            </View> 
                            <View
                                style = {{marginVertical: 10, width: "60%", backgroundColor: "#ebe5e1", padding: 10, shadowColor: "#000", 
                                shadowOffset: {
                                width: 0,
                                height: 2
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 4}}>
                                    <Text style = {styles.smallText}>Carbohydrates: {helpExtract(item, "carb")}</Text>
                                    <Text style = {styles.smallText}>Fats: {helpExtract(item, "fat")}</Text>
                                    <Text style = {styles.smallText}>Protein: {helpExtract(item, "protein")}</Text>
                                    <Text style = {styles.smallText}>Fiber: {helpExtract(item, "fibre")}</Text>
                            </View>
                            </View> 
        )

        console.log(users)

        return (
            <View>
                <Text style = {styles.logMealText}>Your meals of the day</Text>
                <FlatList 
                data={users.meals}
                keyExtractor={item => helpExtract(item, "foodID")}
                renderItem={renderItem}
                contentContainerStyle = {{
                    paddingHorizontal: 20
                    
                }}
                scrollEnabled="false"
                style = {styles.reco}
                // extraData = {users.meals}
                />
            </View>
        ) 
    }

    const handleDelete = (item) => {

        update(ref(db, uid), {
            mealCount: users.mealCount - 1,
            carbCount: users.carbCount - item.carb, 
            proteinCount: users.proteinCount - item.protein, 
            fatCount: users.fatCount - item.fat, 
            fibreCount: users.fibreCount - item.fibre  
        })
        .then(remove(ref(db, auth.currentUser?.uid + "/meals/" + item.counter)))

        Alert.alert(
            item.name + " deleted"
        )

        reloadAsync();
    }

    function percentage(count, goal) { 
        const percentage = count/goal; 
        if (percentage <= 1 && percentage >0) {
            return percentage;
        } else if (percentage > 1) {
            return 1; 
        } else { 
            return 0;
        }
    }

    return (
        <ScrollView>
            {header()}
            <View style = {{flexDirection: 'row'}}>
            <Image style = {styles.image} source = {require("../assets/carb-cat.png")}/>
            <View>
                <Text style = {{color: "#83664f", paddingTop: 10, paddingLeft: 10, fontSize: 16, fontWeight: "bold"}}>Macaroni</Text>
                <Text style = {styles.smallText}>The Carbohydrates Cat</Text>
                <View style = {styles.barContainer}>
                    <ProgressBar progress={percentage(users.carbCount, users.carbGoal)} color = "#c7a799" style = {styles.bar}/>                
                </View>
                <Text style = {styles.numbersText}>{users.carbCount}/{Math.round(users.carbGoal)}g</Text>
            </View>
            </View>

            <View style = {{flexDirection: 'row'}}>
            <Image style = {styles.image} source = {require("../assets/fats-cat.png")}/>
            <View>
                <Text style = {{color: "#ae9862", paddingTop: 10, paddingLeft: 10, fontSize: 16, fontWeight: "bold"}}>Cheesy</Text>
                <Text style = {styles.smallText}>The Fats Cat</Text>
                <View style = {styles.barContainer}>
                    <ProgressBar progress={percentage(users.fatCount, users.fatGoal)} color = "#c7a799" style = {styles.bar}/>
                </View>
                <Text style = {styles.numbersText}>{users.fatCount}/{Math.round(users.fatGoal)}g</Text>
            </View>
            </View>

            <View style = {{flexDirection: 'row'}}>
            <Image style = {styles.image} source = {require("../assets/protein-cat.png")}/>
            <View>
                <Text style = {{color: "#e4ae89", paddingTop: 10, paddingLeft: 10, fontSize: 16, fontWeight: "bold"}}>Fishy</Text>
                <Text style = {styles.smallText}>The Proteins Cat</Text>
                <View style = {styles.barContainer}>
                    <ProgressBar progress={percentage(users.proteinCount, users.proteinGoal)} color = "#c7a799" style = {styles.bar}/>
                </View>
                <Text style = {styles.numbersText}>{users.proteinCount}/{Math.round(users.proteinGoal)}g</Text>
            </View>
            </View>

            <View style = {{flexDirection: 'row'}}>
            <Image style = {styles.image} source = {require("../assets/veg-cat.png")}/>
            <View>
                <Text style = {{color: "#9f683c", paddingTop: 10, paddingLeft: 10, fontSize: 16, fontWeight: "bold"}}>Macaroni</Text>
                <Text style = {styles.smallText}>The Micronutrients Cat</Text>
                <View style = {styles.barContainer}>
                    <ProgressBar progress={percentage(users.fibreCount, users.fibreGoal)} color = "#c7a799" style = {styles.bar}/>
                </View>
                <Text style = {styles.numbersText}>{users.fibreCount}/{Math.round(users.fibreGoal)}g</Text>
            </View>
            </View>
            {renderLoggedMeals()}

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    header: { 
        backgroundColor: "#c7a799",
        borderBottomLeftRadius: 20, 
        borderBottomRightRadius: 20, 
        paddingHorizontal: 20, 
        alignItems: "center",
        height: 100, 
        shadowColor: '#c7a799',
        shadowOpacity: 15, 
        marginBottom: 8
    }, 
    bar: {
      alignItems: "center",
      justifyContent: "center", 
      width: 300, 
      // marginLeft: 15, 
      height: 20, 
      borderRadius: 50
    },
    headerText: { 
        color: "#FFF", 
        paddingTop: 20 ,
        fontSize: 20, 
        alignItems: "center", 
        fontWeight: "bold"
    }, 
    header2Text: {
        color: "#ebe5e1", 
        paddingTop: 2 ,
        fontSize: 15, 
        alignItems: "center", 
        fontWeight: "bold"
    },
    componentText: { 
        color: "#GGG", 
        paddingTop: 10,
        paddingLeft: 10,
        fontSize: 16, 
        fontWeight: "bold"
    }, 
    mealText: { 
        color: "#GGG", 
        fontSize: 15, 
        padding: 8,
        fontWeight: "500"
    }, 
    smallText: { 
        color: "#696361", 
        paddingLeft: 10,
        fontSize: 10, 
        fontWeight: "bold"
    }, 
    numbersText: { 
        color: "#696361", 
        alignSelf: "flex-end", 
        fontSize: 10, 
        fontWeight: "bold", 
        paddingRight: 10
    }, 
    barContainer: { 
        flexDirection: "row",
        marginBottom: 2,
        paddingHorizontal: 10,
        alignItems: "center", 
        marginTop: 2
    }, 
    logMealText: { 
        fontSize: 20,
        color: "#3b3a3a",
        fontWeight: "bold",
        paddingTop: 10, 
        paddingHorizontal: 10
    }, 
    rowRight: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 3
    }, 
    image: {
        height: "80%", 
        width: "15%", 
        alignSelf: "center", 
        marginLeft: 2
    }
  });