import { Camera, CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Button } from 'react-native-paper';
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Axios } from 'axios';

const CameraFood = () => {
    const cameraRef = useRef();
    const [hasCameraPermission, setHasCameraPermission] = useState();
    const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
    const [photo, setPhoto] = useState();

    useEffect(() => {
        const permissions = async () => {
            const cameraPermission = await Camera.requestCameraPermissionsAsync();
            const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
            setHasCameraPermission(cameraPermission.status === "granted");
            setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
        };
        permissions();
    }, [])


    const navigation = useNavigation();

    const takePic = async () => {
        if (cameraRef) {
            try {
                const newPhoto = await cameraRef.current.takePictureAsync();
                setPhoto(newPhoto.uri);
            } catch (error) {
                console.log(error);
            }
        }
    }

    const savePic = async () => {
        if (photo) {
            try {
                await MediaLibrary.createAssetAsync(image);
                // navigation.navigate(CameraLog)
            } catch (e) {
                console.log(e);
            }
        }
    }



    if (hasCameraPermission === false) {
        return (
            <Text>No camera Permission</Text>
        )
    }


    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#FFF" }}>
            {!photo ?
                <Camera
                    style={styles.container}
                    type={type}
                    flashMode={flash}
                    ref={cameraRef} >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 30 }}>
                        <TouchableOpacity onPress={() => {
                            setType(type === CameraType.back ? CameraType.front : CameraType.back)
                        }}>
                            <Entypo name='retweet' size={28} color='#fff' />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => {
                            setFlash(flash === Camera.Constants.FlashMode.off ? Camera.Constants.FlashMode.on : Camera.Constants.FlashMode.off)
                        }}>
                            <Entypo name='flash' size={28} color={flash === Camera.Constants.FlashMode.off ? '#fff' : '#f1f1f1'} />
                        </TouchableOpacity>
                    </View>
                </Camera>
                :
                <Image source={{ uri: photo }} style={styles.container} />}
            <View>
                {photo ?
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 50 }}>
                        <Button style={styles.box} onPress={() => setPhoto(null)} >
                            <Text style={{ color: '755a57', size: 20 }}> Retake </Text>
                        </Button>
                        <Button style={styles.box} onPress={savePic} >
                            <Text style={{ color: '755a57', size: 20 }}> Save </Text>
                        </Button>
                    </View>
                    :
                    <Button style={styles.box} onPress={takePic} >
                        <Text style={{ color: '755a57', size: 20 }}>Snap</Text>
                    </Button>
                }
            </View>
        </View>

    );

}

    const imageAnalysis = (url) => {
    const [meal, setMeal] = useState("")
    const [recipes, setRecipes] = useState("")

    const [foodSelectedID, setFoodSelectedID] = useState("")
    const [foodSelectedTitle, setFoodSelectedTitle] = useState("")
    const [uid, setUid] = useState(auth.currentUser?.uid)
    const [mealCount, setMealCount] = useState(0);

    const [existingCarb, setExistingCarb] = useState(0)
    const [existingFat, setExistingFat] = useState(0)
    const [existingProtein, setExistingProtein] = useState(0)
    const [existingFibre, setExistingFibre] = useState(0)

    const [carb, setCarb] = useState(0)
    const [fat, setFat] = useState(0)
    const [protein, setProtein] = useState(0)
    const [fibre, setFibre] = useState(0)

    const imageApi = 'https://api.spoonacular.com/food/images/analyze?apiKey=053f245371824675a22b327aaed541ea'

    const getData = async () => {

        const result = await Axios.get(imageApi);
        console.log(result)
        setRecipes(result.data())
        setMeal("")

    }

    const nutritionUrl = `https://api.spoonacular.com/recipes/${foodSelectedID}/nutritionWidget.json?apiKey=dc5b9b69def642819587202e446e413c`
    // const nutritionUrl = https://api.spoonacular.com/recipes/${foodSelectedID}}/information?apiKey=053f245371824675a22b327aaed541ea&includeNutrition=true
    // const nutritionUrl = https://api.spoonacular.com/recipes/${foodSelectedID}/information?apiKey=053f245371824675a22b327aaed541ea&includeNutrition=true

    const logMeal = () => { 
        getNutrition();
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
            setCarb(result.data.carbs.slice(0, -1));
            setFat(result.data.fat.slice(0, -1))
            setProtein(result.data.protein.slice(0, -1));
            helperFindFiber(result.data.good)

            function helperFindFiber(goodArray) { 
                for (let i = 0; i < goodArray.length; i++) {
                    if (goodArray[i].title === "Fiber") {
                        setFibre(goodArray[i].amount.slice(0, -1))
                    }
                }
            }

            console.log(carb, fat, protein, fibre);

            const dbRef = ref(getDatabase());
            get(child(dbRef, uid)).then((snapshot) => {
            if (snapshot.exists()) {
                console.log(snapshot.val());
                setMealCount(snapshot.val().mealCount)
                setExistingCarb(snapshot.val().carbCount)
                setExistingFat(snapshot.val().fatCount)
                setExistingProtein(snapshot.val().proteinCount)
                setExistingFibre(snapshot.val().fibreCount)
            } else {
                console.log("Failed to fetch userdata");
            }
            }).catch((error) => {
            console.error(error);
            });

            update(ref(fs, uid), {
                mealCount: mealCount + 1,
                carbCount: existingCarb + carb, 
                proteinCount: existingProtein + protein, 
                fatCount: existingFat + fat, 
                fibreCount: existingFibre + fibre  
            });

            update(ref(fs, uid + "/meals/" + mealCount), {
                name: foodSelectedTitle, 
                carb, 
                protein, 
                fat, 
                fibre
            });

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
              ); 
        } else { 
            setAlert("Please choose your meal")
        }
    } 

}
export default CameraFood;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "99%",
        alignSelf: 'center',
        justifyContent: "center"
    },
    box: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#fff',
        height: 40,
        borderColor: '#c7a799',
    },
});