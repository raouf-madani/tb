import React,{useState,useReducer,useCallback,useEffect} from 'react';
import {StyleSheet,View,AsyncStorage,ScrollView,ImageBackground,TouchableWithoutFeedback,Keyboard,TouchableOpacity,Text,Image,Alert,KeyboardAvoidingView,Dimensions,ActivityIndicator,Platform} from 'react-native';
import {MaterialIcons,MaterialCommunityIcons} from "@expo/vector-icons";
import {Button} from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import polylanar from "../../../lang/ar";
import polylanfr from "../../../lang/fr";
import Colors from '../../../constants/Colors';
import {useSelector,useDispatch} from 'react-redux';
import InputProfile from '../../../components/InputProfile';
import * as barberActions from '../../../store/actions/barberActions';
import * as authActions from '../../../store/actions/authActions';
import * as Crypto from 'expo-crypto';

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


const BarberParametersScreen = props =>{

  //use Dispatch to dispatch our action
  const dispatch= useDispatch();
  const barberUID= props.navigation.getParam('barberUID');
  const barberID=props.navigation.getParam('barberID');

  const [isPhone,setIsPhone]= useState(true);
  const [isPassword,setIsPassword]= useState(false);
  const [isLang,setIsLang]= useState(false);
  let isArabic;
  const [isEye,setIsEye]=useState(false);
  const [error,setError]=useState(false);
  const [isLoadingState,setIsLoadingState]= useState(false);

  const getBarber=useCallback(async()=>{
    try{
      setError(false);
      setIsLoadingState(true);
      await dispatch(barberActions.setBarber(barberID));
      setIsLoadingState(false);
      }catch(err){
        setError(true);
        throw err; 
      }
  },[dispatch,setError]);
  
    useEffect(()=>{
    getBarber();
    
    },[dispatch,getBarber,setError]);


      const eye=()=>{
        setIsEye(prevValue=>!prevValue);
      };
  

  const phone = ()=>{
    setIsPhone(true);
    setIsPassword(false);
    setIsLang(false);
  };
  const password = ()=>{
    setIsPhone(false);
    setIsPassword(true);
    setIsLang(false);
  };
  const lang= ()=>{
    setIsLang(true);
    setIsPhone(false);
    setIsPassword(false);
  };

  
  //get the barber's data
  const barber= useSelector(state=>state.barbers.barber);
  console.log('value is '+barber[0].lang);

  const arabic= async()=>{
     
     try{
        if(barber[0].lang){
           isArabic = false;
        }else{
          isArabic = true;
       }
        setIsLoadingState(true);
        setError(false);
       
        console.log(isArabic);
        await dispatch(barberActions.updateBarberLang(barberID,isArabic));
        setIsLoadingState(false); 
                               
        Alert.alert(barber && barber[0].lang?polylanar.Congratulations:polylanfr.Congratulations,barber && barber[0].lang?polylanar.SuccessLanguageMessage:polylanfr.SuccessLanguageMessage,[{text:barber && barber[0].lang?polylanfr.OK:polylanar.OK}]);
  
    }catch(err){
      console.log(err);
      setError(true);
      if(error){
        Alert.alert(barber && barber[0].lang?polylanfr.Oups:polylanar.Oups,barber && barber[0].lang?polylanfr.WeakInternet:polylanar.WeakInternet,[{text:barber && barber[0].lang?polylanfr.OK:polylanar.OK}]);
       }
       throw err;
    }
  };

  const alertEditLang = ()=>{
    Alert.alert(
      barber && barber[0].lang?polylanfr.Warning:polylanar.Warning,
      barber && barber[0].lang?polylanfr.DoYouWantToChangeYourLanguage:polylanar.DoYouWantToChangeYourLanguage,
     [{text:barber && barber[0].lang?polylanfr.Yes:polylanar.Yes, style:'destructive', onPress:arabic},
      {text:barber && barber[0].lang?polylanfr.No:polylanar.No, style:'cancel'}]);
      return;
  };

   
  //State for update loading 
  const [isLoading,setIsLoading]= useState(false);
  const [isLoadingPassword,setIsLoadingPassword]=useState(false);
  const prefix='+213';

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////Input Management
const[formState,disaptchFormState] = useReducer(formReducer,
  {inputValues:{
    phone:barber[0]?barber[0].phone:'',
    password:''
  },
  inputValidities:{
   phone:true,
   password:false
  },
  formIsValid:false});

const inputChangeHandler = useCallback((inputIdentifier, inputValue,inputValidity) =>{
disaptchFormState({type:Form_Input_Update,value:inputValue,isValid:inputValidity,inputID:inputIdentifier});

},[disaptchFormState]);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Update barber's phone after pressing in edit text
const editPhone=async()=>{
  if(formState.inputValidities.phone){
      try{
          if(prefix+formState.inputValues.phone === barber[0].phone){
            Alert.alert(barber && barber[0].lang?polylanfr.Error:polylanar.Error,barber && barber[0].lang?polylanfr.SameNumberMessage:polylanar.SameNumberMessage,[{text:barber && barber[0].lang?polylanfr.Repeat:polylanar.Repeat}]);
            return;
          }
          setIsLoading(true);
          await dispatch(barberActions.updateBarberPhone(formState.inputValues.phone,prefix+formState.inputValues.phone,
                                                 barber[0].id));
          await dispatch(authActions.updateUserPhoneFRB(prefix+formState.inputValues.phone,barberUID));                                       
          setIsLoading(false);
          dispatch(authActions.logout());
          AsyncStorage.clear();
          props.navigation.navigate('Auth');                        
          Alert.alert(barber && barber[0].lang?polylanfr.Congratulations:polylanar.Congratulations,barber && barber[0].lang?polylanfr.SameNumberMessage:polylanar.SameNumberMessage,[{text:barber && barber[0].lang?polylanfr.OK:polylanar.OK}]);
    
      }catch(err){
        console.log(err);
        Alert.alert(barber && barber[0].lang?polylanfr.Oups:polylanar.Oups,barber && barber[0].lang?polylanfr.WeakInternet:polylanar.WeakInternet,[{text:barber && barber[0].lang?polylanfr.OK:polylanar.OK}]);
      }
      
      }else{
        Alert.alert(barber && barber[0].lang?polylanfr.Error:polylanar.Error,barber && barber[0].lang?polylanfr.EmptyField:polylanar.EmptyField,[{text:barber && barber[0].lang?polylanfr.OK:polylanar.OK}]);
      }

};

const alertEditPhone = ()=>{
  Alert.alert(
    barber && barber[0].lang?polylanfr.Warning:polylanar.Warning,
    barber && barber[0].lang?polylanfr.DoYouWantToChangeYourPhone:polylanar.DoYouWantToChangeYourPhone,
   [{text:barber && barber[0].lang?polylanfr.Yes:polylanar.Yes, style:'destructive', onPress:editPhone},
    {text:barber && barber[0].lang?polylanfr.No:polylanar.No, style:'cancel'}]);
    return;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Update barber's password after pressing in edit text
const editPassword=async()=>{
  if(formState.inputValidities.password){
      try{
          
          const hashedPassword = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA512,
            formState.inputValues.password
          );
          if(hashedPassword === barber[0].password){
            Alert.alert(barber && barber[0].lang?polylanfr.Error:polylanar.Error,barber && barber[0].lang?polylanfr.SamePassword:polylanar.SamePassword,[{text:barber && barber[0].lang?polylanfr.Repeat:polylanar.Repeat}]);
            return;
          }
          setIsLoadingPassword(true);
          await dispatch(barberActions.updateBarberPassword(barber[0].id,hashedPassword));                                   
          setIsLoadingPassword(false);
          dispatch(authActions.logout());
          AsyncStorage.clear();
          props.navigation.navigate('Auth');                        
          Alert.alert(barber && barber[0].lang?polylanfr.Congratulations:polylanar.Congratulations,barber && barber[0].lang?polylanfr.SuccessNewPasswordMessage:polylanar.SuccessNewPasswordMessage,[{text:barber && barber[0].lang?polylanfr.OK:polylanar.OK}]);
    
      }catch(err){
        console.log(err);
        Alert.alert(barber && barber[0].lang?polylanfr.Oups:polylanar.Oups,barber && barber[0].lang?polylanfr.WeakInternet:polylanar.WeakInternet,[{text:barber && barber[0].lang?polylanfr.OK:polylanar.OK}]);
      }
      
      }else{
        Alert.alert(barber && barber[0].lang?polylanfr.Error:polylanar.Error,barber && barber[0].lang?polylanfr.EmptyField:polylanar.EmptyField,[{text:barber && barber[0].lang?polylanfr.OK:polylanar.OK}]);
      }

};
  
const alertEditPassword = ()=>{
  Alert.alert(
    barber && barber[0].lang?polylanfr.Warning:polylanar.Warning,
    barber && barber[0].lang?polylanfr.ChangeYourPassword:polylanar.ChangeYourPassword,
   [{text:barber && barber[0].lang?polylanfr.Yes:polylanar.Yes, style:'destructive', onPress:editPassword},
    {text:barber && barber[0].lang?polylanfr.No:polylanar.No, style:'cancel'}]);
    return;
};
if(error){
      
  return ( <ImageBackground source={require('../../../assets/images/support.png')} style={styles.coverTwo}>
              <View style={{marginBottom:10,alignSelf:'center'}}>
                <Text style={styles.noServicesText}>{barber && barber[0].lang?polylanfr.WeakInternet:polylanar.WeakInternet}</Text>
              </View>
              <Button
                theme={{colors: {primary:'#fd6c57'}}} 
                title="Réessayer"
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
if(isLoadingState || barber===undefined){
      
  return ( <ImageBackground source={require('../../../assets/images/support.png')} style={styles.coverTwo}>
              <ActivityIndicator size='large' color={Colors.primary} />
           </ImageBackground>)
};

    return(
      <TouchableWithoutFeedback onPress = {()=>Keyboard.dismiss()}>
      <View style={styles.container}>
         <View style={styles.firstCard}>
          <ImageBackground source={barber[0].sex==='Femme'?require( '../../../assets/images/woman5.jpg'):require('../../../assets/images/loginimage.jpg')} style={styles.backgroundFirstCard} resizeMode='cover'/>
         </View>
         <View style={styles.menuContainer}>
              <TouchableOpacity onPress={phone} style={{padding:5,width:'30%',backgroundColor:isPhone?'#fd6c57':'#fff',alignItems:'center',justifyContent:'center'}}>
                <Text style={{color:isPhone?'#fff':'#fd6c57',fontFamily:'poppins'}}>
                  {barber && barber[0].lang? polylanfr.Phone:polylanar.Phone}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={password} style={{borderRightWidth:1,borderRightColor:'#fd6c57',borderLeftWidth:1,borderLeftColor:'#fd6c57',padding:5,width:'40%',backgroundColor:isPassword?'#fd6c57':'#fff',alignItems:'center',justifyContent:'center'}}>
                  <Text style={{color:isPassword?'#fff':'#fd6c57',fontFamily:'poppins'}}>
                    {barber && barber[0].lang?polylanfr.Password:polylanar.Password}
                  </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={lang} style={{padding:5,width:'30%',backgroundColor:isLang?'#fd6c57':'#fff',alignItems:'center',justifyContent:'center'}}>
                  <Text style={{color:isLang?'#fff':'#fd6c57',fontFamily:'poppins'}}>
                    {barber && barber[0].lang?polylanfr.Languages:polylanar.Languages}
                  </Text>
              </TouchableOpacity>
        </View>
        {isPhone?(<ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <KeyboardAvoidingView keyboardVerticalOffset={10}>
              <InputProfile
              id='phone'
              rightIcon={<MaterialIcons title="phone" name ='phone' color={Platform.OS==='android'?'#323446':'#fff'} size={23} />}
              leftIcon={<View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-around',borderRightWidth:1,borderRightColor:Platform.OS==='android'?'#323446':'#fff',paddingRight:5}}><Image source={require('../../../assets/images/algeriaFlag.png')} style={{width:24,height:28,marginRight:5}}></Image><Text style={styles.phoneNumber}>+213</Text></View>}
              placeholder='555555555'
              keyboardType="phone-pad"
              returnKeyType="next"
              onInputChange={inputChangeHandler}
              initialValue={barber[0]?barber[0].id:''}
              initiallyValid={true}
              phone
              required
              placeholderTextColor={Platform.OS==='android'?'rgba(50,52,70,0.4)':'#f9f9f9'}
              widthView='80%'
              backgroundColor={Platform.OS==='android'?'#fff':Colors.blue}
              height={50}
              />
              <View style={styles.buttonContainer}>
              {!isLoading ?<Button
                    theme={{colors: {primary:'#fd6c57'}}} 
                    title={barber && barber[0].lang?polylanfr.Register:polylanar.Register}
                    titleStyle={styles.labelButton}
                    buttonStyle={styles.buttonStyle}
                    ViewComponent={LinearGradient} 
                    onPress={alertEditPhone}
                    linearGradientProps={{
                        colors: ['#fd6d57', '#fd9054'],
                        start: {x: 0, y: 0} ,
                        end:{x: 1, y: 0}
                        
                    }}
                />:
                <ActivityIndicator color={Colors.primary} />}
           </View>
           </KeyboardAvoidingView>
        </ScrollView>):undefined}
        {isPassword?(<ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <KeyboardAvoidingView keyboardVerticalOffset={10}>
                <InputProfile
                id='password'
                rightIcon={<MaterialCommunityIcons title="lock" onPress={eye} name ={!isEye?'eye':'eye-off'} color={Platform.OS==='android'?'#323446':'#fff'} size={23} />}
                placeholder={barber && barber[0].lang?polylanfr.NewPassword:polylanar.NewPassword}
                keyboardType="default"
                returnKeyType="next"
                secureTextEntry={!isEye?true:false}
                minLength={6}
                autoCapitalize='none'
                onInputChange={inputChangeHandler}
                initialValue=''
                initiallyValid={true}
                required
                placeholderTextColor={Platform.OS==='android'?'rgba(50,52,70,0.4)':'#f9f9f9'}
                inputStyle={{fontSize:15}}
                widthView='80%'
                backgroundColor={Platform.OS==='android'?'#fff':Colors.blue}
                height={50}
              />
              <View style={styles.buttonContainer}>
              {!isLoadingPassword ?<Button
                    theme={{colors: {primary:'#fd6c57'}}} 
                    title={isArabic?polylanfr.Register:polylanar.Register}
                    titleStyle={styles.labelButton}
                    buttonStyle={styles.buttonStyle}
                    ViewComponent={LinearGradient} 
                    onPress={alertEditPassword}
                    linearGradientProps={{
                        colors: ['#fd6d57', '#fd9054'],
                        start: {x: 0, y: 0} ,
                        end:{x: 1, y: 0}
                        
                    }}
                />:
                <ActivityIndicator color={Colors.primary} />}
           </View>
           </KeyboardAvoidingView>
        </ScrollView>):undefined}
        {isLang?(<ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <KeyboardAvoidingView keyboardVerticalOffset={10}>
            <View style={styles.langContainer}>
              {barber && barber[0].lang?(<View style={styles.langRow}>
                <Text style={{fontFamily:'poppins',fontSize:15,color:Platform.OS==='android'?Colors.blue:'#fff'}}>Français</Text>
                <Image source={require('../../../assets/images/france.png')} style={{width:24,height:24}}/>
              </View>):(<View style={styles.langRow}>
                <Text style={{fontFamily:'poppins',fontSize:15,color:Platform.OS==='android'?Colors.blue:'#fff'}}>العربية</Text>
                <Image source={require('../../../assets/images/algeria.png')} style={{width:24,height:24}}/>
              </View>)}
            </View>
            <View style={styles.buttonContainer}>
           
               <Button
                    theme={{colors: {primary:'#fd6c57'}}} 
                    title={barber && barber[0].lang?polylanfr.Change:polylanar.Change}
                    titleStyle={styles.labelButton}
                    buttonStyle={styles.buttonStyle}
                    ViewComponent={LinearGradient}
                    linearGradientProps={{
                        colors: ['#fd6d57', '#fd9054'],
                        start: {x: 0, y: 0} ,
                        end:{x: 1, y: 0}
                        
                    }}
                    onPress={alertEditLang}
                />
           </View>
           </KeyboardAvoidingView>
        </ScrollView>):undefined}
        
      </View>
      </TouchableWithoutFeedback>
     );    
};

BarberParametersScreen.navigationOptions= navData => {
    
     return {
      title:'Paramètres',
      headerTransparent : true ,
      headerBackTitle : " ",
      headerTintColor: '#fff',
      headerTitleStyle:{
        fontFamily:'poppins-bold',
        marginTop:5,
      },
      
     
     };
 
  };


const styles= StyleSheet.create({
   container:{
    flex:1,
    backgroundColor:'white',
    width:'100%',
    alignItems:'center'
   },
   firstCard:{
    width:'95%',
    height:'40%',
    borderTopLeftRadius:30,
    borderTopRightRadius:30,
    shadowColor: 'black',
    shadowOpacity: 0.96,
    shadowOffset: {width: 0, height:2},
    shadowRadius: 10,
    elevation: 5,
    backgroundColor:'red'
   },
   backgroundFirstCard:{
     width:'100%',
     height:'100%',
     alignItems:'center',
   },
  menuContainer:{
    marginTop:25,
    width:'90%',
    backgroundColor:'#f9f9f9',
    borderRadius:5,
    borderColor:'#fd6c57',
    borderWidth:1,
    flexDirection:'row',
    alignSelf:'center',
    overflow:'hidden'
  },
  langContainer:{
    width:'80%',
    borderWidth:1,
    borderRadius:20,
    backgroundColor:Platform.OS==='android'?'#fff':Colors.blue,
    borderColor:Platform.OS==='android'?'#fff':Colors.blue,
    marginVertical:5,
    alignSelf:'center',
    shadowColor: 'black',
    shadowOpacity: 0.96,
    shadowOffset: {width: 0, height:2},
    shadowRadius: 10,
    elevation: 3,
    overflow:'hidden',
    
  },
  langRow:{
    flexDirection:'row',
    justifyContent:'space-between',
    width:'100%',
    paddingVertical:10,
    paddingHorizontal:15,
    alignItems:'center'
  },
  scrollView:{
    width:'100%',
    marginTop:80
  },
  buttonContainer:{
    width:'90%',
    alignSelf:'center',
    marginVertical:20,
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
  height:40,
  alignSelf:'center'
 },
 phoneNumber:{
 color:Platform.OS==='android'?'#323446':'#fff',
 fontSize:15
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
}
});

export default BarberParametersScreen;