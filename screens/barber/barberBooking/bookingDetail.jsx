import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View,ActivityIndicator, Alert,ScrollView, Dimensions} from 'react-native';
import moment from 'moment';
import Colors from "../../../constants/Colors";
import BookingCard from '../../../components/BookingCard';
import { Ionicons ,MaterialIcons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import {cancelBooking} from "../../../store/actions/bookingsActions";
import { Rating, AirbnbRating } from 'react-native-elements';

const screen = Dimensions.get("window");

const BookingDetail = props =>{
const services = props.navigation.getParam("services");
const start= props.navigation.getParam("start");
const bookingDate = props.navigation.getParam("bookingDate");
const now  = moment().format().substring(11,16) ;
const diffrence = parseInt(moment.duration(moment(start,"h:mm:ss a").diff(moment(now,"h:mm:ss a"))).asMinutes());

const conditionAnnuler = ( (props.navigation.getParam("status") === "confirmée" && ((diffrence >= 30 && moment(bookingDate).format("ll") === moment().format("ll")) || moment(bookingDate).format("ll") > moment().format("ll"))) || props.navigation.getParam("status") === "en attente");

const conditionConfirmer = (props.navigation.getParam("status") === "en attente" && ((diffrence >= 30 && moment(bookingDate).format("ll") === moment().format("ll")) || moment(bookingDate).format("ll") < moment().format("ll")));

// console.log(diffrence);




//Loading State
const [isLoading , setLoading] = useState (false);

//Fetched Barber Infos
const [clientInfos , setBarberInfos] = useState({
  "address": " ",
  "name": " ",
  "phone": " ",
  "region": " ",
  "surname": " ",
  "wilaya": " ",
});

const dispatch = useDispatch();

//cancel booking

const bookingHandler = (type,alert1,alert2) =>{

//ALERT BEFORE CANCEL A BOOKING
// Works on both Android and iOS
Alert.alert(
  alert1+' la réservation ! ',
  'Etes vous sùr de vouloir '+ alert2 +' cette réservation ?',
  [
 
    {
      text: 'Non',
      onPress: () => {},
      style: 'cancel'
    },
    { text: 'Oui', onPress: async () => {
      setLoading(true);
      if(conditionConfirmer || conditionAnnuler ){
          await dispatch(cancelBooking(props.navigation.getParam("id"),type));
          props.navigation.navigate( "Barber");
          }
           else{
            props.navigation.navigate( "Barber");

           }
      setLoading(false);



    } }
  ],
  { cancelable: false },
  { onDismiss: () => {} },
  

);




//  dispatch(cancelBooking(props.navigation.getParam("cancelDate"),props.navigation.getParam("clientId")))

//  props.navigation.navigate(
//   "Client");
}



useEffect(()=>{

  const getBarber = async ()=>{
    try {
  setLoading(true);
    
      const arr = await fetch(`http://192.168.1.5:3000/bookings/${props.navigation.getParam("clientId")}`);
      const resData = await arr.json ();
      setBarberInfos(...resData);
      setLoading(false);

      }
  
  catch (error) {
      console.log("There is an Error");
  }
  

  }

  getBarber();


},[])




if (isLoading) {
  return (
    <View style= {styles.centered}>
      <ActivityIndicator size="large" color= {Colors.primary} />
    
    </View>
  );
}

  return(
    <ScrollView style = {styles.container}>

    <BookingCard
                             start = {start}
                            end = {props.navigation.getParam("end")}
                            bookingDate = {bookingDate}
                            status = {props.navigation.getParam("state")}
                            amount = {props.navigation.getParam("amount")}
                            day = {props.navigation.getParam("day")}
                            date = {props.navigation.getParam("date")}
                            status = {props.navigation.getParam("status")}
                            detail = {false}
    
     />
            <View style = {styles.actions}>



            <View style = {{alignItems : "center"}}>
            
               <MaterialIcons name="call" 
                            size={28} 
                            color={Colors.colorH1} 

                    />
            <Text style = {styles.actionsText} >Appeler</Text>

          </View>


        { conditionAnnuler &&
          <View style = {{alignItems : "center"}} >
          
          <Ionicons name="ios-close-circle-outline" 
                      size={28} 
                      color= "#F9627D"
                      onPress = {()=>bookingHandler("annulée","Annuler","annuler")}
               /> 
  
            <Text style = {styles.actionsText}>Annuler</Text>

          </View>}


        {conditionConfirmer && 
                  <View style = {{alignItems : "center"}}>
                    
                  <Ionicons 
                  name="ios-checkbox-outline" 
                  size={28} 
                  color={Colors.colorH1} 
                  onPress = {()=>bookingHandler("confirmée","Confirmer","confirmer")}
                  />

                <Text style = {styles.actionsText} >Confirmer</Text>

              </View>
        }
       
            </View>

            <View style = {styles.barber}>
            <Text style = {styles.barberTitle}>Information Du Client </Text>
                <Text style = {styles.barberText}>Nom : {clientInfos.surname +" "+clientInfos.name}</Text>
                <Text style = {styles.barberText} >Wilaya : {clientInfos.region+"-"+clientInfos.wilaya}</Text>
                <Text style = {styles.barberText} >Adresse : {clientInfos.address}</Text>
                <Text style = {styles.barberText} >Tel : {clientInfos.phone}</Text>
            </View>

            <View style = {styles.services}>
                <ScrollView>
                <Text style = {styles.servicesTitle}>Services </Text>
             
          {      
            services.map((service,index) => {

                return(   
               
               
                    <Text key = {index} style={styles.serviceText}>
                    {service.name +" / "+ 
                    service.serviceDuration +" Min / "+ 
                    service.price + " DA "
                    }
                    </Text>
                   
                    )


            })
         
         }
                </ScrollView>

            </View>


         

            </ScrollView>

   );   
};


BookingDetail.navigationOptions = (navData) => {
    return {
      headerTintColor:Colors.primary,
      headerBackTitle : " ",
      title : "Détail de la réservation"
    }
    
    };

const styles= StyleSheet.create({
container : {
  flex : 1 
},
actions : {
 width :"90%",
 height : screen.height * 0.1 ,
 alignSelf : "center",
borderRadius : 15,
flexDirection : "row",
alignItems : "center",
justifyContent : "space-around",
backgroundColor : "#fff"

},
barber : {
width : "90%",
backgroundColor  : "#fff" ,
alignSelf : "center" ,
borderRadius : 15,
marginVertical : "2%",
height : screen.height * 0.3 ,
justifyContent : "space-around"

},
services : {
  height : screen.height * 0.3 ,
    backgroundColor : "#fff",
    borderRadius :  15,
    width : "90%",
    alignSelf : "center",
},


//TExt Styling //
actionsText : {
    fontFamily : "poppins"
},
barberText : {
    fontFamily : "poppins",
    marginLeft : 5

},
barberTitle : {
    alignSelf : "center",
    fontFamily : "poppins-bold",
    color : Colors.primary
},
serviceText :{
    fontFamily : "poppins",
    marginLeft : 5,
    marginBottom : 5

},
servicesTitle : {
    alignSelf : "center",
    fontFamily : "poppins-bold",
    marginBottom : 10 ,
    color : Colors.primary

},
//////////////////////////////////////////////////////
centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});


export default BookingDetail;