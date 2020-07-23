import React,{useEffect} from 'react';
import { StyleSheet,View,Linking,Dimensions,Image,TouchableOpacity,Text} from 'react-native';
import {HeaderButtons,Item} from "react-navigation-header-buttons";
import HeaderButton from "../../../components/HeaderButton";
import {MaterialIcons} from "@expo/vector-icons";


//responsivity (Dimensions get method)
const screen = Dimensions.get('window');

const BarberBookingsDetailScreen = props =>{

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /*Responsivity */
  
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    const bookingID = props.navigation.getParam('bookingID');
    const data=[{id:'1',fullname:'FATIMA .Z',imagePth:require('../../../assets/images/fatima.jpg'),place:'DM',creneauD:'13h',creneauF:'14h',statut:'Confirmée',date:'2020-03-16',phone:'0659853214',sexe:'Femme',price:'1500',email:'fatima@gmail.com'},
                {id:'2',fullname:'HARETH .S',imagePth:require('../../../assets/images/hareth.jpg'),place:'CO',creneauD:'14h',creneauF:'15h',statut:'Confirmée',date:'2020-03-16',phone:'0759753214',sexe:'Homme',price:'1000',email:'hareth@gmail.com'},
                {id:'3',fullname:'CHRIS .K',imagePth:require('../../../assets/images/chris.jpg'),place:'CO',creneauD:'15h',creneauF:'16h',statut:'Confirmée',date:'2020-03-17',phone:'0633853214',sexe:'Femme',price:'1500',email:'christina@gmail.com'},
                {id:'4',fullname:'RAOUF .M',imagePth:require('../../../assets/images/walid.jpg'),place:'DM',creneauD:'16h',creneauF:'17h',statut:'Confirmée',date:'2020-03-18',phone:'0640853214',sexe:'Homme',price:'1000',email:'raouf@gmail.com'}
                ];
    const currentBooking = data.find(booking => booking.id === bookingID);
 
    const month = ()=>{
        const array = currentBooking.date.split('-');
        const newArrayMonth = array.slice(1,2);
        if(newArrayMonth.toString()=== '03'){
            return 'Mars';
        }else{
            return;
        }

    }
    
    useEffect(()=>{
    props.navigation.setParams({phoneNumber:currentBooking.phone});
    props.navigation.setParams({gender:currentBooking.sexe});
    },[currentBooking.phone,currentBooking.sexe]);
      
    return(
    
     <View style={styles.container}>
       
      </View>
    
    
     );    
};

BarberBookingsDetailScreen.navigationOptions= navData => {
   const phoneN = navData.navigation.getParam('phoneNumber');
   const gender = navData.navigation.getParam('gender');
    return {
        headerRight : ()=>  
              (<HeaderButtons HeaderButtonComponent = {HeaderButton}> 
                <Item title = "callCustomer" 
                  iconName = {Platform.OS === 'android' ? 'md-call' : 'ios-call'} 
                  color='white' 
                  onPress={()=>{
                    let phoneNumber = '';
    
                    if (Platform.OS === 'android') {
                      phoneNumber = `tel:${`${phoneN}`}`;
                    } else {
                      phoneNumber = `telprompt:${`${phoneN}`}`;
                    }
                
                    Linking.openURL(phoneNumber);
                  }}
                />
              </HeaderButtons>
            ),
            headerTitle:phoneN,
            headerTitleStyle:{
              fontFamily:'poppins',
              color: 'white'
            },
            headerStyle:{
                backgroundColor:gender === 'Femme' ? 'rgb(254,178,199)' : '#87d4f2'
            },
            headerBackTitle:" ",
            headerTintColor:'white'
    
    };

 };

const styles= StyleSheet.create({

container:{
  flex:1,
  backgroundColor:'white',
  justifyContent:'flex-start',
  alignItems:'center',
  width:'100%'
}
});

export default BarberBookingsDetailScreen;