import React,{useState,useEffect,useCallback,useRef} from 'react';
import { StyleSheet, Text, View, ImageBackground , Image,Dimensions,TouchableOpacity,ScrollView,StatusBar,Alert,ActivityIndicator, Platform} from 'react-native';
import {MaterialIcons,MaterialCommunityIcons,Entypo} from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import {  Rating,Button,Overlay  } from 'react-native-elements';
import Colors from "../../constants/Colors";
import { useDispatch,useSelector } from 'react-redux';
import * as barberActions from '../../store/actions/barberActions';
import * as feedbackActions from '../../store/actions/feedbackActions';
import * as portfolioActions from '../../store/actions/portfolioActions';
import Feedback from '../../components/Feedback';
import moment from 'moment';
import { getTokens ,addtoken } from '../../store/actions/tokenActions';

import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import { Notifications as Notifications2 } from 'expo';
import { getBarberBookings, changeBookingState } from '../../store/actions/bookingsActions';
import ApproveOverlay from '../../components/ApproveOverlay';
import polylanar from "../../lang/ar";
import polylanfr from "../../lang/fr";
import NotifOverlay from '../../components/NotifOverlay';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});


const height = Dimensions.get('window').height;

const BarberHomeScreen = props =>{
  

//Notifications 
const [expoPushToken, setExpoPushToken] = useState('');
const [notification, setNotification] = useState(false);
const notificationListener = useRef();
const responseListener = useRef();

  const barberID= props.navigation.getParam('barberID');  //get Barber ID
  const barberUID= props.navigation.getParam('barberUID'); 
  const [error, setError] = useState();
  const [isLoading,setIsLoading]= useState(false);//ActivityIndicator handling
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [finished,setFinished] = useState([]);
  const [finishVisible,setFinishVisible] = useState(false)
  const dispatch= useDispatch();

  //get the barber's tokens
  const tokens = useSelector(state=>state.tokens.barberTokens);
  const allBookings = useSelector(state => state.bookings.bookings);
   const [notificationData,setNotificationData]= useState([]);
   /*
   *******Fetch One barber DATA
  */

 const getBarber=useCallback(async()=>{
  try{
    setError(false);
    setIsLoading(true);

    await dispatch(getTokens(barberID));
    
    setIsRefreshing(true);

    await dispatch(barberActions.setBarber(barberID));
    await dispatch(feedbackActions.setFeedbacks(barberID));
    await dispatch(portfolioActions.setPortfolio(barberID));
    await dispatch(getBarberBookings(barberID));
    setIsLoading(false);
    setIsRefreshing(false);
    }catch(err){
      setError(true);
      throw err; 
    }
},[dispatch,setError]);

  useEffect(()=>{
  getBarber();
  },[dispatch,getBarber,setError]);

  useEffect(()=>{
    const willFocusSub= props.navigation.addListener('willFocus',getBarber);
    return ()=>{
      willFocusSub.remove();
    };
  },[getBarber]);

   const barber=useSelector(state=>state.barbers.barber[0]);
   const barberPortfolio=useSelector(state=>state.portfolio.portfolio);
   
  

   const feedbacks=useSelector(state=>state.feedbacks.feedbacks);
  
  
   //A Voir
   const myBarber=useSelector(state=>state.barbers.barber);
   
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
   
  /***********************Overlay when there is a non Approved booking*****************************/


  const toggleOverlay = async(bookingId,type) => {
 
    try {
      setIsLoading(true);
        await dispatch(changeBookingState(bookingId,type));
        await setFinished(previous=>previous.filter(e=>e.id !== bookingId));
       setFinishVisible(previous=>!previous);
      setIsLoading(false)

    } catch (error) {
       throw error;
    }   
  };

  useEffect(()=>{
    // console.log(moment().format("lll"));
 
    const finished2 = allBookings.filter(e=>(
      ((moment().isSame(e.bookingDate,"day") && moment().format().substring(11,16)> e.end) && e.status === "confirmée" ) ||  (moment().isAfter(e.bookingDate, 'day') && e.status === "confirmée") )
    
    
    )


    setFinished(finished2);
      if (finished2.length > 0){
          setFinishVisible(true);
      }

  },[allBookings]);

  /***********************Overlay when there is a non Approved booking END*****************************/
   
    /************NOTIFICATION ***********************************/


useEffect(() => {

  if(myBarber.length !== 0 )
  {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
  
  }


}, [myBarber,tokens]);

useEffect(()=>{

  // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)


  notificationListener.current = Notifications.addNotificationReceivedListener(async (notification) => {
    // setNotification(notification);

    const notificationsList = await Notifications.getPresentedNotificationsAsync() ;
    
    // setNotificationData(notificationsList);
    props.navigation.navigate('AllBookingsScreen',{barberID:barberID,tokens}); 
    
  });

  responseListener.current = Notifications.addNotificationResponseReceivedListener(async (notification) => {
 
    const notificationsList = await Notifications.getPresentedNotificationsAsync() ;
    // Notifications.dismissAllNotificationsAsync();
    // notificationsList.push(notification.notification);
    // setNotificationData(notificationsList);
    props.navigation.navigate('AllBookingsScreen',{barberID:barberID,tokens}); 
  });



return () => {
  Notifications.removeNotificationSubscription(notificationListener);
  Notifications.removeNotificationSubscription(responseListener);
};



},[])


const notificationDataHandler = (list,sender) =>{

  setNotificationData(previous=>previous.filter(e=>e.request.identifier !== list))
  
   toggleOverlay();
   Notifications.dismissNotificationAsync(list);
 }

async function registerForPushNotificationsAsync() {
  let token;

  if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
  
    let finalStatus = existingStatus;
   
    if (existingStatus !== 'granted') {
      console.log(' push notification!');
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
     
      console.log('Failed to get push token for push notification!');
      return;
    }

      token = (await Notifications.getExpoPushTokenAsync()).data;
      let  tokenIndex;
     
      if(tokens.length>0){
       tokenIndex = await tokens.findIndex(
        t => t.barberId === barberID && t.expoToken === token
      );
    
    }

        if(tokenIndex < 0 || tokens.length ===0 ) {
         
            await dispatch(addtoken({expoToken:token , barberId : barberID}))
        }

  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}


/*****************************************Notifications End********************************************************* */
/********************************************************************** */

    if(error){
      
      return ( <ImageBackground source={require('../../assets/images/support.png')} style={styles.coverTwo}>
                  <View style={{marginBottom:10,alignSelf:'center'}}>
                    <Text style={styles.noServicesText}>{barber && barber.lang?polylanfr.WeakInternet:polylanar.WeakInternet} </Text>
                  </View>
                  <Button
                    theme={{colors: {primary:'#fd6c57'}}} 
                    title={barber && barber.lang?polylanfr.Repeat:polylanar.Repeat} 
                    titleStyle={styles.labelButton}
                    buttonStyle={styles.buttonStyle}
                    ViewComponent={LinearGradient}
                    onPress={getBarber}
                    linearGradientProps={{
                        colors: ['#fd6d57', '#fd9054'],
                        start: {x: 0, y: 0} ,
                        end:{x: 1, y: 0}
                      }}/>
              </ImageBackground>);
    };


    if(isLoading || barber===undefined){
      
      return ( <ImageBackground source={require('../../assets/images/support.png')} style={styles.coverTwo}>
                  <ActivityIndicator size='large' color={Colors.primary} />
               </ImageBackground>)
    };
  
    
    return(
      <View style ={styles.container}>
        <StatusBar hidden/>

                { finished.length > 0 && finished.reverse().map((booking,index)=>
                {
               return(

                 <ApproveOverlay 
                    isVisible={true}
                    key ={index} 
                    toggleOverlay = {(id,type)=>toggleOverlay(id,type)}
                    booking = {booking}

                 />)
              
              

                }
                
                )
            }

            { notificationData.length >0 && notificationData.map((item,index)=>{

                  const e = Platform.OS === "ios" ? item.request.content.data.body : item.request.content.data ;
                  
                    return(

                    <NotifOverlay 
                        key={index}
                        close={()=>notificationDataHandler(item.request.identifier,"self")} 
                        isVisible = {true} 
                        start={e.start}
                        end = {e.end}
                        address = {e.address}
                        bookingDate = {e.bookingDate}
                        body = {e.body}
                        type = {e.type}
                        name = {e.name}
                        surname = {e.surname}
                        />


                  )})
                    
                  }

         <View style={styles.firstContainer}>
           <View style={styles.coverContainer}>
               <ImageBackground source={require('../../assets/images/barberScreen.png')} style={styles.cover} />
           </View>
           <View style={styles.infoContainer}>
               <View style={styles.imageContainer}>
               {barber && barber.image ? <Image source={{uri:`http://173.212.234.137/profileImages/barber/${barber.image}`}} style={styles.icon} />:
               <Image source={require('../../assets/images/unknown.jpeg')} style={styles.icon} />}
                  
               </View>
               <Text style={styles.bname}>{barber && barber.b_name!==null?barber.b_name:barber && barber.lang?polylanfr.BusinessName:polylanar.BusinessName}</Text>
               <Text style={styles.jobAge}>{barber && (barber.name!==null || barber.surname!==null || barber.age!==null)?`${barber.name} ${barber.surname}, ${barber.age} ${barber && barber.lang?polylanfr.Yo:polylanar.Yo}`:barber && barber.lang?polylanfr.personalInforamtion:polylanar.personalInforamtion}</Text>
               <View style={{flexDirection:'row'}}>
                <Rating
                      type='custom'
                      startingValue={barber && feedbacks.length===0?2.5:barber.mark}
                      imageSize={20}
                      ratingBackgroundColor={'#323446'}
                      ratingColor='#fd6c57'
                      tintColor='#f9f9f9'
                    />
                 <Text style={styles.commentsNumber}>{feedbacks.length!==0 ? ` (${feedbacks.length} ${barber && barber.lang?polylanfr.Comments:polylanar.Comments})`:barber && barber.lang?polylanfr.NoComments:polylanar.NoComments}</Text>   
                </View>
                <View style={styles.iconsContainer}>
                  <TouchableOpacity style={styles.iconContainer} onPress={()=>props.navigation.navigate('BarberProfile',{barberUID:barberUID,barberID:barberID})}>
                    <View style={styles.iconFormCircle}>
                        <MaterialCommunityIcons title = "map-marker-radius" name ='map-marker-radius' color='#fff' size={23} />
                    </View>
                    <Text style={styles.iconText}>{barber && barber.lang?polylanfr.Information:polylanar.Information}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.iconContainer} onPress={()=>props.navigation.navigate('BarberService',{barberID:barberID})}>
                    <View style={styles.iconFormCircle1}>
                       <Entypo title = "scissors" name ='scissors' color='#fff' size={23} />
                    </View>
                    <Text style={styles.iconText}>{barber && barber.lang?polylanfr.Services:polylanar.Services}</Text>
                  </TouchableOpacity> 
                  <TouchableOpacity style={styles.iconContainer} onPress={()=>props.navigation.navigate('AllBookingsScreen',{barberID:barberID,tokens})} >
                    <View style={styles.iconFormCircle2}>
                       <MaterialCommunityIcons title = "calendar-check" name ='calendar-check' color='#fff' size={23} />
                    </View>
                    <Text style={styles.iconText}>{barber && barber.lang?polylanfr.Bookings:polylanar.Bookings}</Text>
                  </TouchableOpacity> 
                  <TouchableOpacity style={styles.iconContainer} onPress={()=>props.navigation.navigate('BarberSupport')}>
                    <View style={styles.iconFormCircle3}>
                      <MaterialIcons title = "support" name ='menu' color='#fff' size={23} />
                    </View>
                    <Text style={styles.iconText}>{barber && barber.lang?polylanfr.Support:polylanar.Support}</Text>
                  </TouchableOpacity>    
                </View>
           </View>
           <View style={styles.menu}>
              <TouchableOpacity style={{borderBottomWidth:2,borderBottomColor:isAbout ?'#fd6c57':'#f9f9f9',paddingBottom:3}} onPress={about}>
               <Text style={styles.itemText}>{barber && barber.lang?polylanfr.About:polylanar.About}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{borderBottomWidth:2,borderBottomColor:isPortfolio?'#fd6c57':'#f9f9f9',paddingBottom:3}} onPress={portfolio}>
               <Text style={styles.itemText}>{barber && barber.lang?polylanfr.Portfolio:polylanar.Portfolio}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{borderBottomWidth:2,borderBottomColor:isFeedback?'#fd6c57':'#f9f9f9',paddingBottom:3}} onPress={feedback}>
                <Text style={styles.itemText}>{barber && barber.lang?polylanfr.Feedback:polylanar.Feedback}</Text>
              </TouchableOpacity>  
           </View>
          
         </View>
        { isAbout ?(<ScrollView style={{width:'100%'}} showsVerticalScrollIndicator={false} refreshing={isRefreshing}>
            <View style={styles.firstRow}>
                <View>
                  <Text style={styles.title}>{barber && barber.lang?polylanfr.Fullname:polylanar.Fullname}</Text>
                  <Text style={styles.detail}>{barber && (barber.name!==null || barber.surname!==null)?`${barber.name} ${barber.surname}`:'Votre nom complet'}</Text>
                </View>
                <View>
                  <Text style={styles.title}>{barber && barber.lang?polylanfr.StartFrom:polylanar.StartFrom}</Text> 
                  <Text style={styles.price}>{barber && barber.services.length!==0 ? minServicesPrice(barber.services)+' دج':'0 دج'}</Text>
                </View>  
            </View>
            
            <View style={styles.secondRow}>
                <View>
                  <Text style={styles.title}>{barber && barber.lang?polylanfr.Available:polylanar.Available}</Text>
                </View>
                <ScrollView horizontal={true}   showsHorizontalScrollIndicator={false}>
                  <View style={styles.daysContainer}>
                    <View style={styles.dayContainer}>
                      <Text style={styles.dayText}>{barber && barber.lang?polylanfr.Saturday:polylanar.Saturday}</Text>
                      <Text style={styles.detail}>{barber && barber.workingTimes['Sam'].isworking===1?`${barber.workingTimes['Sam'].debut} - ${barber.workingTimes['Sam'].finish}` : barber && barber.lang?polylanfr.NoAvailable:polylanar.NoAvailable}</Text>
                    </View>
                    <View style={styles.dayContainer}>
                      <Text style={styles.dayText}>{barber && barber.lang?polylanfr.Sunday:polylanar.Sunday}</Text>
                      <Text style={styles.detail}>{barber && barber.workingTimes['Dim'].isworking===1?`${barber.workingTimes['Dim'].debut} - ${barber.workingTimes['Dim'].finish}` : barber && barber.lang?polylanfr.NoAvailable:polylanar.NoAvailable}</Text> 
                    </View>
                    <View style={styles.dayContainer}>
                      <Text style={styles.dayText}>{barber && barber.lang?polylanfr.Monday:polylanar.Monday}</Text>
                      <Text style={styles.detail}>{barber && barber.workingTimes['Lun'].isworking===1?`${barber.workingTimes['Lun'].debut} - ${barber.workingTimes['Lun'].finish}` : barber && barber.lang?polylanfr.NoAvailable:polylanar.NoAvailable}</Text> 
                    </View>
                    <View style={styles.dayContainer}>
                      <Text style={styles.dayText}>{barber && barber.lang?polylanfr.Tuesday:polylanar.Tuesday}</Text>
                      <Text style={styles.detail}>{barber && barber.workingTimes['Mar'].isworking===1?`${barber.workingTimes['Mar'].debut} - ${barber.workingTimes['Mar'].finish}` : barber && barber.lang?polylanfr.NoAvailable:polylanar.NoAvailable}</Text>
                    </View>
                    <View style={styles.dayContainer}>
                      <Text style={styles.dayText}>{barber && barber.lang?polylanfr.Wednesday:polylanar.Wednesday}</Text>
                      <Text style={styles.detail}>{barber && barber.workingTimes['Mer'].isworking===1?`${barber.workingTimes['Mer'].debut} - ${barber.workingTimes['Mer'].finish}` : barber && barber.lang?polylanfr.NoAvailable:polylanar.NoAvailable}</Text>
                    </View>
                    <View style={styles.dayContainer}>
                      <Text style={styles.dayText}>{barber && barber.lang?polylanfr.Thursday:polylanar.Thursday}</Text>
                      <Text style={styles.detail}>{barber && barber.workingTimes['Jeu'].isworking===1?`${barber.workingTimes['Jeu'].debut} - ${barber.workingTimes['Jeu'].finish}` : barber && barber.lang?polylanfr.NoAvailable:polylanar.NoAvailable}</Text>
                    </View>
                    <View style={styles.dayContainer}>
                      <Text style={styles.dayText}>{barber && barber.lang?polylanfr.Friday:polylanar.Friday}</Text>
                      <Text style={styles.detail}>{barber && barber.workingTimes['Ven'].isworking===1?`${barber.workingTimes['Ven'].debut} - ${barber.workingTimes['Ven'].finish}` : barber && barber.lang?polylanfr.NoAvailable:polylanar.NoAvailable}</Text>  
                    </View>
                  </View>
                </ScrollView>
            </View>
            
            <View style={styles.thirdRow}>
                <View style={styles.leftColumn}>
                  <Text style={styles.title}>{barber && barber.lang?polylanfr.TheAddress:polylanar.TheAddress}</Text>
                  <Text style={styles.detail}>{barber && barber.address!==null?barber.address:barber && barber.lang?polylanfr.YourPersonalAddress:polylanar.YourPersonalAddress}</Text>
                  <View style={styles.cityContainer}>
                    <MaterialCommunityIcons title="city" name ='city' color='#fd6c57' size={20} />
                    <Text style={styles.cityText}>{barber && (barber.wilaya!==null || barber.region!==null)?`${barber.region}, ${barber.wilaya}`:barber && barber.lang?polylanfr.Location:polylanar.Location}</Text>
                  </View>
                  
                </View>
                <View  style={styles.rightColumn}>
                    <Image source={require('../../assets/images/localisation.jpg')} style={styles.mapImage} />
                </View>
            </View>
            
            <View style={styles.forthRow}>
                <View style={styles.forthRowElementsContainer}>
                  <Text style={styles.title}>{barber && barber.lang?polylanfr.Models:polylanar.Models}</Text>
                  <TouchableOpacity onPress={()=>{setIsAbout(false); setIsPortfolio(true);}}>
                  <Text style={styles.detail}>{barber && barber.lang?polylanfr.DisplayAll:polylanar.DisplayAll}</Text>
                  </TouchableOpacity>
                </View>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} refreshing={isRefreshing} style={styles.photosContainer} contentContainerStyle={{justifyContent:'space-around'}}>
                 
                {barberPortfolio.slice(0,4).map(picture=>

                (<View 
                  key={picture.id}
                  style={styles.modelImageContainer}>
                  <Image source={{uri:picture.model===null?`http://173.212.234.137/uploads/ayoungleaderportfolio.jpg` :`http://173.212.234.137/uploads/${picture.model}`}} style={styles.modelImage} />
                </View>)
              )}
                 
                </ScrollView>
            </View>

         
         </ScrollView>):undefined}

        {isPortfolio?(<ScrollView style={{width:'100%'}} showsVerticalScrollIndicator={false} refreshing={isRefreshing} contentContainerStyle={{alignItems:'center'}}>
        <View style={{flexDirection:'row',width:'90%',marginVertical:10}}>
               {barberPortfolio.slice(0,3).map(picture=>(<View 
                    key={picture.id}
                    style={{width:'33.3%',alignItems:'center'}}>
                    <Image source={{uri:picture.model===null?`http://173.212.234.137/uploads/ayoungleaderportfolio.jpg` :`http://173.212.234.137/uploads/${picture.model}`}} style={styles.modelImage} />
                  </View>)
                 )}
                 
               </View>
               <View style={{flexDirection:'row',width:'90%',marginVertical:10}}>
               {barberPortfolio.slice(3,6).map(picture=>(<View 
                    key={picture.id}
                    style={{width:'33.3%',alignItems:'center'}}>
                    <Image source={{uri:picture.model===null?`http://173.212.234.137/uploads/ayoungleaderportfolio.jpg` :`http://173.212.234.137/uploads/${picture.model}`}} style={styles.modelImage} />
                  </View>))}
                  
                 
               </View>
               
         </ScrollView>):undefined}

         {isFeedback?(<ScrollView style={{width:'100%'}} showsVerticalScrollIndicator={false} refreshing={isRefreshing} contentContainerStyle={{alignItems:'center'}}>
         {feedbacks.length ===0 ?
          (<View style={styles.noFeedbacksContainer}>
            <Text style={styles.noFeedbacksText}>{barber && barber.lang?polylanfr.NoFeedback:polylanar.NoFeedback}</Text>
          </View>):
          (<View>
            {feedbacks.map(feed=>  <Feedback
               key={feed.id}
               mark={feed.mark}
               comment={feed.comment}
               name={feed.name}
               surname={feed.surname}
               feedbacks={feedbacks}
              />)}
           </View>)}
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
    fontSize:13,
    alignSelf:'flex-start'
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
    alignSelf:'center',
    paddingBottom:5,
  },
  photosContainer:{
    flexDirection:'row',
    paddingHorizontal:15,
    paddingBottom:5
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
   justifyContent:'center',
   width:'100%',
   height:'100%',
   resizeMode:'cover'
 },
 noServicesText:{
  fontFamily:'poppins',
  fontSize:14,
  color:Colors.blue
},
labelButton:{
  color:'#FFF',
  fontFamily:'poppins',
  fontSize:16,
  textTransform:null,
 },
 buttonStyle:{
  borderColor:'#fd6c57',
  width:'50%',
  borderRadius:20,
  height:45,
  alignSelf:'center'
 },
 noFeedbacksContainer:{
  width:'100%',
  justifyContent:'center',
  alignItems:'center',
  marginTop:height*0.2,
},
noFeedbacksText:{
  fontFamily:'poppins',
  fontSize:13,
  color:Colors.blue
},  
});

export default BarberHomeScreen;