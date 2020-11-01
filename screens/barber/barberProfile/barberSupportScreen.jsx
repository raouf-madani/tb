import React from 'react';
import { StyleSheet,View,ImageBackground,TouchableOpacity,Text,Image,Alert,Dimensions,Platform,Linking,StatusBar} from 'react-native';
import {MaterialIcons,MaterialCommunityIcons,Ionicons} from "@expo/vector-icons";
import Colors from "../../../constants/Colors";
import polylanar from "../../../lang/ar";
import polylanfr from "../../../lang/fr";
import {useSelector} from 'react-redux';

//responsivity (Dimensions get method)
const screen = Dimensions.get('window');


 


const BarberSupportScreen = props =>{

  const URL = "https://tahfifaapp.com";
  const facebookURL = "https://www.facebook.com/TahfifaApp";
  const instagramURL = "https://www.instagram.com/tahfifaapp/";
  const linkedinURL = "https://www.linkedin.com/company/tahfifa/";
  //get the barber's data
  const barber= useSelector(state=>state.barbers.barber);
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
      Alert.alert(barber && barber[0].lang?polylanfr.Oups:polylanar.Oups,barber && barber[0].lang?polylanfr.WeakInternet:polylanar.WeakInternet,[{text:barber && barber[0].lang?polylanfr.OK:polylanar.OK}]);
  } 
  });
 };

 const facebookUrl= ()=>{
  Linking.openURL(facebookURL).catch((err) => {
    if(err){
      Alert.alert(barber && barber[0].lang?polylanfr.Oups:polylanar.Oups,barber && barber[0].lang?polylanfr.WeakInternet:polylanar.WeakInternet,[{text:barber && barber[0].lang?polylanfr.OK:polylanar.OK}]);
  } 
  });
 };

 const instagramUrl= ()=>{
  Linking.openURL(instagramURL).catch((err) => {
    if(err){
      Alert.alert(barber && barber[0].lang?polylanfr.Oups:polylanar.Oups,barber && barber[0].lang?polylanfr.WeakInternet:polylanar.WeakInternet,[{text:barber && barber[0].lang?polylanfr.OK:polylanar.OK}]);
  } 
  });
 };

 const linkedinUrl= ()=>{
  Linking.openURL(linkedinURL).catch((err) => {
    if(err){
      Alert.alert(barber && barber[0].lang?polylanfr.Oups:polylanar.Oups,barber && barber[0].lang?polylanfr.WeakInternet:polylanar.WeakInternet,[{text:barber && barber[0].lang?polylanfr.OK:polylanar.OK}]);
  } 
  });
 };

    return(
    <View style={styles.container}>
      <StatusBar hidden />
       <ImageBackground source={{uri:'http://173.212.234.137/assets/tahfifabarber/support.png'}} style={styles.background}>
         <View style={{alignItems:'center',width:'90%'}}>
            <View style={{marginBottom:15}}>
               <Image source={{uri:'http://173.212.234.137/assets/tahfifabarber/icon.png'}} style={{width:80,height:80}} />
            </View>
            <View style={{width:'100%',marginBottom:15}}>
              <Text style={{fontFamily:'poppins',fontSize:13,color:Colors.blue,alignSelf:'center'}}>
              {barber && barber[0].lang?polylanfr.SupportMessage:polylanar.SupportMessage}
              </Text>
            </View>
           
            <View style={{flexDirection:'row',alignItems:'center',alignSelf:'center'}}>
              <TouchableOpacity  style={{marginHorizontal:5}} onPress={instagramUrl}>
                 <MaterialCommunityIcons name="instagram" size={32} color="black" />
              </TouchableOpacity>
              <TouchableOpacity style={{marginHorizontal:5}} onPress={facebookUrl}>
                <MaterialCommunityIcons name="facebook-box" size={32} color="black" /> 
              </TouchableOpacity>
              <TouchableOpacity style={{marginHorizontal:5}} onPress={linkedinUrl}>
                <MaterialCommunityIcons name="linkedin" size={32} color="black" /> 
              </TouchableOpacity> 
              <TouchableOpacity style={{marginHorizontal:5}} onPress={callPhone}>
                 <MaterialCommunityIcons name="phone" size={32} color="black" /> 
              </TouchableOpacity> 
              <TouchableOpacity style={{marginHorizontal:5}} onPress={url}>
                 <MaterialCommunityIcons name="web-box" size={32} color="black"  />
              </TouchableOpacity>
              
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