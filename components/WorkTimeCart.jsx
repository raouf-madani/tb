import React from 'react';
import { StyleSheet, Text, View,Dimensions,TouchableOpacity,Platform,Switch } from 'react-native';
import Colors from "../constants/Colors";

//responsivity (Dimensions get method)
const screen = Dimensions.get('window');



const WorkTimeCart = props =>{

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
                    <Text style={{fontFamily:'poppins-bold',fontSize:12,color:props.switchDay ? Colors.primary:Colors.blue}}>{props.day}</Text>
                    <Switch style={switchIOS} value={props.value} onValueChange={props.onValueChange} trackColor={{true:'rgba(253,108,87,0.7)'}} thumbColor={props.switchDay? Colors.primary: 'white'}/>
              </View>
              <View>
                  <TouchableOpacity>
                    <Text style={styles.debutEndText} onPress={props.onPress}>{props.openDay ? props.openTimeDay: 'Début'} - <Text onPress={props.onPress2}>{props.closeDay ? props.closeTimeDay : 'Fin'}</Text></Text>
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
  borderRadius:10,
  elevation:5,
  paddingHorizontal:10,
  paddingVertical:15,
  marginVertical:10,
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
    color:'#323446',
    fontSize:12
  },
 
});

export default WorkTimeCart;













