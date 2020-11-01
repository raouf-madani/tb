import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View,ActivityIndicator, Alert,ScrollView, Dimensions} from 'react-native';
import moment from 'moment';
import Colors from "../../../constants/Colors";
import BookingCard from '../../../components/BookingCard';
import { Ionicons ,MaterialIcons } from '@expo/vector-icons';
import { useDispatch,useSelector } from 'react-redux';
import {changeBookingState} from "../../../store/actions/bookingsActions";
import { Rating, AirbnbRating, Avatar } from 'react-native-elements';
import polylanar from "../../../lang/ar";
import polylanfr from "../../../lang/fr";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';


const screen = Dimensions.get("window");

const BookingDetail = props =>{
const services = props.navigation.getParam("services");
const start= props.navigation.getParam("start");
const bookingDate = props.navigation.getParam("bookingDate");
const now  = moment().format().substring(11,16) ;
const diffrence = parseInt(moment.duration(moment(start,"h:mm:ss a").diff(moment(now,"h:mm:ss a"))).asMinutes());

const gradient1 = props.navigation.getParam("status") === "en attente" ? "#fd6d57" : (props.navigation.getParam("status") === "confirmée" ||props.navigation.getParam("status") === "réalisée" ) ? "#11998e" : "#f14638";
const gradient2 = props.navigation.getParam("status") === "en attente" ? "#fd9054" : (props.navigation.getParam("status") === "confirmée" ||props.navigation.getParam("status") === "réalisée" ) ? Colors.colorH1 : "#F4686A";

const conditionAnnuler = ( (props.navigation.getParam("status") === "confirmée" && ((diffrence >= 30 && moment().isSame(bookingDate, 'day')) || moment().isBefore(bookingDate, 'day'))) || props.navigation.getParam("status") === "en attente");

const conditionConfirmer = (props.navigation.getParam("status") === "en attente" && ((diffrence >= 30 && moment().isSame(bookingDate, 'day')) || moment().isBefore(bookingDate, 'day')));


const conditionCall = props.navigation.getParam("status") === "confirmée";

const barber=useSelector(state=>state.barbers.barber[0]);

// console.log(diffrence);

/******************SEND A NOTIFICATION TO THE client WHEN A BOOKING IS Canceled ************************/
async function sendPushNotification(type,alert1,alert2) {
  // "annulée","Annuler","annuler
  const arr = await fetch(`http://173.212.234.137:3000/client/clienttokens/${props.navigation.getParam("clientId")}`);
  const resData = await arr.json ();
  const allMessages = [];
  
  
  resData.map(e=>{
    // start = {start}
    //                         end = {props.navigation.getParam("end")}
    //                         bookingDate = {bookingDate}
    //                         status = {props.navigation.getParam("state")}
    //                         amount = {props.navigation.getParam("amount")}
    //                         day = {props.navigation.getParam("day")}
    //                         date = {props.navigation.getParam("date")}
    //                         status = {props.navigation.getParam("status")}
  allMessages.push(
    {
      to: e.expoToken,
      sound: 'default',
      title: 'Réservation '+type,
      body: 'Un Coiffeur a '+alert2+' votre réservation !',
      data: {
      id :  props.navigation.getParam("id"),
      title: 'Réservation '+type,
      body: 'Cette réservation a été  '+type+'!',
      start : start,
      end : props.navigation.getParam("end"),
      bookingDate : bookingDate,
      address : props.navigation.getParam("address"),
      type :type,
      sender : "barber",
      name : barber.name ,
      surname : barber.surname
    },
    }
  
  )
  
  })

console.log(allMessages);
  allMessages.map(async (message)=>{
     await fetch('https://exp.host/--/api/v2/push/send', {
       method: 'POST',
       headers: {
         Accept: 'application/json',
         'Accept-encoding': 'gzip, deflate',
         'Content-Type': 'application/json',
       },
       body: JSON.stringify(message),
     });
   
   
   })
     
   }
  
  /******************SEND A NOTIFICATION TO THE BARBER WHEN A BOOKING IS MADE ************************/


//Loading State
const [isLoading , setLoading] = useState (false);

//Fetched Barber Infos
const [clientInfos , setClientInfos] = useState({
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
      text: barber && barber.lang?polylanfr.No:polylanar.No,
      onPress: () => {},
      style: 'cancel'
    },
    { text: barber && barber.lang?polylanfr.Yes:polylanar.Yes, onPress: async () => {

      try {
        setLoading(true);
        if(conditionConfirmer || conditionAnnuler ){
                       
            await dispatch(changeBookingState(props.navigation.getParam("id"),type));
            await sendPushNotification(type,alert1,alert2);
     
            props.navigation.navigate( "Barber");
            }      
            setLoading(false);  
      } catch (error) {
        setLoading(true);
                  Alert.alert(
                    "Réservation non "+type,
                    "Echec de l'action ",
                    [
                      { text: barber && barber.lang?polylanfr.OK:polylanar.OK, onPress: () =>{} }
                    ],
                    { cancelable: false }
                  );
          setLoading(false);
                  throw error;
      }
    
         



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
    

      const arr = await fetch(`http://173.212.234.137:3000/client/clientinfos/${props.navigation.getParam("clientId")}`);

      const resData = await arr.json ();
      setClientInfos(...resData);
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
{/* <View style ={{justifyContent:"center",marginVertical : "5%"}}>
<Text style = {styles.barberTitle}>Ma Réservation </Text>
</View> */}
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
                            press = {false}
    
     />
    {props.navigation.getParam("status") !== "expirée" &&  props.navigation.getParam("status") !== "réalisée" && props.navigation.getParam("status") !== "annulée" &&
            <View style = {styles.actions}>

            {
            conditionCall && 
            <TouchableOpacity style = {{alignItems : "center"}}>
            
            <MaterialIcons name="call" 
                            size={28} 
                            color={Colors.colorH1} 

                    />
            <Text style = {styles.actionsText} >Appeler</Text>

          </TouchableOpacity>
}

        { conditionAnnuler &&
          <TouchableOpacity style = {{alignItems : "center"}} onPress = {()=>bookingHandler("annulée","Annuler","annuler")} >
          
          <Ionicons name="ios-close-circle-outline" 
                      size={28} 
                      color= "#F9627D"
                      onPress = {()=>bookingHandler("annulée","Annuler","annuler")}
               /> 
  
            <Text style = {styles.actionsText}>{barber && barber.lang?polylanfr.Cancel:polylanar.Cancel}</Text>

          </TouchableOpacity>}


        {conditionConfirmer && 
                  <TouchableOpacity style = {{alignItems : "center"}} onPress = {()=>bookingHandler("confirmée","Confirmer","confirmer")} >
                    
                  <Ionicons 
                  name="ios-checkbox-outline" 
                  size={28} 
                  color={Colors.colorH1} 
                  onPress = {()=>bookingHandler("confirmée","Confirmer","confirmer")}
                  />

                <Text style = {styles.actionsText} >{barber && barber.lang?polylanfr.Confirm:polylanar.Confirm}</Text>

              </TouchableOpacity>
        }
       
            </View>
          } 
            <View style = {styles.barber}>

<View style={styles.title}>
    <Text style={{fontFamily : "poppins-bold",color :Colors.blue,fontSize : screen.width /24}}>Détail de la réservation
    </Text>
    </View>


    <View style ={{height : "40%",width:"100%"}}>
<ScrollView>
{      
      services.map((service,index) => {

          return(   
         
         <View key = {index} style = {{alignSelf :"center" , flexDirection :"row",justifyContent :"space-between",width:"90%",height:screen.height*0.08}}>
       
        
              <Text  style={styles.serviceText}>
              {service.name +"  "}
              </Text>
            
              <Text  style={styles.serviceText}>
              {service.price + " DA " }
              </Text>
              
              </View>
              )


      })
   
   } 

</ScrollView>

</View>



<LinearGradient colors = { [gradient1, gradient2]} style ={{height:"20%",justifyContent:"center"}}> 
<View style ={{flexDirection :"row",width:"90%",justifyContent :"space-between",alignSelf:"center"}}>
<View>
<Text  style = {styles.priceText}  >Prix Total:</Text>
<Text style = {styles.timeText} >{props.navigation.getParam("duration")+" Min"}</Text>

</View>
<Text style = {styles.priceText} >{props.navigation.getParam("amount")+" DA"}</Text>


</View>



</LinearGradient>




                <View style = {{height : "30%",alignItems:"center",paddingTop : "2%"}}>
                <View style = {{width : "90%",marginBottom : "5%",}}>
                <Text style = {{color : Colors.textGrey,fontFamily : "poppins-bold",fontSize : screen.width /26}}>Client</Text>
                </View>
                <View style = {{alignSelf :"center" , flexDirection :"row",width:"90%",alignItems:"center"}}>
              
                <Avatar
          source = {require("../../../assets/images/avatarman.jpg")}
          overlayContainerStyle = {{overflow:"hidden"}}
          size = "small"
          rounded
          
           />
           <View style = {{marginLeft : "10%"}}>
                <Text  style={styles.serviceText}>
                {clientInfos.surname + " "+clientInfos.name}
                </Text>
                </View>
                </View>

                </View>

</View>


</ScrollView>


          
         


   );   
};


BookingDetail.navigationOptions = (navData) => {
  return {
    headerTintColor:Colors.primary,
    headerBackTitle : " ",
    title : "Ma Réservation"
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
backgroundColor : "#fff",
paddingTop : "1%"
},
barber : {
width : "90%",
backgroundColor  : "#fff" ,
alignSelf : "center" ,
borderRadius : 15,
marginVertical : "2%",
height : screen.height * 0.6 ,
// justifyContent : "space-between"

},
services : {
  height : screen.height * 0.3 ,
    backgroundColor : "#fff",
    borderRadius :  15,
    width : "90%",
    alignSelf : "center",
},
title : {
  alignSelf : "center",
  paddingVertical :"3%",
},


//TExt Styling //
actionsText : {
    fontFamily : "poppins",
    fontSize : screen.width /30,
    color : Colors.blue
},
barberText : {
    fontFamily : "poppins",
    marginLeft : 5,
    fontSize : screen.width /28

},
barberTitle : {
    alignSelf : "center",
    fontFamily : "poppins-bold",
    color : Colors.Blue,
    fontSize : screen.width /26
},
serviceText :{
    fontFamily : "poppins",
   
    fontSize : screen.width /28

},
servicesTitle : {
    alignSelf : "center",
    fontFamily : "poppins-bold",
    marginBottom : 10 ,
    color : Colors.primary,
    fontSize : screen.width /28

},
priceText:{
  fontFamily : "poppins-bold",
  fontSize : screen.width / 20,
  color:"#fff",
 

},
timeText:{
  fontFamily : "poppins-bold",
  fontSize : screen.width / 30,
  color: "#fff",


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


export default BookingDetail;