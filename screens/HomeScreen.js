import React, {useState, useEffect} from 'react'
import axios from 'axios';
import { StyleSheet, View, Text, Image, SafeAreaView, Linking, Alert } from 'react-native'
import { TouchableOpacity, FlatList } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native';
// import * as ImagePicker from 'expo-image-picker';
import Modal from 'react-native-modal';
import { AntDesign } from '@expo/vector-icons';
import Axios from 'axios';
import { auth, db, fs } from '../firebase';
import { collection, getDoc, doc } from 'firebase/firestore';
import { getDatabase, ref, child, get, update } from "firebase/database";

const Home = () => {

    const [mealData, setMealData] = useState(null);
    const [mealID, setMealID] = useState("");
    const [mealTitle, setMealTitle] = useState("");

    const [users, setUsers] = useState({});
    const [usersDb, setUsersDb] = useState({});
    const [email, setEmail] = useState(auth.currentUser?.email)
    const [apiUrl, setAPIUrl] = useState('https://api.spoonacular.com/recipes/findByNutrients?apiKey=05d4acea441c4cbda60f9ab6d5f22324&minProtein=15&number=3')
    /* const [name, setName] = useState("");
    const [height, setHeight] = useState(0); 
    const [weight, setWeight] = useState(0);
    const [age, setAge] = useState(0); */

    const navigation = useNavigation()

    useEffect(() => {
        getUsersFb();
        getUsersDb().then(fetchData());
    }, []);

    const getUsersFb = async () => {
        const usersCollection = doc(fs, 'userData', auth.currentUser?.email);
        try {
            const docSnap = await getDoc(usersCollection);
            setUsers(docSnap.data());
            console.log(docSnap.data());
        } catch (error) {
            console.log(error)
        }
    };

    const getUsersDb = async () => {
        const dbRef = ref(getDatabase());
        const getUsers = async () => {
        get(child(dbRef, auth.currentUser?.uid)).then((snapshot) => {
          if (snapshot.exists()) {
            console.log(snapshot.val());
            setUsersDb(snapshot.val())
          } else {
            console.log("Failed to fetch Realtime Database");
          }
        }).catch((error) => {
          console.error(error);
        });
        }
        getUsers();
    }

    const fetchData = async () => { 
        // loadReco()
        console.log("in fetch data:" + apiUrl)
        const result = await axios(apiUrl).catch((error) => {
            console.error(error);
          });
        setMealData(result.data);
        console.log(result.data);
    };

    /* useEffect(() => {
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
            const fetchData = async () => { 
                const result = await axios(customiseRecoLink());
            setMealData(result.data);
            };
            fetchData();
    }, []); */

    function loadReco() { 
        const head = "'https://api.spoonacular.com/recipes/findByNutrients?apiKey=05d4acea441c4cbda60f9ab6d5f22324"
        const tail = "&number=3'"
        var min = "Protein"

        const least = Math.min(usersDb.proteinCount, usersDb.fatCount, usersDb.carbCount, usersDb.fibreCount)

        if (least == usersDb.fibreCount) {
            min = "Fiber"
        } else if (least == usersDb.carbCount) {
            min = "Carbs"
        } else if (least == usersDb.fatCount) {
            min = "Fat"
        }

        console.log(usersDb.proteinCount, usersDb.fatCount, usersDb.carbCount, usersDb.fibreCount)
        console.log(head + '&min' + min + "=" + least + tail)

        setAPIUrl(head + '&min' + min + "=" + least + tail);

    } 
 
    const manualClicked = () => navigation.navigate('Manual')
    const openCamera = () => navigation.navigate('CameraFood')
    
      const LogMealMethods = [
          {
              id: 1, 
              name: "Manual", 
              image: require("../assets/open-hands.png"), 
              handlePress: manualClicked
          }, 
          { 
              id: 2, 
              name: "Snap", 
              image: require("../assets/camera.png"), 
              handlePress: openCamera
          }
      ]
    
      function renderLogMethods() { 
          const renderItem = ({item}) => {
              return (            
                  <TouchableOpacity
                    style = {{
                        padding: 20, 
                        paddingBottom: 20, 
                        marginHorizontal: 40,
                        marginBottom: 10,
                        backgroundColor: "#FFF", 
                        borderRadius: 30, 
                        alignItems: "center", 
                        justifyContent: "center", 
                        marginRight: 10,
                        shadowOffset: {width: 2, height: 4}, 
                        shadowColor: '#000', 
                        shadowOpacity: 0.15, 
                        shadowRadius: 5
                    }}
                    onPress = {item.handlePress}
                    >
                        <View
                            style = {{ 
                                width: 60, 
                                height: 50, 
                                borderRadius: 30, 
                                alignItems: "center", 
                                justifyContent: "center", 
                                backgroundColor: "#FFF",                            
                                shadowColor: '#c7a799', 
                                shadowOffset: {width: 1, height: 2}, 
                                shadowOpacity: 0.5, 
                                shadowRadius: 3 
                            }}
                        >
                            <Image
                                source = {item.image}
                                resizeMode = "contain"
                                style = {{
                                    width: 40, 
                                    height: 40
                                }}
                            />
                        </View>
    
                        <Text
                            style = {{
                                marginTop: 10, 
                                color: "#c7a799", 
                                fontWeight: "bold"
                            }}
                        >
                            {item.name}
                        </Text>
                    </TouchableOpacity>
              )
          }
    
          return (
              <View style = {styles.logMealsBackground}>
                  <Text style = {styles.logMealText}>Log Your Meal</Text>
    
                  <FlatList
                    data = {LogMealMethods}
                    horizontal
                    scrollEnabled = {false}
                    showsHorizontalScrollIndicator = {false}
                    keyExtractor = {item => `${item.id}`}
                    renderItem = {renderItem}
                    contentContainerStyle = {{paddingVertical: 20}}
                    />
              </View>
          )
      } 
        
        function header() { 
            return (
                <SafeAreaView style = {styles.header}> 
                    <Text style = {styles.welcomeText}>Welcome back, {users.Name}</Text>
                </SafeAreaView>
            )
        }

        const url = `https://api.spoonacular.com/recipes/${mealID}/information?apiKey=05d4acea441c4cbda60f9ab6d5f22324&includeNutrition=false`

        const openRecipe = async () => {
            if (mealID !== "") {
                const result = await Axios.get(url);
                if (result.data.length === 0) {
                    return Alert.alert("Failed to retrieve recipe link.")
                }
                console.log(result.data);
                Linking.openURL(result.data.sourceUrl);
            } 
        }

        const openNearMe = async () => {
            if (mealTitle !== "") {
                console.log("opening google");
                Linking.openURL("https://google.com/search?q=" + mealTitle + "+near+me")                
            } 
        }
    
        function renderMealReco() { 
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
                                    padding: 8,
                                    top: -25, 
                                    left: -25, 
                                    marginRight: 190
                                }}>
                                <AntDesign
                                    name="closecircleo"
                                    size={25}
                                    color='#755a57'
                                    onPress={() => {setModalVisible(!modalVisible); setMealID(""); setMealTitle("");}}
                                />
                            </View>
                            <Text style = {styles.illText}>I want to ...</Text>
                            <View style = {styles.twoButtons}>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={openNearMe}
                                >
                                    <Text style={styles.modalButtonText}>Get it</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={openRecipe}
                                >
                                    <Text style={styles.modalButtonText}>Make it</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                  </Modal> 
                <TouchableOpacity
                    style = {{marginBottom: 10, marginTop: 5}}
                    onPress={() => {setModalVisible(true); setMealID(item.id); setMealTitle(item.title);}}
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
                        paddingBottom: 300, 
                    }}
                    style = {styles.reco}
                    />
                </View>
            )
        }
    
        return (
            <View style = {styles.container}>
                {header()}
                {renderLogMethods()}
                {renderMealReco()}
            </View>
        )
    }
    
    export default Home;
    
    const styles = StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: "#fff"
        },
       
        image: {
          marginBottom: 10,
          flexDirection: 'row', 
          justifyContent: "space-around", 
          alignSelf: "center"
        },
    
        header: { 
            backgroundColor: "#c7a799",
            borderBottomLeftRadius: 20, 
            borderBottomRightRadius: 20, 
            paddingTop: 20,
            marginBottom: 10,
            alignItems: "center",
            height: 90, 
            shadowColor: '#000',
            shadowOpacity: 0.1, 
            shadowOffset: {width: 4, height: 6}, 
            shadowRadius: 3
        }, 
    
        reco: { 
            backgroundColor: "#d9c7bf",
            borderTopLeftRadius: 20, 
            borderTopRightRadius: 20, 
            paddingHorizontal: 0,
            paddingVertical: 20
        }, 
    
        logMealsBackground: { 
            backgroundColor: "#FFF",
            paddingHorizontal: 20, 
            height: 160
        },
    
        welcomeText: { 
            fontSize: 20,
            color: "#FFF",
            fontWeight: "bold"
        }, 
    
        logMealText: { 
            fontSize: 20,
            color: "#3b3a3a",
            fontWeight: "bold",
            paddingTop: 5
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
    
        logMealButtonText: { 
            fontSize: 14, 
            color: "#3b3a3a", 
            alignSelf: "center"
        }, 
        centeredView: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 22
          },
          modalView: {
            width: "90%", 
            height: "20%",
            backgroundColor: "#fff",
            borderRadius: 20,
            padding: 35, 
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
            padding: 10,
            backgroundColor: "#c7ac99", 
            marginHorizontal: 20, 
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 4
          }, 
        twoButtons: {
            flexDirection: 'row', 
            position: 'absolute', 
            top: 55, 
            alignSelf: 'center'
        }, 
        closeButtonNo: { 
            position: 'absolute', 
            top: -22, 
            left: -22,
            backgroundColor: '#c7ac99', 
            borderRadius: 10, 
            padding: 5
        }, 
        closeButton: {
            borderRadius: 20,
            padding: 8,
            backgroundColor: "#c7ac99", 
            top: -25, 
            left: -25, 
            marginRight: 190, 
        }, 
        modalButtonText: { 
            color: "#FFF", 
            fontWeight: "600", 
            fontSize: 17
        }, 
        illText: { 
            color: "#c7ac99",
            fontWeight: "500", 
            fontSize: 20, 
            alignSelf: 'center', 
            position: 'absolute', 
            top: 20
        }
    });  