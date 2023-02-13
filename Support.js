import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet
} from 'react-native';
import { color } from 'react-native-reanimated';
import ViewMoreText from 'react-native-view-more-text';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function Community() {
    
    const navigation = useNavigation();

    const [shouldShow, setShouldShow] = useState(true);
    const renderViewMore = (onPress) => {
        return(
          <AntDesign.Button 
          name='down' 
          size={15}
          color='#755a57'
          backgroundColor='#f8f5f3'
          onPress={onPress}/>
        )
      };
      const renderViewLess = (onPress)=> {
        return(
            <AntDesign.Button 
            name='up' 
            size={15}
            color='#755a57'
            backgroundColor='#f8f5f3'
            onPress={onPress}/>
        )
      };

    return (
        <View style={styles.container}>
            <View>
            <Text style= {styles.header}>
                <AntDesign.Button name='leftcircleo'
                size={25}
                color='#755a57'
                backgroundColor='#fff'
                paddingTop={30}
                onPress={() => navigation.navigate('BottomTab')}/>
                Support</Text></View>
            
            <View style={styles.box}>
                <ViewMoreText
                numberOfLines={1}
                renderViewMore={renderViewMore}
                renderViewLess={renderViewLess}
                textStyle={styles.Text}>
                    <Text>
                       How to get started: {"\n"}
                        To log your meals manually, click on the manual buttom and it will guide you to a search page where to can key in your meals.
                        To use the image analysis function, simply click on the snap button and take a picture of your meal. 
                    </Text>
                </ViewMoreText>
                
            </View>
            <View style={styles.box}>
                <ViewMoreText
                numberOfLines={1}
                renderViewMore={renderViewMore}
                renderViewLess={renderViewLess}
                textStyle={styles.Text}>
                    <Text>
                        About personal information: {"\n"}
                        We assure you that we keep yyour information safe and confidential and will not share your data for other purposes. 
                        If you wish to delete your account or have any quaries regarding your account safety, feel free to reach out to us via email at fengyiye@yahoo.com.sg. 
                    </Text>
                </ViewMoreText>                
            </View>
            <View style={styles.box}>
                <ViewMoreText
                numberOfLines={1}
                renderViewMore={renderViewMore}
                renderViewLess={renderViewLess}
                textStyle={styles.Text}>
                    <Text>
                        Others: {"\n"}
                        If youi wish to report any bugs or difficulties faced while using the application please reach out to us via email at fengyiye@yahoo.com.sg. Thank You.
                    </Text>
                </ViewMoreText>                
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    Text: { 
        color: "#000000", 
        paddingTop: 10,
        paddingLeft: 10,
        fontSize: 16, 
        fontWeight: "bold"
    }, 
    container: {
        flex: 1,
        paddingTop:30,
        paddingLeft:25,
        backgroundColor: '#fff',
        paddingRight:25
      },
    header: { 
        fontSize:30,
        fontFamily:'SMARTWATCH',
        alignContent:'center',
        color:'#000000'
    },
    box: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#f8f5f3',
        width: '100%',
        paddingBottom: 5,
        borderRadius: 7,
        shadowOpacity: 15,
        elevation: 15,
        marginTop: 20,
        shadowRadius: 2,
        shadowColor: '#c7a799',
        borderColor: '#ae806b',
      },
})
