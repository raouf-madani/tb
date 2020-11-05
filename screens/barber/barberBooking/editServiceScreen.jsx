import React, {useState,useReducer,useEffect,useCallback} from 'react';
import { StyleSheet,View,KeyboardAvoidingView,Text,Image,Dimensions,TouchableWithoutFeedback,Keyboard,ActionSheetIOS, StatusBar,Picker,ActivityIndicator,Alert,Platform} from 'react-native';
import {Button } from 'react-native-elements';
import InputProfile from '../../../components/InputProfile';
import {FontAwesome5} from "@expo/vector-icons";
import Colors from '../../../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import * as servicesActions from '../../../store/actions/serviceActions';
import { useDispatch,useSelector } from 'react-redux';
import polylanar from "../../../lang/ar";
import polylanfr from "../../../lang/fr";
import BarberServiceScreen from './barberServiceScreen';

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
/////////////////////////////////////////////////////////////////////////////////////////////////////////

const EditServiceScreen = props =>{

   

   const currentServiceID=props.navigation.getParam('idService');  //get Service ID
   
   const barber=useSelector(state=>state.barbers.barber[0]);
   //console.log(barber);
   const currentUserService = barber.services.find(service => service.serviceId === currentServiceID); //get current service data
   

   //States for complex information textInputs
   const [hour,setHour] = useState(!currentServiceID?0:currentUserService.durationHour.toString());
   const hours = ['0','1','2','3','4','5','6','7','8','9','10','11','12'];
   const [minute,setMinute] = useState(!currentServiceID?0:currentUserService.durationMinute.toString());
   const minutes = ['0','5','10','15','20','25','30','35','40','45','50','55']; 
   const serviceTypes = ['Barbe','Cheveux','Suppléments'];
   const [serviceType,setServiceType] = useState(!currentServiceID?serviceTypes[0]:currentUserService.typeOfService);
   const serviceTypesWoman = ['Cheveux femme','Mariage','Soins'];
   const [serviceTypeWoman,setServiceTypeWoman] = useState(!currentServiceID?serviceTypesWoman[0]:currentUserService.typeOfService);
   const [error, setError] = useState();
   const [isLoading,setIsLoading]= useState(false);//ActivityIndicator handling
   const dispatch= useDispatch();
   
   //picker only iOS hours function 
   const onPress = () =>{
     const hoursIOS = ['0','1','2','3','4','5','6','7','8','9','10','11','12'];    
     ActionSheetIOS.showActionSheetWithOptions(
       {
         options: hoursIOS,
         cancelButtonIndex: -1
       },
       buttonIndex => {
         if (buttonIndex === -1) {
           // cancel action
         } else {
          setHour(hoursIOS[buttonIndex]);
         } 
       }
     );  
 };

 //picker only iOS minutes function 
 const onPressMinute = () =>{
  const minutesIOS = ['0','5','10','15','20','25','30','35','40','45','50','55'];    
  ActionSheetIOS.showActionSheetWithOptions(
    {
      options: minutesIOS,
      cancelButtonIndex: -1
    },
    buttonIndex => {
      if (buttonIndex === -1) {
        // cancel action
      } else {
       setMinute(minutesIOS[buttonIndex]);
      } 
    }
  );  
};

 //picker only iOS service type function 
 const onPressServiceType = () =>{
  const serviceTypesIOS = ['Barbe','Cheveux','Suppléments'];    
  ActionSheetIOS.showActionSheetWithOptions(
    {
      options: serviceTypesIOS,
      cancelButtonIndex: -1
    },
    buttonIndex => {
      if (buttonIndex === -1) {
        // cancel action
      } else {
       setServiceType(serviceTypesIOS[buttonIndex]);
      } 
    }
  );  
};

//picker only iOS service type Woman function 
const onPressServiceTypeWoman = () =>{
  const serviceTypesWomanIOS = ['Cheveux femme','Mariage','Soins'];    
  ActionSheetIOS.showActionSheetWithOptions(
    {
      options: serviceTypesWomanIOS,
      cancelButtonIndex: -1
    },
    buttonIndex => {
      if (buttonIndex === -1) {
        // cancel action
      } else {
       setServiceTypeWoman(serviceTypesWomanIOS[buttonIndex]);
      } 
    }
  );  
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///Input management



const[formState,disaptchFormState] = useReducer(formReducer,
    {inputValues:{
      name: currentUserService?currentUserService.name:'',
      price:currentUserService?currentUserService.price:''
    },
     inputValidities:{
       name:currentUserService?true:false,
       price:currentUserService?true:false
     },
     formIsValid:false});


const inputChangeHandler = useCallback((inputIdentifier, inputValue,inputValidity) =>{

disaptchFormState({type:Form_Input_Update,value:inputValue,isValid:inputValidity,inputID:inputIdentifier});
},[disaptchFormState]);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

useEffect(() => {
  if(error){
      Alert.alert(barber && barber.lang?polylanfr.Oups:polylanar.Oups,barber && barber.lang?polylanfr.WeakInternet:polylanar.WeakInternet,[{text:barber && barber.lang?polylanfr.OK:polylanar.OK}]);
      console.log(error);
  } 
}, [error]); 

 //Submitting
 const submitHandler =async () => {
 
  try{
      if(!formState.formIsValid || ((hour==='0' && minute==='0') || (hour===0 && minute===0) || (hour==='0' && minute===0) || (hour===0 && minute==='0')) ){
          Alert.alert(barber && barber.lang?polylanfr.Error:polylanar.Error,barber && barber.lang?polylanfr.EmptyFields:polylanar.EmptyFields,[
              {text:barber && barber.lang?polylanfr.OK:polylanar.OK}
          ]);
          return;
      }
   
      const duration= parseInt(hour)*60 + parseInt(minute);
      
       
      setError(null);
      setIsLoading(true);

         if(currentUserService){
           if(barber.sex==='Homme'){
           await dispatch(servicesActions.updateService(currentUserService.serviceId, 
                                                        formState.inputValues.name,
                                                        +formState.inputValues.price,
                                                        duration,serviceType));
           }else{
            await dispatch(servicesActions.updateService(currentUserService.serviceId, 
              formState.inputValues.name,
              +formState.inputValues.price,
              duration,serviceTypeWoman));
           }
         }else{
          if(barber.sex==='Homme'){
          await dispatch(servicesActions.createService(
                                                        formState.inputValues.name,
                                                        +formState.inputValues.price,
                                                        duration,
                                                        barber.id,serviceType));
          }else{
            await dispatch(servicesActions.createService(
              formState.inputValues.name,
              +formState.inputValues.price,
              duration,
              barber.id,serviceTypeWoman));
         }
        }
     
      props.navigation.goBack();
  } catch(err){
      setError(err.message);
      console.log(err.message);
  }
  setIsLoading(false);
  
};

useEffect(()=>{
  props.navigation.setParams({currentBarberServiceID:currentServiceID});
 
},[currentServiceID]);


    return(
    <TouchableWithoutFeedback onPress = {()=>Keyboard.dismiss()}>      
    <View style={styles.container}>
      <KeyboardAvoidingView  keyboardVerticalOffset={screen.width/36}  behavior={Platform.OS === "ios" ? "padding" : null}>
         <StatusBar hidden />
          <View style={styles.backgroundContainer}>
            <Image source={barber.sex==='Femme'?{uri:'http://173.212.234.137/assets/tahfifabarber/woman5.jpg'}:{uri:'http://173.212.234.137/assets/tahfifabarber/loginimage.jpg'}} style={{resizeMode:'cover',width:'100%',height:'100%'}}/>
          </View>
          <View style={styles.secondContainer}>
             <View style={styles.headerContainer}>
                   <View>
                     <Text style={{fontFamily:'poppins-bold',fontSize:screen.width/27.7,color:'#323446'}}>{barber && barber.lang?polylanfr.ChooseService:polylanar.ChooseService}</Text>
                   </View>
                   <View>
                     <Text style={{fontFamily:'poppins-bold',fontSize:screen.width/27.7,color:'#fd6c57'}}>{barber && currentUserService?currentUserService.price.toString()+' دج':'0 دج'}</Text>
                   </View>
             </View>

             <View style={styles.inputsContainer}>
            
             <View style={{flexDirection:'row',width:'90%',marginVertical:screen.width/72,alignItems:'center'}}>
                   <View style={{width:'50%'}}>
                    <Text style={{fontFamily:'poppins',fontSize:screen.width/30,color:'#323446',alignSelf:'flex-start'}}>{barber && barber.lang?polylanfr.ServiceType:polylanar.ServiceType}</Text>
                   </View>
                   <View style={{ width:'50%',borderWidth:1,paddingHorizontal:screen.width/30,borderRadius:screen.width/14.4,backgroundColor:Platform.OS=='ios'?Colors.blue:'#d3d3d3',
                                  borderColor:'#d3d3d3',height:screen.width/8,
                                  justifyContent:'center',alignSelf:'center'}}>
                   {Platform.OS === 'android' &&  barber.sex === 'Homme' ? 
                    
                              (<Picker
                              selectedValue={serviceType}
                              onValueChange={itemValue => setServiceType(itemValue)}
                              style={{fontFamily:'poppins',fontSize:screen.width/24,color:'#323446'}}
                              >
                              {serviceTypes.map(el=> <Picker.Item label={el} value={el} key={el} />)}
                              </Picker>) :
                              Platform.OS === 'android' &&  barber.sex === 'Femme' ?
                              ( <Picker
                               selectedValue={serviceTypeWoman}
                               onValueChange={itemValue => setServiceTypeWoman(itemValue)}
                               style={{fontFamily:'poppins',fontSize:12,color:'#323446'}}
                               >
                               {serviceTypesWoman.map(el=> <Picker.Item label={el} value={el} key={el} />)}
                               </Picker> )
                              : 
                              Platform.OS === 'ios' &&  barber.sex === 'Homme' ?
                             
                              (<Text onPress={onPressServiceType} style={{fontFamily:'poppins',fontSize:screen.width/24,color:'#fff'}}>
                                {serviceType}
                              </Text>):
                               Platform.OS === 'ios' &&  barber.sex === 'Femme' ?
                              (<Text onPress={onPressServiceTypeWoman} style={{fontFamily:'poppins',fontSize:screen.width/24,color:'#fff'}}>
                               {serviceTypeWoman}
                             </Text>):undefined} 
                  </View>
                 </View>
                 <View style={{flexDirection:'row',width:'90%',marginVertical:screen.width/72,alignItems:'center'}}>
                   <View style={{width:'50%'}}>
                    <Text style={{fontFamily:'poppins',fontSize:screen.width/30,color:'#323446',alignSelf:'flex-start'}}>{barber && barber.lang?polylanfr.ServiceName:polylanar.ServiceName}</Text>
                   </View>
                  
                    <InputProfile
                        id="name" 
                        placeholder={barber && barber.lang?polylanfr.BeardTrace:polylanar.BeardTrace}
                        placeholderTextColor={Platform.OS=='android'?'rgba(50,52,70,0.4)':'#d3d3d3'}
                        keyboardType="default"
                        onInputChange={inputChangeHandler}
                        initialValue={currentUserService?currentUserService.name:''}
                        initiallyValid={true}
                        required
                        minLength={3}
                        autoCapitalize='sentences'
                        widthView='50%'
                        backgroundColor={Platform.OS=='ios'?Colors.blue:'#d3d3d3'}
                        height={screen.width/9}
                        /> 
                  
                 </View>

                 <View style={{flexDirection:'row',width:'90%',marginVertical:screen.width/72,alignItems:'center'}}>
                   <View style={{width:'50%'}}>
                    <Text style={{fontFamily:'poppins',fontSize:screen.width/30,color:'#323446',alignSelf:'flex-start'}}>{barber && barber.lang?polylanfr.Hours:polylanar.Hours}</Text>
                   </View>
                   <View style={{ width:'50%',borderWidth:1,paddingHorizontal:screen.width/72,borderRadius:screen.width/14.4,backgroundColor:Platform.OS=='ios'?Colors.blue:'#d3d3d3',
                                  borderColor:hour!=='0'||minute!=='0'?'#d3d3d3':Colors.primary,height:screen.width/8,
                                  justifyContent:'center',alignSelf:'center'}}>
                   {Platform.OS === 'android' ? 
                              <Picker
                              selectedValue={hour}
                              onValueChange={itemValue => setHour(itemValue)}
                              style={{fontFamily:'poppins',fontSize:screen.width/24,color:'#323446'}}
                              >
                              {hours.map(el=> <Picker.Item label={el} value={el} key={el} />)}
                              </Picker> :
                              <Text onPress={onPress} style={{fontFamily:'poppins',fontSize:screen.width/24,color:'#fff'}}>
                                {hour}
                              </Text>} 
                  </View>
                 </View>
                 
                 <View style={{flexDirection:'row',width:'90%',marginVertical:screen.width/72,alignItems:'center'}}>
                   <View style={{width:'50%'}}>
                    <Text style={{fontFamily:'poppins',fontSize:screen.width/30,color:'#323446',alignSelf:'flex-start'}}>{barber && barber.lang?polylanfr.Minutes:polylanar.Minutes}</Text>
                   </View>
                   <View style={{ width:'50%',borderWidth:1,paddingHorizontal:screen.width/30,borderRadius:screen.width/14.4,backgroundColor:Platform.OS=='ios'?Colors.blue:'#d3d3d3',
                                  borderColor:hour!=='0'||minute!=='0'?'#d3d3d3':Colors.primary,height:screen.width/8,
                                  justifyContent:'center',alignSelf:'center'}}>
                   {Platform.OS === 'android' ? 
                              <Picker
                              selectedValue={minute}
                              onValueChange={itemValue => setMinute(itemValue)}
                              style={{fontFamily:'poppins',fontSize:screen.width/24,color:'#323446'}}
                              >
                              {minutes.map(el=> <Picker.Item label={el} value={el} key={el} />)}
                              </Picker> :
                              <Text onPress={onPressMinute} style={{fontFamily:'poppins',fontSize:screen.width/24,color:'#fff'}}>
                                {minute}
                              </Text>} 
                  </View>
                 </View>

                 <View style={{flexDirection:'row',width:'90%',marginVertical:screen.width/72,alignItems:'center'}}>
                   <View style={{width:'50%'}}>
                    <Text style={{fontFamily:'poppins',fontSize:screen.width/30,color:'#323446',alignSelf:'flex-start'}}>{barber && barber.lang?polylanfr.PriceIn:polylanar.PriceIn}</Text>
                   </View>
                   <InputProfile
                      id='price'
                      placeholder={barber && barber.lang?polylanfr.Example+': 1500 دج':polylanar.Example+': 1500 دج'}
                      keyboardType="phone-pad"
                      onInputChange={inputChangeHandler}
                      initialValue={currentUserService?currentUserService.price.toString():''}
                      initiallyValid={true}
                      required
                      placeholderTextColor={Platform.OS=='android'?'rgba(50,52,70,0.4)':'#d3d3d3'}
                      style={{height:screen.width/18}}
                      widthView='50%'
                      backgroundColor={Platform.OS=='ios'?Colors.blue:'#d3d3d3'}
                      height={screen.width/9}
                      inputStyle={{color:'white'}}
                    />
                 </View>
             </View>
             <View style={styles.footerContainer}>
                 {!isLoading ?<Button
                    theme={{colors: {primary:'#fd6c57'}}} 
                    title={currentUserService?barber && barber.lang?polylanfr.Edit:polylanar.Edit:barber.lang?polylanfr.Add:polylanar.Add}
                    titleStyle={styles.labelButton}
                    buttonStyle={styles.buttonStyle}
                    ViewComponent={LinearGradient} 
                    onPress={submitHandler}
                    linearGradientProps={{
                        colors: ['#fd6d57', '#fd9054'],
                        start: {x: 0, y: 0} ,
                        end:{x: 1, y: 0}
                        
                    }}
                  />: <ActivityIndicator style={{marginBottom:screen.width/14.4}} color={Colors.primary}/>}
             </View>
          </View>
       </KeyboardAvoidingView>
    </View>
    </TouchableWithoutFeedback>
     );    
};


 EditServiceScreen.navigationOptions= navData => {
  const currentBarberServiceID=navData.navigation.getParam('currentBarberServiceID');
    return {
            
            title:currentBarberServiceID?'Modifier Service':'Ajouter Service',
            headerTransparent : true ,
            headerBackTitle : " ",
            headerTintColor: '#fff',
            headerTitleStyle:{
              fontFamily:'poppins-bold',
              marginTop:screen.width/72
            },
            headerLeft:(navData)=>(<FontAwesome5 onPress={()=>navData.navigation.goBack()} name="arrow-left" size={24} color="white" style={{marginLeft:screen.width/36}} />)
    };

 };

const styles= StyleSheet.create({
container:{
  flex:1,
  backgroundColor:'black',
  width:'100%',
},
backgroundContainer:{
  height:'25%'
},
secondContainer:{
 height:'75%',
 width:'100%',
 backgroundColor:'#fff',
 borderTopLeftRadius:screen.width/12,
 borderTopRightRadius:screen.width/12,
 overflow:'hidden',
 
},
headerContainer:{
  width:'90%',
  height:'20%',
  flexDirection:'row',
  justifyContent:'space-between',
  alignItems:'center',
  alignSelf:'center'
},
inputsContainer:{
 height:'50%',
 width:'100%',
 alignItems:'center',
},
inputContainer:{
 width:'50%',
 borderWidth:1,
 borderRadius:screen.width/18,
 backgroundColor:'#d3d3d3',
 borderColor:'#d3d3d3'
},
footerContainer:{
 height:'30%',
 width:'100%',
 justifyContent:'flex-end',
 paddingBottom:screen.width/14.4
},
labelButton:{
 color:'#FFF',
 fontFamily:'poppins',
 fontSize:screen.width/22.5,
 textTransform:null,
},
buttonStyle:{
 borderColor:'#fd6c57',
 width:'90%',
 borderRadius:screen.width/18,
 height:screen.width/9,
 alignSelf:'center',
}
});

export default EditServiceScreen;