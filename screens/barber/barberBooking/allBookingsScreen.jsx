import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View,ActivityIndicator, Dimensions, ScrollView,ImageBackground } from 'react-native';

import { Avatar ,Badge } from 'react-native-elements';
import Colors from "../../../constants/Colors";
import {Button } from 'react-native-elements';
import {Calendar, CalendarList, Agenda,LocaleConfig} from 'react-native-calendars';
import BookingCard from '../../../components/BookingCard';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { getClientBookings, expiredbookings, getBarberBookings } from '../../../store/actions/bookingsActions';
import 'moment/locale/fr' ;

const screen = Dimensions.get("window");
moment.locale('fr')

LocaleConfig.locales['fr'] = {
    monthNames: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
    monthNamesShort: ['Janv.','Févr.','Mars','Avril','Mai','Juin','Juil.','Août','Sept.','Oct.','Nov.','Déc.'],
    dayNames: ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
    dayNamesShort: ['Dim.','Lun.','Mar.','Mer.','Jeu.','Ven.','Sam.'],
    today: 'Aujourd\'hui'
  };
  LocaleConfig.defaultLocale = 'fr';
  ///////////////////////////////////////////////////////////////////////
const AllBookingsScreen = (props) => {

  const allBookings = useSelector(state => state.bookings.bookings);
  //get Client ID
  const barberID= props.navigation.getParam('barberID');  
  
//Selected Date State
const [selectedDate , setSelectedDate] = useState(moment(moment().format("YYYY-MM-DD")).format());
  
  //Selected Date French Text 
  const [selectedDateText , setSelectedDateText] = useState(moment().format('LL'));
  
  const [dayBookings , setDayBookings] = useState([]);
  
  //calendar selected Date object
   const [selectedDay , setSelectedDay] = useState(moment().format('ddd')) ;
  
   const [isLoading , setLoading] = useState(true);
  
  const dispatch = useDispatch();
  
  const days = allBookings.map(e=>e.bookingDate);
  let mark = {};
  days.forEach(day => {

    if ( moment().isSame(day,"day") || moment().isBefore(day,"day")) {
  
       mark[day] = { 
           selected: true, 
           marked: true , 
           selectedColor: Colors.colorF5,
           textColor: Colors.primary,
           color : Colors.colorH1 ,
       };
     }
   
   //  }else if (moment().format("ll") === moment(day).format("ll")){
   
   
   //  }
    
    else {
       mark[day] = { 
           selected: true, 
           marked: false , 
           selectedColor:"#F4686A",
           text: {
               color: 'black',
               fontWeight: 'bold'
             }
       };
   
    }
    
   
   });

   mark[selectedDate.substring(0,10)] = { 
    selected: true, 
    marked: false , 
    selectedColor:Colors.blue,
    text: {
        color: 'black',
        fontWeight: 'bold'
      }
  };
  
  /**************************************************************************************** **************************************************************************************** */
  //TODAYS BOOKINGs
/**************************************************************************************** */
//TODAYS BOOKINGs


useEffect(()=>{
 
  const todaysBookings= async ()=>{
      setLoading(true);
      const dayBooks = await allBookings.filter(bookings => moment(bookings.bookingDate).isSame(selectedDate,"day"));
      await setDayBookings([...dayBooks]);
      setLoading(false);
  }

  // if((selectedDateText ===moment (new Date()).format("ll")  ))
  todaysBookings();
  
},[])
  


  /***************************************************************************************************************************************************************************** */
  
  /*************************************************************** */
  // //Cancel EXPIRED BOOKINGS
  const expired = useCallback(async ()=>{
  
    try{
  
        setLoading(true);
        await dispatch(expiredbookings(barberID,props.navigation.getParam("tokens")));
        await dispatch(getBarberBookings(barberID));
       setLoading(false);
  
      }catch(err){
          console.log(err);
        throw err ;
      }
  
  
  },[dispatch,allBookings]);
  
  
  useEffect(()=>{
    expired();
  },[])
  
  
  useEffect(()=>{
  const willFocusSub= props.navigation.addListener(
    'willFocus',
    () => {
  
      expired();
     
    }
  );
  return ()=>{
    willFocusSub.remove();
  };
  },[expired]);
  
  
  
  /**************************************************************************************** */


const selectedDateHandler = (date) => {
// console.log(allBookings[days.indexOf(date.dateString)])
const dayBooks = allBookings.filter(bookings => bookings.bookingDate === date.dateString );

setSelectedDateText(moment(date.dateString).format('LL'));
setDayBookings ([...dayBooks]);

setSelectedDay(moment(date.dateString).format('ddd'));


setSelectedDate(moment(date.dateString).format());
 

};



//IF IS LOADING
if (isLoading) {
    return (
      <ImageBackground style= {styles.centered} source={require('../../../assets/images/support.png')}>
        <ActivityIndicator size="large" color= {Colors.primary} />

      </ImageBackground>
    );
}



    return(
        <View style = {styles.container}>

      

        <View style={{}}  >

            <Calendar
            style = {{borderBottomLeftRadius : 25,borderBottomRightRadius : 25,overflow : "hidden",paddingVertical : "2%" , marginBottom : 15}}
           theme={{
            // selectedDayTextColor: Colors.primary,

            calendarBackground: "#fff",
            textSectionTitleColor: Colors.blue,
            textSectionTitleDisabledColor: Colors.blue,
            todayTextColor: '#2d4150',
            dayTextColor: Colors.blue,
            textDisabledColor: '#d9d9d9',
            dotColor: Colors.blue,
            selectedDotColor: Colors.primary,
            arrowColor: Colors.blue,
            disabledArrowColor: '#d9e1e8',
            monthTextColor: Colors.blue,
            indicatorColor: Colors.primary,
            textDayFontFamily: 'poppins',
            textMonthFontFamily: 'poppins-bold',
            textDayHeaderFontFamily: 'poppins',
           
            
            
            }}
            current = {selectedDate}
             markedDates = {mark}
             onDayPress={(date)=>selectedDateHandler(date)}
             />

        </View>
            <View style = {{width  : "90%",alignSelf : "center"}}>
            <Text style = {{fontSize : screen.width/24 , fontFamily : "poppins-bold",color:Colors.blue}}>{selectedDateText}</Text>

            </View>
                <ScrollView  style = {styles.cardsContainer}>

                {

                  dayBookings.map((booking , index)=>{
                  
                        return(
                        <BookingCard
                            key = {index}
                            start = {booking.start}
                            end = {booking.end}
                            bookingDate = {booking.bookingDate}
                            status = {booking.status}
                            amount = {booking.amount}
                            day = {selectedDay}
                            date = {moment(booking.bookingDate).date()}
                            navigation = {props.navigation}
                            services = {booking.services}
                            detail= {true}
                            barberId = {booking.barberId}
                            clientId = {booking.clientId}
                            cancelDate = {booking.date}
                            id = {booking.id}
                            press = {true}
                            address = {booking.address}
                            duration = {booking.bookingDuration}
                         /> 

                    )})
                    
                 

                }
                     
                
                       
                       


                </ScrollView>

    </View>


    )


};

AllBookingsScreen.navigationOptions= () => {
    
  return {
   title:'Mes Réservations',
  
   headerBackTitle : " ",
   headerTintColor: Colors.primary,
   headerTitleStyle:{
     fontFamily:'poppins-bold',
     marginTop:5,
   },
   
  
  };

};

const styles= StyleSheet.create({
    container : {
      flex : 1 , 
      backgroundColor : "#F5f0EB",
      overflow : "hidden",

    },
    cardsContainer: { 
             width : "100%",  
 
         
   },
   //////////////////////////////////////////////////////
   centered: {
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    width:'100%',
    height:'100%',
    resizeMode:'cover'
     }
   
  });


export default AllBookingsScreen;
