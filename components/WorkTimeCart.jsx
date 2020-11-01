import React from 'react';
import { StyleSheet, Text, View,Dimensions,TouchableOpacity,Platform,Switch } from 'react-native';
import Colors from "../constants/Colors";
import {useSelector } from 'react-redux';
import polylanar from "../lang/ar";
import polylanfr from "../lang/fr";

//responsivity (Dimensions get method)
const screen = Dimensions.get('window');



const WorkTimeCart = props =>{

  const barber=useSelector(state=>state.barbers.barber[0]);


    let switchIOS;
    if(Platform.OS === 'ios'){
      switchIOS = {
       alignSelf:'center', 
       transform:  [{ scaleX: .7 }, { scaleY: .7 }] 
     };
   }
   

    return(
        <View style={styles.disponibilityContainer}>
              <View style={styles.dayContainer}>
                    <Text style={{fontFamily:'poppins-bold',fontSize:screen.width/30,color:props.switchDay ? Colors.primary:Colors.blue}}>{props.day}</Text>
                    <Switch style={switchIOS} value={props.value} onValueChange={props.onValueChange} trackColor={{true:'rgba(253,108,87,0.7)'}} thumbColor={props.switchDay? Colors.primary: 'white'}/>
              </View>
              <View>
                  <TouchableOpacity>
                    <Text style={styles.debutEndText} onPress={props.onPress}>{props.openDay ? props.openTimeDay: barber && barber.lang?polylanfr.Start:polylanar.Start} - <Text onPress={props.onPress2}>{props.closeDay ? props.closeTimeDay : barber && barber.lang?polylanfr.End:polylanar.End}</Text></Text>
                  </TouchableOpacity>
              </View>
        </View>
       
     );    
};


const styles= StyleSheet.create({

disponibilityContainer:{
  overflow:Platform.OS==='ios'?'visible':'hidden',
  shadowOpacity:0.5,
  shadowOffset:{width:0,height:2},
  shadowRadius:2,
  shadowColor:"#000",
  borderRadius:screen.width/36,
  elevation:5,
  paddingHorizontal:screen.width/36,
  paddingVertical:screen.width/24,
  marginVertical:screen.width/36,
  width:'90%',
  alignSelf:'center',
  backgroundColor:'#f9f9f9',
  flexDirection:'row',
  justifyContent:'space-between',
  alignItems:'center'
},
dayContainer:{
    alignItems:'flex-start',
    justifyContent:'center'
},  
debutEndText:{
    fontFamily:'poppins',
    color:Colors.blue,
    fontSize:screen.width/30
  },
 
});

export default WorkTimeCart;













