import React from 'react';
import { StyleSheet,View,AsyncStorage,ScrollView,ImageBackground,TouchableOpacity,Text,Image,Alert,KeyboardAvoidingView,Dimensions,ActionSheetIOS,Picker,ActivityIndicator} from 'react-native';
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
    justifyContent:'center'
   },
   row:{
    width:'90%',
    flexDirection:'row',
    justifyContent:'space-around',
    alignSelf:'center',
    marginVertical:10
},
});

export default BarberSupportScreen;