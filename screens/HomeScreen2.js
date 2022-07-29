import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  View,
  Text,
  StyleSheet,
  Image
} from 'react-native';
import { TouchableOpacity, FlatList } from 'react-native-gesture-handler'
import { render } from 'react-dom';

function HomeScreen2() {

    const [mealData, setMealData] = useState(null);
    // const [reco, setReco] = useState(null);
    const [minCarb, setMinCarb] = useState(227);
    const [maxCarb, setMaxCarb] = useState(328); 
    const [carb, setCarb] = useState(0); 
    const [proteinGoal, setProteinGoal] = useState(40); 
    const [protein, setProtein] = useState(0); 
    const [minFat, setMinFat] = useState(45); 
    const [maxFat, setMaxFat] = useState(79); 
    const [fat, setFat] = useState(0); 
    const [fiberGoal, setFiberGoal] = useState(25); 
    const [fiber, setFibre] = useState(0); 
    const [mealsLeft, setMealsLeft] = useState(3); 
    
    const actlMealsLeft = mealsLeft === 0 ? 1 : mealsLeft;

    useEffect(() => {
        const fetchData = async () => { 
            const result = await axios('https://api.spoonacular.com/recipes/findByNutrients?apiKey=053f245371824675a22b327aaed541ea&minCarbs=10&number=3',);
        setMealData(result.data);
        };
        fetchData();
    }, []);
    
    function calcMin(minGoal, curr) { 
        const lacking = minGoal - curr; 
        if (Math.sign(lacking) == '-') { 
            return 0; 
        } else { 
            return lacking/actlMealsLeft; 
        }
    }
    
    function calcMax(maxGoal, curr) { 
        const exceed = curr - maxGoal; 
        if (Math.sign(exceed) == '+') { 
            return 0; 
        } else { 
            return exceed/actlMealsLeft; 
        }
    }
    
    function getMealData() { 
        const tail = "`https://api.spoonacular.com/recipes/findByNutrients?apiKey=a8263efe42f543b9bd7f18869129cd5b"
                    + "&minCarbs=" + calcMin(minCarb, carb) 
                    + "&maxCarbs=" + calcMax(maxCarb, carb)
                    + "&minProtein=" + (proteinGoal - protein)/actlMealsLeft
                    + "&minFat=" + calcMin(minFat, fat) 
                    + "&maxFat=" + calcMax(maxFat, fat) 
                    + "&minFiber=" + (fiberGoal - fiber)/actlMealsLeft
                    + "&number=2`" 

        const minCarbx = calcMin(minCarb, carb) 
        const maxCarbx = calcMax(maxCarb, carb)
        const minProteinx = (proteinGoal - protein)/actlMealsLeft
        const minFatx = calcMin(minFat, fat) 
        const maxFatx = calcMax(maxFat, fat) 
        const minFiberx= (fiberGoal - fiber)/actlMealsLeft

        fetch(
            // `https://api.spoonacular.com/recipes/findByNutrients?apiKey=6412f4be04f9479a8d6b4703c67530fc&minCarbs=${minCarbx}&maxCarbs=${maxCarbx}&minProtein=${minProteinx}&minFat=${minFatx}&maxFat=${maxFatx}&minFibre=${minFiberx}&number=5`

            /* `https://api.spoonacular.com/recipes/findByNutrients?apiKey=6412f4be04f9479a8d6b4703c67530fc
                    &minCarbs=${calcMin(minCarb, carb)}
                    &maxCarbs=${calcMax(maxCarb, carb)}
                    &minProtein=${(proteinGoal - protein)/actlMealsLeft}
                    &minFat=${calcMin(minFat, fat)}
                    &maxFat=${calcMax(maxFat, fat)}
                    &minFibre=${(fiberGoal - fiber)/actlMealsLeft}
                    &number=5` */
            `https://api.spoonacular.com/recipes/findByNutrients?apiKey=6412f4be04f9479a8d6b4703c67530fc&minCarbs=10&number=3`
        )
        .then((response) => response.json())
        .then((data) => {
            setMealData(data);
            console.log(data);
        })
        .catch(() => { 
            console.log("error");
        })
    }

    var reco = 
        <TouchableOpacity style={styles.loginBtn} onPress={handleChange}>
            <Text style={styles.loginText}>Get Recos</Text>
        </TouchableOpacity>

    const handleChange = () => { 
        getMealData()
        reco = renderMealReco()
    }

    function renderMealReco() { 
        const latitude = "1.296202"
        const longitude = "103.776899"
        const renderItem = ({item}) => (
            <View>
                
            <TouchableOpacity
                style = {{marginBottom: 10, marginTop: 5}}
            >
                <View> 
                    <Image 
                        source={{uri: item.image}}
                        resizeMode = "cover" 
                        style = {{ 
                            width: "100%", 
                            height: 150, 
                            borderRadius: 30
                        }}
                    />
                    <Text style = {styles.foodText}>{item.title}</Text>
                </View>
            </TouchableOpacity>
            </View>
        )
        return (
            <View>
                <Text style = {styles.recoText}>Recommended for Your Next Meal</Text>
                <FlatList 
                data={mealData}
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
        <View style = {styles.container}>
            {renderMealReco()}
        </View>
    )
} 

export default HomeScreen2; 

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff"
    },
    reco: { 
        backgroundColor: "#d9c7bf",
        borderTopLeftRadius: 20, 
        borderTopRightRadius: 20, 
        paddingHorizontal: 0,
        paddingVertical: 20
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
    button: {
        borderRadius: 20,
        padding: 10,
        backgroundColor: "#c7ac99", 
        marginHorizontal: 20
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
    }
}) 