import React, {useState} from 'react';
import {enableScreens} from 'react-native-screens';
import BarberNavigation from './navigation/barberNavigation';
import {AppLoading} from 'expo';
import * as Font from 'expo-font';

enableScreens();

const fetchFonts = () =>{
  return Font.loadAsync({
     'poppins': require('./assets/fonts/Poppins-Regular.ttf'),
     'poppins-bold': require('./assets/fonts/Poppins-Bold.ttf')
  });
}



export default function App() {
   
   const [fontLoaded, setFontLoaded] = useState(false);

   if(!fontLoaded){
     return(
       <AppLoading 
        startAsync={fetchFonts}
        onFinish={()=> setFontLoaded(true)}
       />
     )
   }

  return (
    <BarberNavigation />
  );
}

