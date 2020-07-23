import React, { useState } from 'react';
import { StyleSheet,View,Text,TouchableHighlight,Image,Alert,ScrollView,Dimensions} from 'react-native';
import {HeaderButtons,Item} from "react-navigation-header-buttons";
import {Calendar,LocaleConfig} from 'react-native-calendars';
import HeaderButton from "../../../components/HeaderButton";


LocaleConfig.locales['fr'] = {
    monthNames: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
    monthNamesShort: ['Janv.','Févr.','Mars','Avril','Mai','Juin','Juil.','Août','Sept.','Oct.','Nov.','Déc.'],
    dayNames: ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
    dayNamesShort: ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'],
    today: 'Aujourd\'hui'
  };
LocaleConfig.defaultLocale = 'fr';

//responsivity (Dimensions get method)
const screen = Dimensions.get('window');

const BarberBookingsScreen = props =>{


      
    return(
      <ScrollView style={{backgroundColor:'white'}}>
   
    
    </ScrollView>  
     );    
};


BarberBookingsScreen.navigationOptions= navData => {
   
    return {
        headerRight : ()=>  (
            <View style={styles.iconContainer}>
              <TouchableHighlight
                style = {styles.bookingsNotifications}
                underlayColor = 'red'
              >
                 <Text style={{color:'rgb(254,178,199)'}}>1</Text>
              </TouchableHighlight>
              <HeaderButtons HeaderButtonComponent = {HeaderButton}> 
                <Item title = "calendar" 
                  iconName = {Platform.OS === 'android' ? 'md-calendar' : 'ios-calendar'}  
                  style={{marginHorizontal:-10}}
                  color= {Platform.OS === 'android' ? 'white' : '#87d4f2'}
                  onPress = { () => Alert.alert('Important','Vous avez 1 réservation(s). Cliquez sur chaque ligne dans le tableau pour voir les détails de chaque réservation.',[{text:"D'accord"}]) }
                />
              </HeaderButtons>  
            </View>
            ),
            headerTitle:'Mes Réservations',
            headerTitleStyle:{
              fontFamily:'poppins',
              color:Platform.OS === 'android' ? 'white' : '#87d4f2'
            },
            headerStyle:{
                backgroundColor:Platform.OS === 'android' ? '#87d4f2' : 'white'
            },
            headerBackTitle:" ",
            headerTintColor:Platform.OS === 'android' ? 'white' : '#87d4f2'
    
    };

 };

const styles= StyleSheet.create({
container:{
    flex:1,
    backgroundColor:'white',
    justifyContent:'center',
    width:'100%',
    alignItems:'center'
},

});

export default BarberBookingsScreen;