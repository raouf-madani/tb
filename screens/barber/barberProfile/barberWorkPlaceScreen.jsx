import React,{useState,useReducer,useCallback,useEffect} from 'react';
import { StyleSheet,View,Alert,Dimensions,ImageBackground,StatusBar,ActivityIndicator,TouchableOpacity,Text,TouchableWithoutFeedback,Image,Keyboard} from 'react-native';
import Colors from '../../../constants/Colors';
import { useDispatch,useSelector } from 'react-redux';
import {MaterialIcons,MaterialCommunityIcons} from "@expo/vector-icons";
import polylanar from "../../../lang/ar";
import polylanfr from "../../../lang/fr";
import {Button } from 'react-native-elements';
import * as barberActions from '../../../store/actions/barberActions';
import InputProfile from '../../../components/InputProfile';
import { LinearGradient } from 'expo-linear-gradient';

//responsivity (Dimensions get method)
const screen = Dimensions.get('window');

//UseReducer Input Management//////////////////////////////////////////////////////////////////////////////////
const Form_Input_Update = 'Form_Input_Update';
const formReducer=(state,action) =>{
    if(action.type === Form_Input_Update){
        const updatedValues = {
          ...state.inputValues,
          [action.inputID]:action.value
        };
        const updatedValidities = {
          ...state.inputValidities,
          [action.inputID]:action.isValid
        };
        let formIsValidUpdated = true;
        for(const key in updatedValidities){
          formIsValidUpdated = formIsValidUpdated && updatedValidities[key];
        }
        return{
          inputValues:updatedValues,
          inputValidities:updatedValidities,
          formIsValid:formIsValidUpdated
        };
    }
   
     return state;
    
};

const BarberWorkPlaceScreen = props =>{

  const barberID= props.navigation.getParam('barberID');  //get Barber ID
  const dispatch= useDispatch();

  const [error, setError] = useState();
  const [isLoading,setIsLoading]= useState(false);

 /*
   *******Fetch One barber DATA
  */
  //  const getBarber=useCallback(async()=>{
  //   try{
  //     setError(false);
  //     setIsLoading(true);
  //     await dispatch(barberActions.setBarber(barberID));
  //     setIsLoading(false);
  //     }catch(err){
  //       setError(true);
  //       if(err){
  //         Alert.alert('Oups!','Votre connexion est trop faible!',[{text:'OK'}]);
  //     } 
  //       console.log(err);
  //       throw err;
  //     }
  // },[dispatch,setError]);
  
  //   useEffect(()=>{
  //   getBarber();
  //   },[dispatch,getBarber,setError]);
  
     
  
    // useEffect(()=>{
     
    //   const willFocusSub= props.navigation.addListener('willFocus',getBarber);
    //   return ()=>{
    //     willFocusSub.remove();
       
    //   };
      
    // },[getBarber]);
  
  const barber= useSelector(state=>state.barbers.barber);
  

  


  const [isClientHome,setIsClientHome]=useState(barber[0] && barber[0].workplace==="cli"?true:false);
  const [isHome,setIsHome]=useState(barber[0] && barber[0].workplace==="home"?true:false);
  const [isBoth,setIsBoth]=useState(barber[0] && barber[0].workplace==="both"?true:false);
  
  const clientHouse=()=>{
    setIsClientHome(true);
    setIsHome(false);
    setIsBoth(false);
 };

 const home=()=>{
   setIsHome(true);
   setIsClientHome(false);
   setIsBoth(false);
};

const both=()=>{
 setIsBoth(true);
 setIsHome(false);
 setIsClientHome(false);
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///Input management

const[formState,disaptchFormState] = useReducer(formReducer,
  {inputValues:{
    address:barber[0]?barber[0].address:''
  },
   inputValidities:{
    address:true,
   },
   formIsValid:true});

const inputChangeHandler = useCallback((inputIdentifier, inputValue,inputValidity) =>{

disaptchFormState({type:Form_Input_Update,value:inputValue,isValid:inputValidity,inputID:inputIdentifier});
},[disaptchFormState]);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

 /*
   *******Confirm workplace function
  */
   const barberWorkplace=async()=>{
    if(isHome){
     try{
       setError(false);
       setIsLoading(true);
       //console.log(isHome);
       await dispatch(barberActions.updateBarberWorkplace(barberID,'home'));
  
       setIsLoading(false);
       
       }catch(err){
        
         setError(true);
         if(err){
           Alert.alert('Oups!','Votre connexion est trop faible!',[{text:'OK'}]);
       } 
         console.log(err);
         throw err;
       }
    }else if(isBoth){
     try{
       setError(false);
       setIsLoading(true);
       //console.log(isBoth);
       await dispatch(barberActions.updateBarberWorkplace(barberID,'both'));
   
       setIsLoading(false);
    
       }catch(err){
         setError(true);
         if(err){
           Alert.alert('Oups!','Votre connexion est trop faible!',[{text:'OK'}]);
       } 
         console.log(err);
         throw err;
       }
    }
   
 };

 if(error){
      
  return ( <ImageBackground source={{uri:'http://95.111.243.233/assets/tahfifabarber/support.png'}} style={styles.activityIndicatorContainer}>
            <StatusBar hidden />
              <View style={{marginBottom:screen.width /36,alignSelf:'center'}}>
                <Text style={styles.noServicesText}>{barber[0] && barber[0].lang?polylanfr.WeakInternet:polylanar.WeakInternet}</Text>
              </View>
              <Button
                theme={{colors: {primary:'#fd6c57'}}} 
                title={barber[0] && barber[0].lang?polylanfr.Repeat:polylanar.Repeat}
                titleStyle={styles.labelButton}
                buttonStyle={styles.buttonStyle}
                ViewComponent={LinearGradient}
               
                linearGradientProps={{
                    colors: ['#fd6d57', '#fd9054'],
                    start: {x: 0, y: 0} ,
                    end:{x: 1, y: 0}
                  }}/>
          </ImageBackground>);
};

 if(isLoading){
  return <ImageBackground source={{uri:'http://95.111.243.233/assets/tahfifabarber/support.png'}} style={styles.activityIndicatorContainer} >
          <StatusBar hidden />
          <ActivityIndicator size='large' color={Colors.primary} />
         </ImageBackground>
};
  
    return(
   
      <TouchableWithoutFeedback onPress = {()=>Keyboard.dismiss()}>      
      <View style={styles.container}>
        
           <StatusBar hidden />
            <View style={styles.backgroundContainer}>
              <Image source={barber[0].sex==='Femme'?{uri:'http://95.111.243.233/assets/tahfifabarber/woman5.jpg'}:{uri:'http://95.111.243.233/assets/tahfifabarber/loginimage.jpg'}} style={{resizeMode:'cover',width:'100%',height:'100%'}}/>
            </View>
            <View style={styles.secondContainer}>
          
           <View style={styles.firstRow}>
                  <Text style={styles.question}>Voulez-vous recevoir votre client dans votre zone de confort ou vous déplacez chez lui ?</Text>
            </View>
            <View style={styles.optionsRow}>
                  <TouchableOpacity onPress={clientHouse} style={{backgroundColor:isClientHome?'#fd6c57':Colors.blue,width:screen.width/7.2,height:screen.width/7.2,borderRadius:screen.width/3.6,alignSelf:'flex-start',justifyContent:'center',alignItems:'center'}}>
                    <MaterialCommunityIcons name="home-group" size={screen.width/11.25} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={home} style={{backgroundColor:isHome?'#fd6c57':Colors.blue,width:screen.width/7.2,height:screen.width/7.2,borderRadius:screen.width/3.6,alignSelf:'flex-end',justifyContent:'center',alignItems:'center'}}>
                     <MaterialIcons name="home" size={screen.width/11.25} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={both} style={{backgroundColor:isBoth?'#fd6c57':Colors.blue,width:screen.width/7.2,height:screen.width/7.2,borderRadius:screen.width/3.6,alignSelf:'center',justifyContent:'center',alignItems:'center'}}>
                  <MaterialCommunityIcons name="home-export-outline" size={screen.width/11.25} color="white" />
                  </TouchableOpacity>
            </View> 
            <View style={styles.textOptionsRow}>
              <View style={{ justifyContent:'center',alignItems:'flex-start'}}>
                 <Text style={{fontFamily:'poppins',fontSize:screen.width/28,color:isClientHome?'#fd6c57':Colors.blue,alignSelf:'flex-start'}}>Client</Text>
              </View>
              <View style={{ justifyContent:'center',alignItems:'flex-start'}}>
                 <Text style={{fontFamily:'poppins',fontSize:screen.width/28,color:isHome?'#fd6c57':Colors.blue}}>A domicile</Text>
              </View>
              <View style={{ justifyContent:'center',alignItems:'flex-start'}}>
                 <Text style={{fontFamily:'poppins',fontSize:screen.width/28,color:isBoth?'#fd6c57':Colors.blue}}>Les deux</Text>
              </View>
            </View> 
            {isHome || isBoth?<View>
                <InputProfile
                id='address'
                rightIcon={<MaterialIcons title = "address" name ='home' color={Platform.OS==='android'?'#323446':'#fff'} size={screen.width/15.7} />}
                placeholder={barber[0] && barber[0].lang?polylanfr.Address:polylanar.Address}
                keyboardType="default"
                returnKeyType="next"
                onInputChange={inputChangeHandler}
                initialValue={barber[0]?barber[0].address:''}
                initiallyValid={true}
                required
                placeholderTextColor={Platform.OS==='android'?'rgba(50,52,70,0.4)':'#f9f9f9'}
                minLength={12}
                autoCapitalize='sentences'
                widthView='90%'
                backgroundColor={Platform.OS==='android'?'#fff':Colors.blue}
                height={screen.width/6}
              />
              <View style={styles.buttonView}>
              <Button
                    theme={{colors: {primary:'#fd6c57'}}} 
                    title={"Modifier"}
                    titleStyle={styles.labelButton}
                    buttonStyle={styles.buttonStyle}
                    ViewComponent={LinearGradient} 
                    onPress={barberWorkplace}
                    linearGradientProps={{
                        colors: ['#fd6d57', '#fd9054'],
                        start: {x: 0, y: 0} ,
                        end:{x: 1, y: 0}
                        
                    }}
                  />
              </View>
              </View>:undefined}
       
            </View>
         
      </View>
      </TouchableWithoutFeedback>
    
     );    
};

BarberWorkPlaceScreen.navigationOptions= navData => {
    
     return {
      title:'Zone de Confort',
      headerTransparent : true ,
      headerBackTitle : " ",
      headerTintColor: '#fff',
      headerTitleStyle:{
        fontFamily:'poppins-bold',
        marginTop:screen.width/72
      
      }
     };
 
  };


const styles= StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'black',
    width:'100%',
  },
  backgroundContainer:{
    height:'35%'
  },
  secondContainer:{
   height:'65%',
   width:'100%',
   backgroundColor:'#fff',
   borderTopLeftRadius:screen.width/12,
   borderTopRightRadius:screen.width/12,
   overflow:'hidden',
   justifyContent:'flex-start',
   
  },
   activityIndicatorContainer:{
    flex:1,
    resizeMode:'cover',
    width:'100%',
    height:'100%',
    justifyContent:'center',
  },
  labelButton:{
    color:'#FFF',
    fontFamily:'poppins',
    fontSize:screen.width/22.5,
    textTransform:null,
   },
   buttonStyle:{
    borderColor:'#fd6c57',
    width:'50%',
    borderRadius:screen.width/18,
    height:screen.width/8,
    alignSelf:'center'
   },
   firstRow:{
    marginTop:screen.width/24,
    width:'90%',
    alignSelf:'center',
    paddingTop:20
  },
  question:{
    fontFamily:'poppins',
    color:Colors.blue,
    fontSize:screen.width/30,
    alignSelf:'flex-start'
  },
  optionsRow:{
     flexDirection:'row',
     width:'90%',
     height:screen.width/7.2,
     backgroundColor:'#f8f8f8',
     alignSelf:'center',
     marginTop:screen.width/10,
     borderRadius:screen.width/3.6,
     justifyContent:'space-between'
  },
  textOptionsRow:{
    flexDirection:'row',
     width:'85%',
     alignSelf:'center',
     borderRadius:screen.width/3.6,
     justifyContent:'space-between',
     marginBottom:screen.width/12,
     marginTop:screen.width/120
  },
  buttonView:{
    marginTop:screen.width/36
  },
  noServicesContainer:{
    width:'100%',
    height:'50%',
    justifyContent:'center'
    
  },
  noServicesText:{
    fontFamily:'poppins',
    fontSize:screen.width/25.71,
    color:Colors.blue
  },
});

export default BarberWorkPlaceScreen;