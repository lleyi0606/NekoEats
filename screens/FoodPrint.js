import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  FlatList, ScrollView, RefreshControl
} from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { getDatabase, ref, child, get } from "firebase/database";
import { auth, db, fs } from '../firebase';

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { render } from 'react-dom';

export default function FoodPrint() {

    const [users, setUsers] = useState({});
    const [refreshing, setRefreshing] = useState(true);

    useEffect(() => {
        loadUserData()
    }, []); 

    const loadUserData = () => {
        const dbRef = ref(getDatabase());
        const getUsers = async () => {
        get(child(dbRef, auth.currentUser?.uid)).then((snapshot) => {
          if (snapshot.exists()) {
            console.log(snapshot.val());
            setUsers(snapshot.val())
            setRefreshing(false);
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
        return (
            <View>
                <Text style = {styles.logMealText}>Your meals of the day</Text>
                <FlatList 
                data={users.meals}
                keyExtractor={item => helpExtract(item, "index")}
                renderItem={renderItem}
                contentContainerStyle = {{
                    paddingHorizontal: 20
                    
                }}
                scrollEnabled="false"
                style = {styles.reco}
                />
            </View>
        )
    }

    function percentage(count, goal) { 
        console.log(users.meals)
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
        <ScrollView refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={loadUserData} />
        }>
            {header()}
            <Text style = {styles.componentText}>Macaroni</Text>
            <Text style = {styles.smallText}>The Carbohydrates Cat</Text>
            <View style = {styles.barContainer}>
                <MaterialCommunityIcons name="bread-slice-outline" size={30} color="black" />
                <ProgressBar progress={percentage(users.carbCount, users.carbGoal)} color = "#c7a799" style = {styles.bar}/>                
            </View>
            <Text style = {styles.numbersText}>{users.carbCount}/{Math.round(users.carbGoal)}g</Text>

            <Text style = {styles.componentText}>Cheesy</Text>
            <Text style = {styles.smallText}>The Fats Cat</Text>
            <View style = {styles.barContainer}>
                <MaterialCommunityIcons name="cheese" size={30} color="black" />                
                <ProgressBar progress={percentage(users.fatCount, users.fatGoal)} color = "#c7a799" style = {styles.bar}/>
            </View>
            <Text style = {styles.numbersText}>{users.fatCount}/{Math.round(users.fatGoal)}g</Text>

            <Text style = {styles.componentText}>Fishy</Text>
            <Text style = {styles.smallText}>The Proteins Cat</Text>
            <View style = {styles.barContainer}>
                <MaterialCommunityIcons name="fish" size={30} color="black" />                
                <ProgressBar progress={percentage(users.proteinCount, users.proteinGoal)} color = "#c7a799" style = {styles.bar}/>
            </View>
            <Text style = {styles.numbersText}>{users.proteinCount}/{Math.round(users.proteinGoal)}g</Text>

            <Text style = {styles.componentText}>Macaroni</Text>
            <Text style = {styles.smallText}>The Micronutrients Cat</Text>
            <View style = {styles.barContainer}>
                <MaterialCommunityIcons name="leaf" size={30} color="black" />                
                <ProgressBar progress={percentage(users.fibreCount, users.fibreGoal)} color = "#c7a799" style = {styles.bar}/>
            </View>
            <Text style = {styles.numbersText}>{users.fibreCount}/{Math.round(users.fibreGoal)}g</Text>
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
      marginLeft: 15, 
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
        alignItems: "center"
    }, 
    logMealText: { 
        fontSize: 20,
        color: "#3b3a3a",
        fontWeight: "bold",
        paddingTop: 10, 
        paddingHorizontal: 10
    }
  });