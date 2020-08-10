import React from 'react';
import { StyleSheet,View,ImageBackground,TouchableOpacity,Text,Image,Alert,Dimensions,Platform,Linking} from 'react-native';
import {MaterialIcons,MaterialCommunityIcons,Ionicons} from "@expo/vector-icons";
import {useSelector,useDispatch} from 'react-redux';
import Colors from "../../../constants/Colors";
import {HeaderButtons,Item} from "react-navigation-header-buttons";
import HeaderButton from "../../../components/HeaderButton";
import polylanar from "../../../lang/ar";
import polylanfr from "../../../lang/fr";


//responsivity (Dimensions get method)
const screen = Dimensions.get('window');


 


const BarberSupportScreen = props =>{

  const URL = "https://google.com";

  const callPhone = ()=>{
  
    let phoneNumber = '';

    if (Platform.OS === 'android') {
      phoneNumber = 'tel:${0658341876}';
    } else {
      phoneNumber = 'telprompt:${0658341876}';
    }

    Linking.openURL(phoneNumber);
 
 };

 const url= ()=>{
  Linking.openURL(URL).catch((err) => {
    if(err){
      Alert.alert('Oups!','Une erreur est survenue',[{text:'OK'}]);
  } 
  });
 }

    return(
    <View style={styles.container}>
       <ImageBackground source={require('../../../assets/images/support.png')} style={styles.background}>
         <View style={{alignItems:'center',width:'90%'}}>
            <View style={{marginBottom:15}}>
               <Image source={require('../../../assets/images/icon.png')} style={{width:80,height:80}} />
            </View>
            <View style={{width:'100%',marginBottom:15}}>
              <Text style={{fontFamily:'poppins',fontSize:13,color:Colors.blue,alignSelf:'center'}}>
                Si un problème persiste, n'hésitez pas à nous contacter au plus vite via les informations suivantes:
              </Text>
            </View>
            <View style={{width:'100%',marginBottom:10}}>
              <Text style={{fontFamily:'poppins',fontSize:13,color:Colors.blue,marginVertical:2}}>1- Appelez-nous en appuyant sur <Text style={{color:Colors.secondary}} onPress={callPhone}>0658341876</Text></Text>
              <Text style={{fontFamily:'poppins',fontSize:13,color:Colors.blue,marginVertical:2}}>2- Page contact, <Text style={{color:Colors.colorH1}} onPress={url}>tahfifa.com/contact</Text></Text>
            </View>
            <View style={{flexDirection:'row',alignItems:'center',alignSelf:'flex-start'}}>
              <View  style={{marginHorizontal:5}}>
                 <MaterialCommunityIcons name="instagram" size={32} color="black" />
              </View>
              <View style={{marginHorizontal:5}}>
              <MaterialCommunityIcons name="facebook-box" size={32} color="black" /> 
              </View>
              <View style={{marginHorizontal:5}}>
              <MaterialCommunityIcons name="snapchat" size={32} color="black" /> 
              </View> 
              <View style={{marginHorizontal:5}}>
              <Image source={require('../../../assets/images/tiktok.png')} style={{width:25,height:25}} /> 
              </View> 
              
            </View>
         </View>
       </ImageBackground>
    </View>
    
     );    
};


BarberSupportScreen.navigationOptions = () => {
 
    
    return {
      headerTransparent : true ,
      headerStyle:{
          backgroundColor: 'white'
      },
      headerBackTitle : " ",
      headerTitle: () => (
        <Image 
        resizeMode="cover"
        style={{
          width:150,
          height:40,
          resizeMode:'contain',
          alignSelf: 'center'}}
        
        />
      ),
      headerTintColor: Colors.primary,
        };
};


const styles= StyleSheet.create({
   container:{
    flex:1,
    backgroundColor:'white',
    width:'100%',
    alignItems:'center',
    justifyContent:'center',
    height:'100%'
   },
   background:{
    width:'100%',
    alignItems:'center',
    justifyContent:'center',
    height:'100%',
    resizeMode:'cover'
},
});

export default BarberSupportScreen;