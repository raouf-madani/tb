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
       <ImageBackground source={{uri:'http://95.111.243.233/assets/tahfifabarber/support.png'}} style={styles.background}>
         <View style={{alignItems:'center',width:'90%'}}>
            <View style={{marginBottom:screen.width/24}}>
               <Image source={require('../../../assets/iconReBorn.png')} style={{width:screen.width/4.5,height:screen.width/4.5}} />
            </View>
            <View style={{width:'100%',marginBottom:screen.width/24}}>
              <Text style={{fontFamily:'poppins',fontSize:screen.width/27.7,color:Colors.blue,alignSelf:'center'}}>
              {barber && barber[0].lang?polylanfr.SupportMessage:polylanar.SupportMessage}
              </Text>
            </View>
           
            <View style={{flexDirection:'row',alignItems:'center',alignSelf:'center'}}>
              <TouchableOpacity  style={{marginHorizontal:screen.width/72}} onPress={instagramUrl}>
                 <MaterialCommunityIcons name="instagram" size={screen.width/11.25} color="black" />
              </TouchableOpacity>
              <TouchableOpacity style={{marginHorizontal:screen.width/72}} onPress={facebookUrl}>
                <MaterialCommunityIcons name="facebook-box" size={screen.width/11.25} color="black" /> 
              </TouchableOpacity>
              <TouchableOpacity style={{marginHorizontal:screen.width/72}} onPress={linkedinUrl}>
                <MaterialCommunityIcons name="linkedin" size={screen.width/11.25} color="black" /> 
              </TouchableOpacity> 
              <TouchableOpacity style={{marginHorizontal:screen.width/72}} onPress={callPhone}>
                 <MaterialCommunityIcons name="phone" size={screen.width/11.25} color="black" /> 
              </TouchableOpacity> 
              <TouchableOpacity style={{marginHorizontal:screen.width/72}} onPress={url}>
                 <MaterialCommunityIcons name="web-box" size={screen.width/11.25} color="black"  />
              </TouchableOpacity>
              
            </View>
         </View>
       </ImageBackground>
    </View>
    
     );    
};


BarberSupportScreen.navigationOptions = (navData) => {
 
    
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
          width:screen.width/2.4,
          height:screen.width/9,
          resizeMode:'contain',
          alignSelf: 'center'}}
        
        />
      ),
      headerTintColor: Colors.blue
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