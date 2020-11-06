import React from 'react';
import { StyleSheet, Text, View,Dimensions,Image } from 'react-native';
import Colors from "../constants/Colors";
import {  Rating  } from 'react-native-elements';
import {useSelector } from 'react-redux';
import polylanar from "../lang/ar";
import polylanfr from "../lang/fr";

//responsivity (Dimensions get method)
const screen = Dimensions.get('window');



const Feedback = props =>{

    const barber=useSelector(state=>state.barbers.barber[0]);

    return(
       <View style={styles.feedbackContainer}>
            <View style={styles.photoContainer}>
                <View style={styles.photoCircle}>
                    <Image source={{uri:`http://173.212.234.137/profileImages/client/${props.image}`}} style={styles.photo} />
                </View>
            </View>
            <View style={styles.commentRatingContainer}>
                <View>
                    {props.mark?<Rating
                    readonly
                    type='custom'
                    startingValue={props.mark}
                    imageSize={screen.width/18}
                    ratingBackgroundColor={Colors.blue}
                    ratingColor={Colors.primary}
                    tintColor='#fff'
                    />:<Text style={styles.noMark}>{barber && barber.lang?polylanfr.Nomarks:polylanar.Nomarks}</Text>}
                </View>
                <View style={styles.commentContainer}>
                    <Text style={{fontFamily:'poppins-bold',fontSize:screen.width/27.7,color:Colors.blue}}>{props.name===null && props.surname=== null ? 'Inconnu':props.name+' '+ props.surname}</Text>
                    <Text style={styles.comment}>
                    {props.comment? props.comment:barber && barber.lang?polylanfr.NoComments:polylanar.NoComments}
                    </Text>
                    <Text style={{fontSize:screen.width/36,fontFamily:'poppins-bold',color:'grey'}}>{props.date}</Text>
                </View>
            </View>
        </View>
     );    
};


const styles= StyleSheet.create({
feedbackContainer:{
    flexDirection:'row',
    width:'90%',
    marginVertical:screen.width/36
},
photoContainer:{
    width:'20%'
},
photoCircle:{
   width:screen.width/6,
   height:screen.width/6
},
photo:{
   width:'100%',
   height:'100%',
   borderRadius:screen.width/12
},
commentRatingContainer:{
    width:'80%',
    backgroundColor:'#fff',
    alignItems:'flex-start'
},
commentContainer:{
    padding:screen.width/36,
    backgroundColor:'#f9f9f9',
    borderRadius:screen.width/18,
    alignItems:'flex-start',
    justifyContent:'center'
},
comment:{
    fontFamily:'poppins',
    fontSize:screen.width/27.7,
    color:Colors.blue
},
noFeedbacksContainer:{
    width:'100%',
    justifyContent:'center',
    alignItems:'center'
  },
  noFeedbacksText:{
    fontFamily:'poppins',
    fontSize:screen.width/25.7,
    color:Colors.blue
  },   
  noMark:{
      fontFamily:'poppins',
      fontSize:screen.width/25.7,
      color:Colors.primary,
  }
});

export default Feedback;