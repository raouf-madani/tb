import React from 'react';
import { StyleSheet,View,ImageBackground,TouchableOpacity,Text,Image,KeyboardAvoidingView,Dimensions} from 'react-native';
import {MaterialIcons,MaterialCommunityIcons,Ionicons} from "@expo/vector-icons";
import {useSelector,useDispatch} from 'react-redux';
import Colors from "../../../constants/Colors";
import {HeaderButtons,Item} from "react-navigation-header-buttons";
import HeaderButton from "../../../components/HeaderButton";
import polylanar from "../../../lang/ar";
import polylanfr from "../../../lang/fr";

import * as barberActions from '../../../store/actions/barberActions';

//responsivity (Dimensions get method)
const screen = Dimensions.get('window');





const BarberSupportScreen = props =>{

    return(
    <View style={styles.container}>
       <ImageBackground source={require('../../../assets/images/support.png')} style={styles.background}>
         
       </ImageBackground>
    </View>
    
     );    
};


BarberSupportScreen.navigationOptions = navData => {
 
    
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