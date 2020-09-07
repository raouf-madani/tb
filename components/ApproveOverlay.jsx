import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View,Image, ImageBackground,Dimensions,TouchableOpacity, StatusBar,TouchableWithoutFeedback} from 'react-native';
import Colors from "../constants/Colors";
import { Button ,Overlay,Divider} from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
const screen = Dimensions.get("window");
import moment from "moment";

const ApproveOverlay = props =>{
const date = moment(props.booking.bookingDate).format("LLLL").slice(0,-5);

        return (
 
        <Overlay 
        isVisible={props.isVisible}
        overlayStyle = {styles.overlayContainer}
        >
    <View style = {styles.contentContainer}>
                <View style = {styles.imageContainer}>
                <Image style={styles.image} source={require('../assets/images/done.png')}/>
                </View>


                <View style = {styles.firstTextContainer}>
                <Text style ={{fontFamily:"poppins",color:Colors.blue,fontSize:screen.width/28}} >Un rdv vient de se Terminé</Text>
                <Text style ={{fontFamily:"poppins",textAlign:"center",color:Colors.blue,fontSize:screen.width/28}} >Avez-vous terminer cette réservation avec Succés?</Text>
                </View>

                <View style = {styles.secondTextContainer}>
                <Text style = {{fontSize:screen.width/18,fontFamily:"poppins"}}>{props.booking.start+'  |  '+props.booking.end}</Text>
                </View>

                <View style = {styles.thirTextContainer}>

                <Text  style ={{fontFamily:"poppins",color:Colors.textGrey,fontSize:screen.width/28}} >{date}</Text>
                <Text style ={{fontFamily:"poppins",color:Colors.textGrey,fontSize:screen.width/28}}>{props.booking.address+" | "+props.booking.wilaya}</Text>
                </View>
     <View style = {styles.buttonsContainer}>


                <Button  
                title ="Approuver" 
                buttonStyle = {styles.buttonStyle}
                titleStyle = {styles.buttonText}
                containerStyle = {{width:"40%",elevation:4}}
                onPress = {()=>props.toggleOverlay(props.booking.id,"réalisée")}
                ViewComponent={LinearGradient} 
                   linearGradientProps={{
                        colors: ['#fd6d57', '#fd9054'],
                        start: {x: 0, y: 0} ,
                        end:{x: 1, y: 0}
                    }}
                />
                <Button  
                title ="Non" 
                buttonStyle = {styles.buttonStyle}
                titleStyle = {styles.buttonText}
                containerStyle = {{width:"40%",elevation:4}}
                onPress = {()=>props.toggleOverlay(props.booking.id,"annulée")}
                ViewComponent={LinearGradient} 
                   linearGradientProps={{
                        colors: ['#df4346', '#F4686A'],
                        start: {x: 0, y: 0} ,
                        end:{x: 1, y: 0}
                    }}
                />
     </View>
    {/* <Text>avez vous réaliser le booking de  {props.booking.start + " "+props.booking.bookingDate}</Text>
    <Button title = "oui" onPress = {()=>props.toggleOverlay(props.booking.id,"réalisée")} />
              <Button title = "non" onPress = {()=>props.toggleOverlay(props.booking.id,"annulée")} /> */}
</View>
          </Overlay>
     
          
          );
    
    };
    
    
    const styles= StyleSheet.create({
    
        overlayContainer:
        {width :"100%",
      height :"100%",
      backgroundColor:"rgba(25,25,25,0.8)",
      overflow:"hidden",
      elevation:2,
      padding:0,
      justifyContent:"center",
      alignItems:"center"
    } ,
     contentContainer : 
        {
             width:"90%",
            height:"80%",
            backgroundColor:"#fff",
            justifyContent:"center",
            borderRadius:25
        },
        imageContainer : {
            height : "20%",
            marginBottom:"5%"
        },
        image:{
            height:"100%",
            width:"100%",
            resizeMode:"contain"
        },
        firstTextContainer : {
            alignSelf :"center",
            alignItems:"center",
            marginBottom:"10%",
            height:"10%",
            justifyContent:"space-between"
        },
        secondTextContainer :{
            alignSelf :"center",
            alignItems:"center"
        },
        thirTextContainer : {
            alignSelf :"center",
            alignItems:"center",
            height:"10%",
            marginBottom:"15%",
            justifyContent:"space-between"
        },
        buttonsContainer : {
            flexDirection:"row",
            justifyContent:"space-around"
        },
        buttonStyle : {
            borderRadius : 5,
            paddingHorizontal : "5%",
        
            borderRadius:25
    },
    buttonText :{
        color :"#fff",
        fontSize :screen.width/30,
        fontFamily:"poppins"
    }


     
    
    });


export default ApproveOverlay ;