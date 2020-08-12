import React,{useState,useEffect,useCallback} from 'react';
import { StyleSheet, Text, View, ImageBackground , Image,Dimensions,TouchableOpacity,ScrollView,StatusBar,Alert,ActivityIndicator} from 'react-native';
import {MaterialIcons,MaterialCommunityIcons,Entypo} from "@expo/vector-icons";
import {  Rating  } from 'react-native-elements';
import Colors from "../../constants/Colors";
import { useDispatch,useSelector } from 'react-redux';
import * as barberActions from '../../store/actions/barberActions';
import * as feedbackActions from '../../store/actions/feedbackActions';
import Feedback from '../../components/Feedback';

const BarberHomeScreen = props =>{

  const barberID= props.navigation.getParam('barberID');  //get Barber ID
  const barberUID= props.navigation.getParam('barberUID'); 
  const [error, setError] = useState();
  const [isLoading,setIsLoading]= useState(false);//ActivityIndicator handling
  const dispatch= useDispatch();

   /*
   *******Fetch One barber DATA
  */
 const getBarber=useCallback(async()=>{
  try{
    setError(false);
    setIsLoading(true);
    await dispatch(barberActions.setBarber(barberID));
    await dispatch(feedbackActions.setFeedbacks(barberID));
    setIsLoading(false);
    }catch(err){
      console.log(err);
      setError(err);
      if(err){
        Alert.alert('Oups!','Une erreur est survenue',[{text:'OK'}]);
    } 
    }
},[dispatch]);

  useEffect(()=>{
  getBarber();
  
  },[dispatch,getBarber]);

  useEffect(()=>{
    const willFocusSub= props.navigation.addListener('willFocus',getBarber);
    return ()=>{
      willFocusSub.remove();
    };
  },[getBarber]);

   const barber=useSelector(state=>state.barbers.barber[0]);

   const feedbacks=useSelector(state=>state.feedbacks.feedbacks);
   
  
  const [isAbout,setIsAbout]= useState(true);
  const [isPortfolio,setIsPortfolio]= useState(false);
  const [isFeedback,setIsFeedback]= useState(false);

    const about = ()=>{
      setIsAbout(true);
      setIsPortfolio(false);
      setIsFeedback(false);
    };

    const portfolio =()=>{
      setIsAbout(false);
      setIsPortfolio(true);
      setIsFeedback(false);
    };

    const feedback=()=>{
      setIsAbout(false);
      setIsPortfolio(false); 
      setIsFeedback(true);
    };

    const minServicesPrice=prices=>{
      let arrayPrices=[];
      if(prices.lentgh ===0){
        return;
      }
      prices.forEach(e=>{
        arrayPrices.push(e.price);
      });
  
      return Math.min(...arrayPrices);
     
    };
   
    const averageMarks=marks=>{
       let total = 0;
       let cpt=0;
      

        marks.forEach(review=>{
          if(review.mark !==null){
            total = total + review.mark;
            cpt=cpt+1;
          }
        });
       
      
        return total / cpt;
       
    };

    if(isLoading){
      return ( <ImageBackground source={require('../../assets/images/support.png')} style={styles.coverTwo}>
                  <ActivityIndicator size='large' color={Colors.primary} />
              </ImageBackground>)
    };
  
    return(
      <View style ={styles.container}>
        <StatusBar hidden/>
         <View style={styles.firstContainer}>
           <View style={styles.coverContainer}>
               <ImageBackground source={require('../../assets/images/barberScreen.png')} style={styles.cover} />
           </View>
           <View style={styles.infoContainer}>
               <View style={styles.imageContainer}>
                  <Image source={require('../../assets/images/man2.jpg')} style={styles.icon} />
               </View>
               <Text style={styles.bname}>{barber && barber.b_name!==null?barber.b_name:'Nom business'}</Text>
               <Text style={styles.jobAge}>{barber && (barber.name!==null || barber.surname!==null || barber.age!==null)?`${barber.name} ${barber.surname}, ${barber.age}ans`:'Nom, prénom et votre age'}</Text>
               <View style={{flexDirection:'row'}}>
                <Rating
                      type='custom'
                      startingValue={feedbacks.length===0? 1: averageMarks(feedbacks)}
                      imageSize={20}
                      ratingBackgroundColor={'#323446'}
                      ratingColor='#fd6c57'
                      tintColor='#f9f9f9'
                    />
                 <Text style={styles.commentsNumber}>{feedbacks.length!==0 ? ` (${feedbacks.length} Commentaires)`:' Aucun Commentaire!'}</Text>   
                </View>
                <View style={styles.iconsContainer}>
                  <TouchableOpacity style={styles.iconContainer} onPress={()=>props.navigation.navigate('BarberProfile',{barberUID:barberUID})}>
                    <View style={styles.iconFormCircle}>
                        <MaterialCommunityIcons title = "map-marker-radius" name ='map-marker-radius' color='#fff' size={23} />
                    </View>
                    <Text style={styles.iconText}>Infos</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.iconContainer} onPress={()=>props.navigation.navigate('BarberService',{barberID:barberID})}>
                    <View style={styles.iconFormCircle1}>
                       <Entypo title = "scissors" name ='scissors' color='#fff' size={23} />
                    </View>
                    <Text style={styles.iconText}>Services</Text>
                  </TouchableOpacity> 
                  <TouchableOpacity style={styles.iconContainer} onPress={()=>props.navigation.navigate('AllBookingsScreen',{barberID:barberID})} >
                    <View style={styles.iconFormCircle2}>
                       <MaterialCommunityIcons title = "calendar-check" name ='calendar-check' color='#fff' size={23} />
                    </View>
                    <Text style={styles.iconText}>Bookings</Text>
                  </TouchableOpacity> 
                  <TouchableOpacity style={styles.iconContainer} onPress={()=>props.navigation.navigate('BarberSupport')}>
                    <View style={styles.iconFormCircle3}>
                      <MaterialIcons title = "support" name ='menu' color='#fff' size={23} />
                    </View>
                    <Text style={styles.iconText}>Support</Text>
                  </TouchableOpacity>    
                </View>
           </View>
           <View style={styles.menu}>
              <TouchableOpacity style={{borderBottomWidth:2,borderBottomColor:isAbout ?'#fd6c57':'#f9f9f9',paddingBottom:3}} onPress={about}>
               <Text style={styles.itemText}>A propos</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{borderBottomWidth:2,borderBottomColor:isPortfolio?'#fd6c57':'#f9f9f9',paddingBottom:3}} onPress={portfolio}>
               <Text style={styles.itemText}>Portfolio</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{borderBottomWidth:2,borderBottomColor:isFeedback?'#fd6c57':'#f9f9f9',paddingBottom:3}} onPress={feedback}>
                <Text style={styles.itemText}>Feedback</Text>
              </TouchableOpacity>  
           </View>
          
         </View>
        { isAbout ?(<ScrollView style={{width:'100%'}} showsVerticalScrollIndicator={false}>
            <View style={styles.firstRow}>
                <View>
                  <Text style={styles.title}>Nom Complet</Text>
                  <Text style={styles.detail}>{barber && (barber.name!==null || barber.surname!==null)?`${barber.name} ${barber.surname}`:'Votre nom complet'}</Text>
                </View>
                <View>
                  <Text style={styles.title}>A Partir de</Text> 
                  <Text style={styles.price}>{barber && barber.services.length!==0 ? minServicesPrice(barber.services)+' دج':'0 دج'}</Text>
                </View>  
            </View>
            
            <View style={styles.secondRow}>
                <View>
                  <Text style={styles.title}>Disponibilité</Text>
                </View>
                <ScrollView horizontal={true}   showsHorizontalScrollIndicator={false}>
                  <View style={styles.daysContainer}>
                    <View style={styles.dayContainer}>
                      <Text style={styles.dayText}>Samedi</Text>
                      <Text style={styles.detail}>{barber && barber.workingTimes['Sam'].isworking===1?`${barber.workingTimes['Sam'].debut} - ${barber.workingTimes['Sam'].finish}` : 'Non disponible'}</Text>
                    </View>
                    <View style={styles.dayContainer}>
                      <Text style={styles.dayText}>Dimanche</Text>
                      <Text style={styles.detail}>{barber && barber.workingTimes['Dim'].isworking===1?`${barber.workingTimes['Dim'].debut} - ${barber.workingTimes['Dim'].finish}` : 'Non disponible'}</Text> 
                    </View>
                    <View style={styles.dayContainer}>
                      <Text style={styles.dayText}>Lundi</Text>
                      <Text style={styles.detail}>{barber && barber.workingTimes['Lun'].isworking===1?`${barber.workingTimes['Lun'].debut} - ${barber.workingTimes['Lun'].finish}` : 'Non disponible'}</Text> 
                    </View>
                    <View style={styles.dayContainer}>
                      <Text style={styles.dayText}>Mardi</Text>
                      <Text style={styles.detail}>{barber && barber.workingTimes['Mar'].isworking===1?`${barber.workingTimes['Mar'].debut} - ${barber.workingTimes['Mar'].finish}` : 'Non disponible'}</Text>
                    </View>
                    <View style={styles.dayContainer}>
                      <Text style={styles.dayText}>Mercredi</Text>
                      <Text style={styles.detail}>{barber && barber.workingTimes['Mer'].isworking===1?`${barber.workingTimes['Mer'].debut} - ${barber.workingTimes['Mer'].finish}` : 'Non disponible'}</Text>
                    </View>
                    <View style={styles.dayContainer}>
                      <Text style={styles.dayText}>Jeudi</Text>
                      <Text style={styles.detail}>{barber && barber.workingTimes['Jeu'].isworking===1?`${barber.workingTimes['Jeu'].debut} - ${barber.workingTimes['Jeu'].finish}` : 'Non disponible'}</Text>
                    </View>
                    <View style={styles.dayContainer}>
                      <Text style={styles.dayText}>Vendredi</Text>
                      <Text style={styles.detail}>{barber && barber.workingTimes['Ven'].isworking===1?`${barber.workingTimes['Ven'].debut} - ${barber.workingTimes['Ven'].finish}` : 'Non disponible'}</Text>  
                    </View>
                  </View>
                </ScrollView>
            </View>
            
            <View style={styles.thirdRow}>
                <View style={styles.leftColumn}>
                  <Text style={styles.title}>Adresse</Text>
                  <Text style={styles.detail}>{barber && barber.address!==null?barber.address:'Votre adresse personnelle'}</Text>
                  <View style={styles.cityContainer}>
                    <MaterialCommunityIcons title="city" name ='city' color='#fd6c57' size={20} />
                    <Text style={styles.cityText}>{barber && (barber.wilaya!==null || barber.region!==null)?`${barber.region}, ${barber.wilaya}`:'Région, Ville'}</Text>
                  </View>
                  
                </View>
                <View  style={styles.rightColumn}>
                    <Image source={require('../../assets/images/localisation.jpg')} style={styles.mapImage} />
                </View>
            </View>
            
            <View style={styles.forthRow}>
                <View style={styles.forthRowElementsContainer}>
                  <Text style={styles.title}>Modèles</Text>
                  <Text style={styles.detail}>Affichez tout</Text>
                </View>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.photosContainer} contentContainerStyle={{justifyContent:'space-around'}}>
                  <View style={styles.modelImageContainer}>
                    <Image source={require('../../assets/images/man1.jpg')} style={styles.modelImage} />
                  </View>
                  <View style={styles.modelImageContainer}>
                    <Image source={require('../../assets/images/man2.jpg')} style={styles.modelImage} />
                  </View>
                  <View style={styles.modelImageContainer}>
                    <Image source={require('../../assets/images/man3.jpg')} style={styles.modelImage} />
                  </View>
                  <View style={styles.modelImageContainer}>
                    <Image source={require('../../assets/images/man4.jpg')} style={styles.modelImage} />
                  </View>
                  <View style={styles.modelImageContainer}>
                    <Image source={require('../../assets/images/man5.jpg')} style={styles.modelImage} />
                  </View>
                </ScrollView>
            </View>

         
         </ScrollView>):undefined}

        {isPortfolio?(<ScrollView style={{width:'100%'}} showsVerticalScrollIndicator={false} contentContainerStyle={{alignItems:'center'}}>
               <View style={{flexDirection:'row',width:'90%',marginVertical:10}}>
                  <View style={{width:'33.3%',alignItems:'center'}}>
                    <Image source={require('../../assets/images/man1.jpg')} style={styles.modelImage} />
                  </View>
                  <View style={{width:'33.3%',alignItems:'center'}}>
                    <Image source={require('../../assets/images/man2.jpg')} style={styles.modelImage} />
                  </View>
                  <View style={{width:'33.3%',alignItems:'center'}}>
                    <Image source={require('../../assets/images/man3.jpg')} style={styles.modelImage} />
                  </View>
               </View>
               <View style={{flexDirection:'row',width:'90%',marginVertical:10}}>
                  <View style={{width:'33.3%',alignItems:'center'}}>
                    <Image source={require('../../assets/images/man4.jpg')} style={styles.modelImage} />
                  </View>
                  <View style={{width:'33.3%',alignItems:'center'}}>
                    <Image source={require('../../assets/images/man5.jpg')} style={styles.modelImage} />
                  </View>
                  <View style={{width:'33.3%',alignItems:'center'}}>
                    <Image source={require('../../assets/images/man1.jpg')} style={styles.modelImage} />
                  </View>
               </View>
               <View style={{flexDirection:'row',width:'90%',marginVertical:10}}>
                  <View style={{width:'33.3%',alignItems:'center'}}>
                    <Image source={require('../../assets/images/man1.jpg')} style={styles.modelImage} />
                  </View>
                  <View style={{width:'33.3%',alignItems:'center'}}>
                    <Image source={require('../../assets/images/man2.jpg')} style={styles.modelImage} />
                  </View>
                  <View style={{width:'33.3%',alignItems:'center'}}>
                    <Image source={require('../../assets/images/man3.jpg')} style={styles.modelImage} />
                  </View>
               </View>
               <View style={{flexDirection:'row',width:'90%',marginVertical:10}}>
                  <View style={{width:'33.3%',alignItems:'center'}}>
                    <Image source={require('../../assets/images/man4.jpg')} style={styles.modelImage} />
                  </View>
                  <View style={{width:'33.3%',alignItems:'center'}}>
                    <Image source={require('../../assets/images/man5.jpg')} style={styles.modelImage} />
                  </View>
                  <View style={{width:'33.3%',alignItems:'center'}}>
                    <Image source={require('../../assets/images/man1.jpg')} style={styles.modelImage} />
                  </View>
               </View>
         </ScrollView>):undefined}

         {isFeedback?(<ScrollView style={{width:'100%'}} showsVerticalScrollIndicator={false} contentContainerStyle={{alignItems:'center'}}>
           {feedbacks.map(feed=>  <Feedback
               key={feed.id}
               mark={feed.mark}
               comment={feed.comment}
               feedbacks={feedbacks}
              />)}
              
         </ScrollView>):undefined}

      </View>

     );    
};

BarberHomeScreen.navigationOptions= ()=>{
  return {
    headerTransparent : true ,
    headerBackTitle : " ",
    headerTitle: () => (
      <Image 
      resizeMode="cover"
      style={{
        width:150,
        height:40,
        resizeMode:'contain',
        alignSelf: 'center'}}
      
      />
    ),
    headerLeft:()=>null,
   
  };
}

const styles= StyleSheet.create({
  container : {
      flex : 1,
      backgroundColor:'white',
      width:'100%',
      alignItems:'center'
  },
  firstContainer:{
    width:'100%',
    height:'50%',
    alignItems:'center',
    backgroundColor:'#f9f9f9'
  },
  coverContainer:{
    width:'100%',
    height:'25%',
    overflow:'hidden'
  },
  icon:{
    width:'100%',
    height:'100%',
  },
  cover:{
    width:'100%',
    resizeMode:'cover',
    height:'100%'
  },
  infoContainer:{
    width:'100%',
    height:'55%',
    alignItems:'center'
  },
  imageContainer:{
    width:90,
    height:90,
    borderRadius:50,
    marginTop:-55,
    overflow:'hidden'
  },
  bname:{
    fontFamily:'poppins-bold',
    fontSize:17,color:'#323446',
    paddingTop:3
  },
  jobAge:{
    fontFamily:'poppins',
    color:'#fd6c57',
    paddingBottom:3,
    fontSize:11
  },
  commentsNumber:{
    fontFamily:'poppins',
    color:'#323446',
    paddingBottom:3,
    fontSize:10,
    marginTop:5
  },
  iconsContainer:{
    flexDirection:'row',
    paddingTop:10
  },
  iconContainer:{
    marginHorizontal:13,
    alignItems:'center'
  },
  iconFormCircle:{
    width:40,
    height:40,
    borderRadius:20,
    backgroundColor:'#56A7FF',
    justifyContent:'center',
    alignItems:'center'
  },
  iconFormCircle1:{
    backgroundColor:'#FD6C57',
    width:40,
    height:40,
    borderRadius:20,
    justifyContent:'center',
    alignItems:'center'
  },
  iconFormCircle2:{
    backgroundColor:'#FE457C',
    width:40,
    height:40,
    borderRadius:20,
    justifyContent:'center',
    alignItems:'center'
  },
  iconFormCircle3:{
    width:40,
    height:40,
    borderRadius:20,
    backgroundColor:'#BA55D3',
    justifyContent:'center',
    alignItems:'center'
  },
  iconText:{
    fontFamily:'poppins',
    color:'grey',
    paddingTop:3,
    fontSize:10
  },
  menu:{
    width:'90%',
    height:'20%',
    flexDirection:'row',
    justifyContent:'space-around',
    alignItems:'flex-end'
  },
  itemContainer:{
    borderBottomWidth:2,
    borderBottomColor:'#fd6c57',
    paddingBottom:3
  },
  itemText:{
    fontFamily:'poppins',
    color:'grey',
    fontSize:12
  },
  firstRow:{
    flexDirection:'row',
    justifyContent:'space-between',
    marginTop:15,
    width:'90%',
    alignSelf:'center'
  },
  title:{
    fontFamily:'poppins-bold',
    color:'#323446',
    fontSize:13
  },
  detail:{
    fontFamily:'poppins',
    color:'grey',
    fontSize:12
  },
  price:{
    fontFamily:'poppins',
    color:'#fd6c57',
    fontSize:12
  },
  secondRow:{
    marginTop:15,
    width:'90%',
    alignSelf:'center'
  },
  daysContainer:{
    flexDirection:'row',
    justifyContent:'space-around'
  },
  dayContainer:{
    alignItems:'center',
    marginHorizontal:10
  },
  dayText:{
    fontFamily:'poppins',
    color:'grey',
    fontSize:13
  },
  thirdRow:{
    flexDirection:'row',
    marginTop:15,
    width:'90%',
    alignSelf:'center'
  },
  leftColumn:{
    width:'60%'
  },
  cityContainer:{
    flexDirection:'row',
    alignItems:'center',
    paddingTop:5
  },
  cityText:{
    fontFamily:'poppins',
    color:'#fd6c57',
    fontSize:12,
    marginTop:5
  },
  rightColumn:{
    width:'40%',
    alignItems:'flex-end'
  },
  mapImage:{
    width:90,
    height:90
  },
  forthRow:{
    marginTop:15
  },
  forthRowElementsContainer:{
    flexDirection:'row',
    justifyContent:'space-between',
    width:'90%',
    alignSelf:'center'
  },
  photosContainer:{
    flexDirection:'row',
    paddingHorizontal:15,
    paddingBottom:15
  },
  modelImageContainer:{
    borderRadius:20,
    overflow:'hidden',
    marginRight:7
  },
  modelImage:{
    width:90,
    height:90
  },
 coverTwo:{
   flex:1,
   alignItems:'center',
   justifyContent:'center',
   width:'100%',
   height:'100%',
   resizeMode:'cover'
 }
});

export default BarberHomeScreen;