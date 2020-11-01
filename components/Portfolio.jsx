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
          size={screen.width/15.7}
          />
        </TouchableHighlight>
        <TouchableHighlight style={styles.iconContainer2} onPress={props.libraryImage}>
        <MaterialIcons 
          title = "library" 
          name ='photo-library' 
          color='#FFF' 
          size={screen.width/17.1} />
        </TouchableHighlight>
        </View>
      </View>
     );    
};


const styles= StyleSheet.create({

    imageConainer:{
        width:'45%',
        marginHorizontal:screen.width/24,
        alignItems:'center'
      },
       modelImage:{ 
         width:windowWidth*0.4,
         height:windowHeight*0.25
        },
      iconContainer:{
        height:screen.width/12,
        width:screen.width/12,
        borderRadius:screen.width/24,
        backgroundColor:'#323446',
        justifyContent:'center',
        alignItems:'center',
        marginVertical:screen.width/72
       },
       iconContainer2:{
        height:screen.width/12,
        width:screen.width/12,
        borderRadius:screen.width/24,
        backgroundColor:'#FE457C',
        justifyContent:'center',
        alignItems:'center',
        marginVertical:screen.width/72
       },
});

export default Portfolio;













