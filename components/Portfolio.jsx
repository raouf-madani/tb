import React,{useState} from 'react';
import { StyleSheet, View,Dimensions,TouchableHighlight,Image } from 'react-native';
import {MaterialIcons,Ionicons} from "@expo/vector-icons";
import polylanar from "../lang/ar";
import polylanfr from "../lang/fr";

//responsivity (Dimensions get method)
const screen = Dimensions.get('window');
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;



const Portfolio = props =>{
     
    
    
    

    return(
      <View style={styles.imageConainer}>
        <Image source={{uri:`http://173.212.234.137/uploads/${props.modelName}`}} style={styles.modelImage} />
        <View style={{width:'100%',flexDirection:'row',justifyContent:'space-around',alignItems:'center'}}>
        <TouchableHighlight style={styles.iconContainer} onPress={props.cameraImage}>
          <Ionicons title = "add" 
          name ={'ios-camera'}
          color='#fff' 
          size={23}
          />
        </TouchableHighlight>
        <TouchableHighlight style={styles.iconContainer2} onPress={props.libraryImage}>
        <MaterialIcons 
          title = "library" 
          name ='photo-library' 
          color='#FFF' 
          size={21} />
        </TouchableHighlight>
        </View>
      </View>
     );    
};


const styles= StyleSheet.create({

    imageConainer:{
        width:'45%',
        marginHorizontal:15,
        alignItems:'center'
      },
       modelImage:{ 
         width:windowWidth*0.4,
         height:windowHeight*0.25
        },
      iconContainer:{
        height:30,
        width:30,
        borderRadius:30/2,
        backgroundColor:'#323446',
        justifyContent:'center',
        alignItems:'center',
        marginVertical:5
       },
       iconContainer2:{
        height:30,
        width:30,
        borderRadius:30/2,
        backgroundColor:'#FE457C',
        justifyContent:'center',
        alignItems:'center',
        marginVertical:5
       },
});

export default Portfolio;













