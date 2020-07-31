import React from 'react';
import { StyleSheet, Text, View,Dimensions,TouchableOpacity } from 'react-native';
import Colors from "../constants/Colors";
import {MaterialIcons,Entypo} from "@expo/vector-icons";

//responsivity (Dimensions get method)
const screen = Dimensions.get('window');



const ServiceCart = props =>{


   

    return(
        <View style={styles.serviceContainer}>
               <View style={{width:'80%'}}>
                  <View style={styles.serviceTextContainer}>
                    <Text style={styles.serviceText}>{'Service '+props.number}</Text>
                  </View>
                  <Text style={styles.detailText}>{props.name}</Text>
                  <Text style={styles.detailText}>{props.minute+'min'}</Text>
                  <View style={styles.priceContainer}>
                    <Text style={styles.price}>{props.price+' DA'}</Text>
                  </View>
           </View>
               <View style={styles.iconsContainer}>
                <TouchableOpacity style={styles.iconFormCircleService} onPress={props.onPressUpdate}>
                        <Entypo title = "edit" name ='edit' color='#BA55D3' size={23} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconFormCircleService} onPress={props.onPressDelete}>
                      <MaterialIcons title = "delete" name ='delete-forever' color='#FE457C' size={23} />
                </TouchableOpacity> 
               </View>
           </View>
     );    
};


const styles= StyleSheet.create({

   
  iconFormCircleService:{
    width:30,
    height:30,
    borderRadius:20,
    justifyContent:'center',
    alignItems:'center',
  },
  serviceContainer:{
    overflow:'hidden',
    shadowOpacity:1,
    shadowRadius:10,
    shadowColor:"#323446",
    elevation:5,
    alignSelf:'center',
    flexDirection:'row',
    width:'90%',
    marginVertical:10,
    backgroundColor:'#f9f9f9',
    borderRadius:10,
    paddingHorizontal:10,
    paddingVertical:15
  },
  serviceTextContainer:{
    backgroundColor:'#fd6c57',
    width:60,
    alignItems:'center',
    justifyContent:'center',
    marginBottom:10,
    borderRadius:5
  },
  serviceText:{
    color:'#fff',
    fontFamily:'poppins',
    fontSize:12
  },
  detailText:{
    color:'#323446',
    fontFamily:'poppins',
    fontSize:12
  },
  priceContainer:{
    marginTop:10
  },
  price:{
    color:'#fd6c57',
    fontFamily:'poppins',
    fontSize:12
  },
  iconsContainer:{
    width:'20%',
    justifyContent:'space-between',
    alignItems:'center',
    borderLeftWidth:2,
    borderLeftColor:'#323446'
  },
});

export default ServiceCart;













