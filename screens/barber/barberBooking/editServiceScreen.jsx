import React, {useState,useReducer,useEffect,useCallback} from 'react';
import { StyleSheet,View,KeyboardAvoidingView,Text,Image,Dimensions,TouchableWithoutFeedback,Keyboard,ActionSheetIOS, StatusBar,ActivityIndicator,Alert,Platform,TouchableOpacity} from 'react-native';
import {Button } from 'react-native-elements';
import InputProfile from '../../../components/InputProfile';
import Colors from '../../../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import * as servicesActions from '../../../store/actions/serviceActions';
import { useDispatch,useSelector } from 'react-redux';
import polylanar from "../../../lang/ar";
import polylanfr from "../../../lang/fr";
import RNPickerSelect from 'react-native-picker-select';

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
   const [hour,setHour] = useState(!currentServiceID?null:currentUserService.durationHour.toString());
   const [minute,setMinute] = useState(!currentServiceID?null:currentUserService.durationMinute.toString());
   const [serviceType,setServiceType] = useState(!currentServiceID?null:currentUserService.typeOfService);
   const [serviceTypeWoman,setServiceTypeWoman] = useState(!currentServiceID?null:currentUserService.typeOfService);
   const [error, setError] = useState();
   const [isLoading,setIsLoading]= useState(false);//ActivityIndicator handling
   const dispatch= useDispatch();

   const pickedMenServicesHandler =  (itemValue)=>{
    setServiceType(itemValue);
        };
    const pickedWomenServicesHandler =  (itemValue)=>{
      setServiceTypeWoman(itemValue);
          };
   
  
//picker only iOS service type Woman function 
/*const onPressServiceTypeWoman = () =>{
  const serviceTypesWomanIOS = ['Coiffure','Mariage','Soins'];    
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
};*/


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
      console.log(formState.formIsValid);

      if(!formState.formIsValid || ((minute===null || hour===null || (serviceType===null && serviceTypeWoman===null) || formState.inputValues.price==='' || formState.inputValues.name==='') ||  (hour==='0' && minute==='0') || (hour===0 && minute===0) || (hour==='0' && minute===0) || (hour===0 && minute==='0')) ){
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
      
         <StatusBar hidden />
          <View style={styles.backgroundContainer}>
            <Image source={barber.sex==='Femme'?{uri:'http://95.111.243.233/assets/tahfifabarber/woman5.jpg'}:{uri:'http://95.111.243.233/assets/tahfifabarber/loginimage.jpg'}} style={{resizeMode:'cover',width:'100%',height:'100%'}}/>
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
             <KeyboardAvoidingView  keyboardVerticalOffset={10}  behavior={Platform.OS === "ios" ? "padding" : null}>
             <View style={styles.inputsContainer}>
            
             <View style={{flexDirection:'row',width:'90%',marginVertical:screen.width/72,alignItems:'center'}}>
                   <View style={{width:'50%'}}>
                    <Text style={{fontFamily:'poppins',fontSize:screen.width/30,color:'#323446',alignSelf:'flex-start'}}>{barber && barber.lang?polylanfr.ServiceType:polylanar.ServiceType}</Text>
                   </View>
                   <View style={{ width:'50%',borderWidth:1,paddingHorizontal:screen.width/30,borderRadius:screen.width/14.4,backgroundColor:Platform.OS==='android'?'#d3d3d3':'#323446',
                                  borderColor:'#d3d3d3',height:screen.width/8,justifyContent:'center',alignSelf:'center',shadowOpacity: 0.96,
                                  shadowOffset: {width: 0, height:2},shadowRadius: screen.width/36,elevation: 3,overflow:'hidden'}}>
                   { barber.sex === 'Homme' ? 
                    
                              (<RNPickerSelect
                                value={serviceType}
                                useNativeAndroidPickerStyle={false}
                                style={{ inputIOS:{fontFamily:'poppins',fontSize:screen.width/35,color:'#fff'},inputAndroid: {
                                  
                                  fontFamily:'poppins',
                                  color:'#323446',
                                  fontSize:screen.width/35
                                }}}
                               
                                placeholder={{label:barber && barber.lang?polylanfr.ServiceType:polylanar.ServiceType,value:null}}
                                onValueChange={itemValue => pickedMenServicesHandler(itemValue)}
                                doneText={barber && barber.lang?polylanfr.Cancel:polylanar.Cancel}
                                items={[
                                  { label: 'Tahfifa', value: 'Tahfifa'},
                                  { label: 'Barbe', value: 'Barbe' },
                                  { label: 'Suppléments', value: 'Suppléments' },
                                  { label: 'Soins', value: 'Soins' },
                              ]}
                              />) :
                             
                              <RNPickerSelect
                               value={serviceTypeWoman}
                               onValueChange={itemValue => pickedWomenServicesHandler(itemValue)}
                               useNativeAndroidPickerStyle={false}
                               style={{ inputIOS:{fontFamily:'poppins',fontSize:screen.width/35,color:'#fff'},inputAndroid: {
                                 
                                 fontFamily:'poppins',
                                 color:'#323446',
                                 fontSize:screen.width/35
                               }}}
                              
                               placeholder={{label:barber && barber.lang?polylanfr.ServiceType:polylanar.ServiceType,value:null}}
                            
                            items={[
                              { label: 'Coiffure', value: 'Coiffure'},
                              { label: 'Soins', value: 'Soins' },
                              { label: 'Mariage', value: 'Mariage' },
                              { label: 'Maquillage', value: 'Maquillage' },
                              { label: 'Manucure', value: 'Manucure'},
                              { label: 'Pédicure', value: 'Pédicure' },
                              { label: 'Epilation', value: 'Epilation' },
                          ]}
                               />
                              
                      }
                  </View>
                 </View>
                 <View style={{flexDirection:'row',width:'90%',marginVertical:screen.width/72,alignItems:'center'}}>
                   <View style={{width:'50%'}}>
                    <Text style={{fontFamily:'poppins',fontSize:screen.width/30,color:'#323446',alignSelf:'flex-start'}}>{barber && barber.lang?polylanfr.ServiceName:polylanar.ServiceName}</Text>
                   </View>
                  
                    <InputProfile
                        id="name" 
                        placeholder={barber && barber.lang?polylanfr.BeardTrace:polylanar.BeardTrace}
                        placeholderTextColor={Platform.OS==='android'? 'rgba(50,52,70,0.4)':'#d3d3d3'}
                        keyboardType="default"
                        onInputChange={inputChangeHandler}
                        initialValue={currentUserService?currentUserService.name:''}
                        initiallyValid={true}
                        required
                        minLength={3}
                        autoCapitalize='sentences'
                        widthView='50%'
                        backgroundColor={Platform.OS==='android'?'#d3d3d3':'#323446'}
                        height={screen.width/9}
                        /> 
                  
                 </View>


                 <View style={{flexDirection:'row',width:'90%',marginVertical:screen.width/72,alignItems:'center'}}>
                   <View style={{width:'50%'}}>
                    <Text style={{fontFamily:'poppins',fontSize:screen.width/30,color:'#323446',alignSelf:'flex-start'}}>{barber && barber.lang?polylanfr.Hours:polylanar.Hours}</Text>
                   </View>
                   <View style={{ width:'50%',borderWidth:1,paddingHorizontal:screen.width/30,borderRadius:screen.width/14.4,backgroundColor:Platform.OS==='android'?'#d3d3d3':'#323446',
                                  borderColor:hour!=='0'||minute!=='0'?'#d3d3d3':Colors.primary,height:screen.width/9,
                                  justifyContent:'center',alignSelf:'center',shadowOpacity: 0.96,
                                  shadowOffset: {width: 0, height:2},shadowRadius: screen.width/36,elevation: 3,overflow:'hidden'}}>
                           <RNPickerSelect
                              value={hour}
                              useNativeAndroidPickerStyle={false}
                              style={{ inputIOS:{fontFamily:'poppins',fontSize:screen.width/35,color:'#fff'},inputAndroid: {
                                
                                fontFamily:'poppins',
                                color:'#323446',
                                fontSize:screen.width/35
                              }}}
                             
                              placeholder={{label:barber && barber.lang?polylanfr.DurationH:polylanar.DurationH,value:null}}
                              onValueChange={itemValue => setHour(itemValue)}
                              doneText={barber && barber.lang?polylanfr.Cancel:polylanar.Cancel}
                              items={[
                                { label: '0', value: '0'},
                                { label: '1', value: '1' },
                                { label: '2', value: '2' },
                                { label: '3', value: '3'},
                                { label: '4', value: '4' },
                                { label: '5', value: '5' },
                                { label: '6', value: '6'},
                                { label: '7', value: '7' },
                                { label: '8', value: '8' },
                                { label: '9', value: '9'},
                                { label: '10', value: '10' }
                            ]}
                            />
                  </View>
                 </View>
                 
                 <View style={{flexDirection:'row',width:'90%',marginVertical:screen.width/72,alignItems:'center'}}>
                   <View style={{width:'50%'}}>
                    <Text style={{fontFamily:'poppins',fontSize:screen.width/30,color:'#323446',alignSelf:'flex-start'}}>{barber && barber.lang?polylanfr.Minutes:polylanar.Minutes}</Text>
                   </View>
                   <View style={{ width:'50%',borderWidth:1,paddingHorizontal:screen.width/30,borderRadius:screen.width/14.4,backgroundColor:Platform.OS==='android'?'#d3d3d3':'#323446',
                                  borderColor:hour!=='0'||minute!=='0'?'#d3d3d3':Colors.primary,height:screen.width/9,
                                  justifyContent:'center',alignSelf:'center',shadowOpacity: 0.96,shadowOffset: {width: 0, height:2},
                                  shadowRadius: screen.width/36,elevation: 3,overflow:'hidden'}}>
                   <RNPickerSelect
                              value={minute}
                              useNativeAndroidPickerStyle={false}
                              useNativeIOSPickerStyle={false}
                              style={{ inputIOS:{fontFamily:'poppins',fontSize:screen.width/35,color:'#fff'},inputAndroid: {
                                fontFamily:'poppins',
                                color:'#323446',
                                fontSize:screen.width/35
                              }}}
                              placeholder={{label:barber && barber.lang?polylanfr.DurationM:polylanar.DurationM,value:null}}
                              onValueChange={itemValue => setMinute(itemValue)}
                              doneText={barber && barber.lang?polylanfr.Cancel:polylanar.Cancel}
                              items={[
                                { label: '0', value: '0'},
                                { label: '5', value: '5' },
                                { label: '10', value: '10' },
                                { label: '15', value: '15'},
                                { label: '20', value: '20'},
                                { label: '25', value: '25'},
                                { label: '30', value: '30'},
                                { label: '35', value: '35'},
                                { label: '40', value: '40'},
                                { label: '45', value: '45'},
                                { label: '50', value: '50' },
                                { label: '55', value: '55' }
                            ]}
                            />
                  </View>
                 </View>
                 
                 <View style={{flexDirection:'row',width:'90%',marginVertical:screen.width/72,alignItems:'center'}}>
                   <View style={{width:'50%'}}>
                    <Text style={{fontFamily:'poppins',fontSize:screen.width/30,color:'#323446',alignSelf:'flex-start'}}>{barber && barber.lang?polylanfr.PriceIn:polylanar.PriceIn}</Text>
                   </View>
                   <InputProfile
                      id='price'
                      placeholder={barber && barber.lang?polylanfr.Example+': 1500':polylanar.Example+': 1500'}
                      keyboardType="phone-pad"
                      onInputChange={inputChangeHandler}
                      initialValue={currentUserService?currentUserService.price.toString():''}
                      initiallyValid={true}
                      required
                      placeholderTextColor={Platform.OS='android'?'rgba(50,52,70,0.4)':'#d3d3d3'}
                      widthView='50%'
                      backgroundColor={Platform.OS==='android'?'#d3d3d3':'#323446'}
                      height={screen.width/9}
                      inputStyle={{color:'white'}}
                    />
                 </View>
                 
             </View>
             </KeyboardAvoidingView>
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
                  />: <ActivityIndicator style={{marginBottom:screen.width/14.4}} color={Colors.primary}/> }
             </View>
          </View>
       
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
 height:'65%',
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
 height:'15%',
 width:'100%',
 justifyContent:'flex-end',
 paddingBottom:screen.width/18,
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