import React, { useState } from 'react';
import { StyleSheet, Text, View, Dimensions} from 'react-native';

import Colors from '../constants/Colors';
import {Ionicons} from "@expo/vector-icons";
import {Calendar, CalendarList, Agenda,LocaleConfig} from 'react-native-calendars';
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {useSelector } from 'react-redux';
import polylanar from "../lang/ar";
import polylanfr from "../lang/fr";
import moment from "moment";

const screen = Dimensions.get("window");

moment.locale("fr");  
LocaleConfig.locales['fr'] = {
    monthNames: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
    monthNamesShort: ['Janv.','Févr.','Mars','Avril','Mai','Juin','Juil.','Août','Sept.','Oct.','Nov.','Déc.'],
    dayNames: ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
    dayNamesShort: ['Dim.','Lun.','Mar.','Mer.','Jeu.','Ven.','Sam.'],
    today: 'Aujourd\'hui'
  };
  LocaleConfig.defaultLocale = 'fr';


const BookingCard = props =>{
  const gradient1 = props.status === "en attente" ? "#fd6d57" : (props.status === "confirmée" ||props.status === "réalisée" ) ? "#11998e" : "#f14638";
  const gradient2 = props.status === "en attente" ? "#fd9054" : (props.status === "confirmée" ||props.status === "réalisée" ) ? Colors.colorH1 : "#F4686A";


  const barber=useSelector(state=>state.barbers.barber[0]);

    return(
      <TouchableOpacity style = {styles.card}  onPress = {()=> props.press === true && props.navigation.navigate("BookingDetail", 
      { 
                day: props.day,
                  date : props.date,
                  status : props.status,
                  start : props.start,
                  end : props.end,
                  amount : props.amount,
                  services : props.services,
                  barberId : props.barberId,
                  clientId : props.clientId,
                  cancelDate : props.cancelDate,
                  id  : props.id,
                  bookingDate :props.bookingDate,
                  address : props.address,
                  duration : props.duration
                 })}  >
        <LinearGradient colors = { [gradient1, gradient2]} style = {styles.leftDate}>
              <Text style = {styles.dateText}>{props.day}</Text>
              <Text style = {styles.dateText} >{props.date}</Text>
          </LinearGradient>
          <View style = {styles.infos}>

             <Text style = {styles.status}>{barber && barber.lang?polylanfr.Status+': ':polylanar.Status+': '}
              <Text style = {{...styles.statusType,...{color : gradient2}}}> {props.status}</Text>
               </Text>
              <Text style = {styles.slotText} >{barber && barber.lang?polylanfr.Times+': ':polylanar.Times+': '} {props.start} - {props.end} </Text>
         
           

              <Text style = {{...styles.priceText ,...{color : gradient2,  textDecorationLine: props.status ==="expirée" ? 'line-through' : "none" ,
              }
              }}>
              {barber && barber.lang?polylanfr.Price+': ':polylanar.Price+': '} {props.amount} دج
              </Text>
              {/* <Text style = {styles.slotText}>Fin : </Text> */}
              
           

          </View>

         
{/* 
          <View style = {styles.amount}>
          
          <Text style = {styles.priceText}>{props.amount}</Text>
          <Text style = {styles.priceText}>DA </Text>
              
     
          </View> */}

         { 
           props.detail === true ?
       
           <TouchableOpacity 
           style = {styles.detailButton}
           onPress = {()=>props.navigation.navigate("BookingDetail", 
          { 
                    day: props.day,
                      date : props.date,
                      status : props.status,
                      start : props.start,
                      end : props.end,
                      amount : props.amount,
                      services : props.services,
                      barberId : props.barberId,
                      clientId : props.clientId,
                      cancelDate : props.cancelDate,
                      id  : props.id,
                      bookingDate :props.bookingDate ,
                      address : props.address,
                      duration : props.duration
                     })} 
           >
          
          <Ionicons name="ios-arrow-forward" 
          size={screen.width/16.36} 
          color="#252525" 
          onPress = {()=>props.navigation.navigate("BookingDetail", 
          { 
                    day: props.day,
                      date : props.date,
                      status : props.status,
                      start : props.start,
                      end : props.end,
                      amount : props.amount,
                      services : props.services,
                      barberId : props.barberId,
                      clientId : props.clientId,
                      cancelDate : props.cancelDate,
                      id  : props.id,
                      bookingDate :props.bookingDate
                     })} />
                     </TouchableOpacity>
          


          : 


          <View style = {styles.detailButton2}>
         

          </View>
}

      </TouchableOpacity>
     );    
};


const styles= StyleSheet.create({

  card : {
    width : "90%",
    height : screen.height * 0.15,
    alignSelf : "center",
    borderRadius : screen.width/36,
    marginVertical : "2.5%",
    overflow : "hidden",
    flexDirection : "row",
    alignItems : "center",
    justifyContent : "space-between",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation : 2,
    backgroundColor : "#fff",
    
},
leftDate : {
      height : "90%",
      width : "15%",
      justifyContent : "space-around",
      alignItems : "center",
      borderRadius : screen.width/36,
      marginLeft : screen.width/72

},

infos : {
 
  justifyContent : "space-between",
  alignItems : "flex-start",
  height : "80%"
},
// infos :{
//     width : "30%" , 
//     borderTopRightRadius : 10,
//     borderBottomRightRadius : 10,
//     alignItems : "center",
// },
amount :{
  width : "10%" , 
  borderTopRightRadius : screen.width/36,
  borderBottomRightRadius : screen.width/36,
  alignItems : "center",


},
detailButton : {
// width : "10%",
height : "100%",
borderLeftWidth : 0.5,
justifyContent : "center",
alignItems : "center",

width : screen.width * 0.1
},

detailButton2 : {
  width : "10%",
  height : "100%",


  alignItems : "center",
  
  
  },
//TEXT STYLING //
dateText :{
  color : "#fff",
  fontFamily : "poppins-bold",
  fontSize : screen.width/28
},
priceText : {
  fontFamily : "poppins-bold",
  color :Colors.primary,
  fontSize : screen.width/28
},
slotText : {
fontFamily : "poppins",
color:"#252525",
fontSize : screen.width/28
},
servicesText : {
  fontFamily : "poppins",
  color:"#252525",
  fontSize : screen.width/28
},
status :{
    
fontFamily : "poppins",
color:"#252525",
fontSize : screen.width/28
 
},
statusType : {
  // color : Colors.primary,
  fontFamily : "poppins-bold",
  fontSize : screen.width/28
}

});

export default BookingCard;