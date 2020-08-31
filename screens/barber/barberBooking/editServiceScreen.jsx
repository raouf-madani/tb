import React, {useState,useReducer,useEffect,useCallback} from 'react';
import { StyleSheet,View,KeyboardAvoidingView,Text,Image,Dimensions,TouchableWithoutFeedback,Keyboard,ActionSheetIOS, StatusBar,Picker,ActivityIndicator,Alert} from 'react-native';
import {Button } from 'react-native-elements';
import InputProfile from '../../../components/InputProfile';
import Colors from '../../../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import * as servicesActions from '../../../store/actions/serviceActions';
import { useDispatch,useSelector } from 'react-redux';

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
   console.log(barber);
   const currentUserService = barber.services.find(service => service.serviceId === currentServiceID); //get current service data
   

   //States for complex information textInputs
   const [hour,setHour] = useState(!currentServiceID?0:currentUserService.durationHour.toString());
   const hours = ['0','1','2','3','4','5','6','7','8','9','10','11','12'];
   const [minute,setMinute] = useState(!currentServiceID?0:currentUserService.durationMinute.toString());
   const minutes = ['0','5','10','15','20','25','30','35','40','45','50','55']; 
   const [error, setError] = useState();
   const [isLoading,setIsLoading]= useState(false);//ActivityIndicator handling
   const dispatch= useDispatch();
   
   //picker only iOS function 
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
 }

 //picker only iOS function 
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
}

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
      Alert.alert('Oups','Une erreur est survenue!',[{text:'OK'}]);
      console.log(error);
  } 
}, [error]); 

 //Submitting
 const submitHandler =async () => {
 
  try{
      if(!formState.formIsValid || ((hour==='0' && minute==='0') || (hour===0 && minute===0) || (hour==='0' && minute===0) || (hour===0 && minute==='0')) ){
          Alert.alert('Erreur!','Veuillez remplir les champs manquants svp!',[
              {text:'Ok'}
          ]);
          return;
      }
      console.log(hour);
      console.log(minute);
      const duration= parseInt(hour)*60 + parseInt(minute);
      console.log(duration);
       
      setError(null);
      setIsLoading(true);

         if(currentUserService){
           await dispatch(servicesActions.updateService(currentUserService.serviceId, 
                                                        formState.inputValues.name,
                                                        +formState.inputValues.price,
                                                        duration));
         }else{
          await dispatch(servicesActions.createService(
                                                        formState.inputValues.name,
                                                        +formState.inputValues.price,
                                                        duration,
                                                        barber.id));
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
      <KeyboardAvoidingView  keyboardVerticalOffset={10}>
         <StatusBar hidden />
          <View style={styles.backgroundContainer}>
            <Image source={barber.sex==='Femme'?require( '../../../assets/images/woman5.jpg'):require('../../../assets/images/loginimage.jpg')} style={{resizeMode:'cover',width:'100%',height:'100%'}}/>
          </View>
          <View style={styles.secondContainer}>
             <View style={styles.headerContainer}>
                   <View>
                     <Text style={{fontFamily:'poppins-bold',fontSize:13,color:'#323446'}}>Choisissez votre service</Text>
                   </View>
                   <View>
                     <Text style={{fontFamily:'poppins-bold',fontSize:13,color:'#fd6c57'}}>{'Total: '+ barber && currentUserService?currentUserService.price.toString()+' دج':'0 دج'}</Text>
                   </View>
             </View>

             <View style={styles.inputsContainer}>
                 <View style={{flexDirection:'row',width:'90%',marginVertical:5,alignItems:'center'}}>
                   <View style={{width:'50%'}}>
                    <Text style={{fontFamily:'poppins',fontSize:12,color:'#323446'}}>Nom de service</Text>
                   </View>
                  
                    <InputProfile
                        id="name" 
                        placeholder="Ex: Barbe"
                        placeholderTextColor='rgba(50,52,70,0.4)'
                        keyboardType="default"
                        onInputChange={inputChangeHandler}
                        initialValue={currentUserService?currentUserService.name:''}
                        initiallyValid={true}
                        required
                        minLength={3}
                        autoCapitalize='sentences'
                        widthView='50%'
                        backgroundColor='#d3d3d3'
                        height={40}
                        /> 
                  
                 </View>

                 <View style={{flexDirection:'row',width:'90%',marginVertical:5,alignItems:'center'}}>
                   <View style={{width:'50%'}}>
                    <Text style={{fontFamily:'poppins',fontSize:12,color:'#323446'}}>Heures</Text>
                   </View>
                   <View style={{ width:'50%',borderWidth:1,paddingHorizontal:12,borderRadius:25,backgroundColor:'#d3d3d3',
                                  borderColor:hour!=='0'||minute!=='0'?'#d3d3d3':Colors.primary,height:45,
                                  justifyContent:'center',alignSelf:'center'}}>
                   {Platform.OS === 'android' ? 
                              <Picker
                              selectedValue={hour}
                              onValueChange={itemValue => setHour(itemValue)}
                              style={{fontFamily:'poppins',fontSize:12,color:'#323446'}}
                              >
                              {hours.map(el=> <Picker.Item label={el} value={el} key={el} />)}
                              </Picker> :
                              <Text onPress={onPress} style={{fontFamily:'poppins',fontSize:12,color:'#323446'}}>
                                {hour}
                              </Text>} 
                  </View>
                 </View>
                 
                 <View style={{flexDirection:'row',width:'90%',marginVertical:5,alignItems:'center'}}>
                   <View style={{width:'50%'}}>
                    <Text style={{fontFamily:'poppins',fontSize:12,color:'#323446'}}>Minutes</Text>
                   </View>
                   <View style={{ width:'50%',borderWidth:1,paddingHorizontal:12,borderRadius:25,backgroundColor:'#d3d3d3',
                                  borderColor:hour!=='0'||minute!=='0'?'#d3d3d3':Colors.primary,height:45,
                                  justifyContent:'center',alignSelf:'center'}}>
                   {Platform.OS === 'android' ? 
                              <Picker
                              selectedValue={minute}
                              onValueChange={itemValue => setMinute(itemValue)}
                              style={{fontFamily:'poppins',fontSize:12,color:'#323446'}}
                              >
                              {minutes.map(el=> <Picker.Item label={el} value={el} key={el} />)}
                              </Picker> :
                              <Text onPress={onPressMinute} style={{fontFamily:'poppins',fontSize:12,color:'#323446'}}>
                                {minute}
                              </Text>} 
                  </View>
                 </View>

                 <View style={{flexDirection:'row',width:'90%',marginVertical:5,alignItems:'center'}}>
                   <View style={{width:'50%'}}>
                    <Text style={{fontFamily:'poppins',fontSize:12,color:'#323446'}}>Prix en دج</Text>
                   </View>
                   <InputProfile
                      id='price'
                      placeholder='Ex: 1500'
                      keyboardType="phone-pad"
                      onInputChange={inputChangeHandler}
                      initialValue={currentUserService?currentUserService.price.toString():''}
                      initiallyValid={true}
                      required
                      placeholderTextColor='rgba(50,52,70,0.4)'
                      style={{height:20}}
                      widthView='50%'
                      backgroundColor='#d3d3d3'
                      height={40}
                    />
                 </View>
             </View>
             <View style={styles.footerContainer}>
                 {!isLoading ?<Button
                    theme={{colors: {primary:'#fd6c57'}}} 
                    title={currentUserService?"Modifier":"Ajouter"}
                    titleStyle={styles.labelButton}
                    buttonStyle={styles.buttonStyle}
                    ViewComponent={LinearGradient} 
                    onPress={submitHandler}
                    linearGradientProps={{
                        colors: ['#fd6d57', '#fd9054'],
                        start: {x: 0, y: 0} ,
                        end:{x: 1, y: 0}
                        
                    }}
                  />: <ActivityIndicator color={Colors.primary}/>}
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
              marginTop:5
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
  height:'30%'
},
secondContainer:{
 height:'70%',
 width:'100%',
 backgroundColor:'#fff',
 borderTopLeftRadius:30,
 borderTopRightRadius:30,
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
 height:'55%',
 width:'100%',
 alignItems:'center',
},
inputContainer:{
 width:'50%',
 borderWidth:1,
 borderRadius:20,
 backgroundColor:'#d3d3d3',
 borderColor:'#d3d3d3'
},
footerContainer:{
 height:'25%',
 width:'100%',
},
labelButton:{
 color:'#FFF',
 fontFamily:'poppins',
 fontSize:16,
 textTransform:null,
},
buttonStyle:{
 borderColor:'#fd6c57',
 width:'90%',
 borderRadius:20,
 height:40,
 alignSelf:'center',
 marginTop:10
}
});

export default EditServiceScreen;