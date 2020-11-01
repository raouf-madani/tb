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
                    type='custom'
                    startingValue={props.mark}
                    imageSize={20}
                    ratingBackgroundColor={Colors.blue}
                    ratingColor={Colors.primary}
                    tintColor='#fff'
                    />:<Text style={styles.noMark}>{barber && barber.lang?polylanfr.Nomarks:polylanar.Nomarks}</Text>}
                </View>
                <View style={styles.commentContainer}>
                    <Text style={{fontFamily:'poppins-bold',fontSize:13,color:Colors.blue}}>{props.name===null && props.surname=== null ? 'Inconnu':props.name+' '+ props.surname}</Text>
                    <Text style={styles.comment}>
                    {props.comment? props.comment:barber && barber.lang?polylanfr.NoComments:polylanar.NoComments}
                    </Text>
                </View>
            </View>
        </View>
     );    
};


const styles= StyleSheet.create({
feedbackContainer:{
    flexDirection:'row',
    width:'90%',
    marginVertical:10
},
photoContainer:{
    width:'20%'
},
photoCircle:{
   width:60,
   height:60},
photo:{
   width:'100%',
   height:'100%',
   borderRadius:30
},
commentRatingContainer:{
    width:'80%',
    backgroundColor:'#fff',
    alignItems:'flex-start'
},
commentContainer:{
    padding:10,
    backgroundColor:'#f9f9f9',
    borderRadius:20,
    alignItems:'flex-start',
    justifyContent:'center'
},
comment:{
    fontFamily:'poppins',
    fontSize:13,
    color:Colors.blue
},
noFeedbacksContainer:{
    width:'100%',
    justifyContent:'center',
    alignItems:'center'
  },
  noFeedbacksText:{
    fontFamily:'poppins',
    fontSize:14,
    color:Colors.blue
  },   
  noMark:{
      fontFamily:'poppins',
      fontSize:14,
      color:Colors.primary,
  }
});

export default Feedback;