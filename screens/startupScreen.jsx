import React,{useEffect} from 'react';
import { StyleSheet, View, ImageBackground, ActivityIndicator,AsyncStorage,StatusBar} from 'react-native';
import Colors from '../constants/Colors';
import * as authActions from '../store/actions/authActions';
import {useDispatch} from 'react-redux';


const StartupScreen = props =>{

    const dispatch = useDispatch();
    useEffect(()=>{
       const tryLogin=async()=>{
           const userData= await AsyncStorage.getItem('userData');
          
           if(!userData){
               props.navigation.navigate('Auth');
               return;
           }
           
           const transformedData = JSON.parse(userData); // transform string to Javascript Object or Array
           const {token,userID,expiryDate,gender,id} = transformedData;
           const expirationDate = new Date(expiryDate);
           //AsyncStorage.clear();
           
           if(!token || !userID || !id || expirationDate <= new Date()){
            props.navigation.navigate('Auth');
            return;
           }

           const expirationTime = expirationDate.getTime() - new Date().getTime();
            
            props.navigation.navigate('Barber',{barberID:id,barberUID:userID});
            dispatch(authActions.authenticate(token,userID,expirationTime));
       }
       tryLogin();
    },[dispatch]);

    return(
      <View style = {styles.container}>
        <StatusBar hidden />
        <ImageBackground 
        source={require('../assets/images/splash.png')} 
        style={styles.bigBackgroundImage}
        >
            
            <View style={styles.overlayBackground}>
                <ActivityIndicator size='large' color={Colors.primary} />
            
            </View>
         </ImageBackground>

      </View>

     );    
};



const styles= StyleSheet.create({
container : {
    flex : 1 ,
    width:'100%',
    height:'100%'
},
bigBackgroundImage:{
flex:1,
resizeMode:'cover',
width:'100%',
height:'100%'
}, 
overlayBackground:{
backgroundColor:"rgba(0, 0, 0, 0.1)", 
flex:1,
justifyContent:'center',
alignItems:'center',
width:'100%',
height:'100%'
}

});

export default StartupScreen;