import React from 'react';
import { StyleSheet, Text, View,Dimensions,Image } from 'react-native';
import Colors from "../constants/Colors";
import {  Rating  } from 'react-native-elements';

//responsivity (Dimensions get method)
const screen = Dimensions.get('window');



const Feedback = props =>{

   

    return(
        props.feedbacks.length!==0? (<View style={styles.feedbackContainer}>
            <View style={styles.photoContainer}>
                <View style={styles.photoCircle}>
                    <Image source={require('../assets/images/avatarman.jpg')} style={styles.photo} />
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
                    />:<Text style={styles.noMark}>Aucune note!</Text>}
                </View>
                <View style={styles.commentContainer}>
                    <Text style={styles.comment}>
                    {props.comment? props.comment:'Aucun commentaire!'}
                    </Text>
                </View>
            </View>
        </View>):
       ( <View style={styles.noFeedbacksContainer}>
           <Text style={styles.noFeedbacksText}>Vous n'avez reçu aucun feedback pour le moment.</Text>
         </View>)
        
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
    height:'50%',
    justifyContent:'center'
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