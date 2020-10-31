import React,{useState,useCallback,useReducer,useRef} from 'react';
import { StyleSheet,View,KeyboardAvoidingView,TouchableWithoutFeedback,Keyboard,Text,Image,Dimensions,StatusBar,Alert,ActivityIndicator,TextInput} from 'react-native';
import {MaterialIcons,MaterialCommunityIcons} from "@expo/vector-icons";
import {Button } from 'react-native-elements';
import Colors from '../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import CustomInput from '../components/Input';
import * as FirebaseRecaptcha from "expo-firebase-recaptcha";
import * as firebase from "firebase";
import Firebaseconfig from '../helpers/Firebaseconfig';

//responsivity (Dimensions get method)
const screen = Dimensions.get('window');

//Firebase config
try {
  if (Firebaseconfig.apiKey) {
    firebase.initializeApp(Firebaseconfig);
    console.log(Firebaseconfig);
  }
} catch (err) {
  // ignore app already initialized error on snack
}

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

const ForgotPasswordScreen = props =>{

  

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///Input management
//Press verifyNumber Button handling ==> Verification


const recaptchaVerifier = useRef(null);
const [verificationId, setVerificationId] = useState('');
const [verifyInProgress, setVerifyInProgress] = useState(false);
const [verificationCode, setVerificationCode] = useState("");
const [confirmError, setConfirmError] = useState(false);
const [confirmInProgress, setConfirmInProgress] = useState(false);
const prefix='+213';


const[formState,disaptchFormState] = useReducer(formReducer,
    {inputValues:{
      phone: '',
      password:''
    },
     inputValidities:{
       phone:false,
       password:false
     },
     formIsValid:false});


const inputChangeHandler = useCallback((inputIdentifier, inputValue,inputValidity) =>{

disaptchFormState({type:Form_Input_Update,value:inputValue,isValid:inputValidity,inputID:inputIdentifier});
},[disaptchFormState]);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////



const verifyNumber = async ()=>{

  const phoneProvider = new firebase.auth.PhoneAuthProvider();

    if(formState.inputValidities.phone && formState.inputValues.phone){
        try{
        
       
        setVerifyInProgress(true);
        const result = await fetch(`http://173.212.234.137:3000/phone/${prefix+formState.inputValues.phone}`);
        const resData= await result.json();
     
        setVerifyInProgress(false);
                                                
        if(resData.userRecord.phoneNumber === prefix+formState.inputValues.phone){
         
              //if User is new (doesnt Exist), Recaptcha starts
          setVerifyInProgress(true);
          setVerificationId('');
          const verificationId = await phoneProvider.verifyPhoneNumber(
            prefix+formState.inputValues.phone,
            // @ts-ignore
            recaptchaVerifier.current
          );
        
        setVerifyInProgress(false);
        setVerificationId(verificationId);
        }else{
            Alert.alert('Erreur!','Ce numéro de téléphone n\'existe pas. Veuillez créer un nouveau compte svp!',[{text:"OK"}]);
        }
        
        }catch(error){
        console.log(error);
        Alert.alert('Oups!','Une erreur est survenue.',[{text:"OK"}]);
        setVerifyInProgress(false);
        }
    }else{
        Alert.alert('Erreur!','Numéro de téléphone invalide.',[{text:"OK"}]);
    } 
    
    };

    const sendCode = async () => {
      try {
        setConfirmError(undefined);
        setConfirmInProgress(true);
        const credential = firebase.auth.PhoneAuthProvider.credential(
          verificationId,
          verificationCode
        );
        
         await firebase.auth().signInWithCredential(credential);
       
        setConfirmInProgress(false);
       
        setVerificationId("");
        setVerificationCode("");

        props.navigation.navigate('EditPassword',{phoneNumber:formState.inputValues.phone});
    
      } catch (err) {
            setConfirmError(err);
            Alert.alert('Oups!','Une erreur est survenue.',[{text:"OK"}]);
            console.log(err);
            setConfirmInProgress(false);
           
      }
      
    };
          


    return(
      <TouchableWithoutFeedback onPress = {()=>{Keyboard.dismiss()}}>
      <View style={styles.container}>
       <KeyboardAvoidingView  keyboardVerticalOffset={10}>
         <StatusBar hidden />
         <FirebaseRecaptcha.FirebaseRecaptchaVerifierModal
                ref={recaptchaVerifier}
                firebaseConfig={Firebaseconfig}
                title='Prouvez que vous êtes humain!'
                cancelLabel='Fermer'
              />
          <View style={styles.backgroundContainer}>
            <Image source={{uri:'http://173.212.234.137/assets/tahfifabarber/loginimage.jpg'}} style={{resizeMode:'cover',width:'100%',height:'100%'}}/>
          </View>
          <View style={styles.secondContainer}>
             <View style={styles.logoContainer}>
                 <Image source={{uri:'http://173.212.234.137/assets/tahfifabarber/logo.png'}} style={styles.logo}/>
                 <Text style={styles.callToAction}>Exercez votre métier et gagnez plus d'argent</Text>
             </View>
             {!verificationId ? (<View style={styles.inputsContainer}>
                  <CustomInput
                    id={'phone'}
                    rightIcon={<MaterialIcons title = "phone" name ='phone' color='#323446' size={23} />}
                    leftIcon={<View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-around',borderRightWidth:1,borderRightColor:Colors.blue,paddingRight:5}}><Image source={{uri:'http://173.212.234.137/assets/tahfifabarber/algeriaFlag.png'}} style={{width:24,height:28,marginRight:5}}></Image><Text style={styles.phoneNumber}>+213</Text></View>}
                    placeholder='555555555'
                    keyboardType="phone-pad"
                    returnKeyType="next"
                    onInputChange={inputChangeHandler}
                    initialValue=''
                    initiallyValid={true}
                    phone
                    required
                    placeholderTextColor='rgba(50,52,70,0.4)'
                    inputStyle={{fontSize:15}}
                    editable={!verificationId}
                  />
                 
                 <Button
                    theme={{colors: {primary:'#fd6c57'}}} 
                    title="Vérifier"
                    titleStyle={styles.labelButton}
                    buttonStyle={styles.buttonStyle}
                    ViewComponent={LinearGradient} 
                    onPress={verifyNumber}
                    linearGradientProps={{
                        colors: ['#fd6d57', '#fd9054'],
                        start: {x: 0, y: 0} ,
                        end:{x: 1, y: 0}
                        
                    }}
                  />
                   {verifyInProgress && <ActivityIndicator color={Colors.primary} style={styles.loader} />}
              </View>): 
              (<View style={styles.inputsContainer}>
              <View style={{width:'100%',borderWidth:1, borderRadius:25,backgroundColor:'#d3d3d3',borderColor:confirmError?Colors.primary:'#d3d3d3',marginVertical:3,height:45,alignItems:'center',justifyContent:'center'}}>
                <TextInput
                        placeholder='Entrez les 6 chiffres'
                        keyboardType='number-pad'
                        autoCapitalize='none'
                        returnKeyType="next"
                        onChangeText={verificationCode=>setVerificationCode(verificationCode)}
                        placeholderTextColor='rgba(50,52,70,0.4)'
                        style={{color:'#323446',width:'90%'}}
                      />
              </View>
              <View style={styles.cofirmResendContainer}>
                <Button
                  theme={{colors: {primary:'#fd6c57'}}} 
                  title="Confirmer"
                  titleStyle={styles.labelButton}
                  buttonStyle={styles.confirmedButtonStyle}
                  onPress={sendCode}
                  ViewComponent={LinearGradient} 
                  linearGradientProps={{
                      colors: ['#fd6d57', '#fd9054'],
                      start: {x: 0, y: 0} ,
                      end:{x: 1, y: 0}
                      
                  }}
                />
                <Button
                  theme={{colors: {primary:'#fd6c57'}}} 
                  title="Renvoyer"
                  titleStyle={styles.labelButton}
                  buttonStyle={styles.confirmedButtonStyle}
                  onPress={verifyNumber}
                  ViewComponent={LinearGradient} 
                  linearGradientProps={{
                      colors: ['#fd6d57', '#fd9054'],
                      start: {x: 0, y: 0} ,
                      end:{x: 1, y: 0}
                      
                  }}
                />
              </View>
              {confirmError && (<Text style={styles.confirmErrorText}>Erreur: code erroné!</Text>)}
                {confirmInProgress ? <ActivityIndicator color={Colors.primary} style={styles.loader} />:<Text style={styles.smsText}>Un code de 6 chiffres a été envoyé sur votre SMS</Text>}

              </View>)} 
             
             
             
            <View style={styles.signupContainer}>
                <Text style={{color:!verificationId ?Colors.primary:'#A8A8A8',fontFamily:'poppins',fontSize:12,alignSelf:'center',}}>1- Vérifiez votre numéro de téléphone.</Text>
                <Text style={{color:verificationId?Colors.primary:Colors.blue,fontFamily:'poppins',fontSize:12,alignSelf:'center',}}>2- Entrez le code sms.</Text>
                <Text style={{color:Colors.blue,fontFamily:'poppins',fontSize:12,alignSelf:'center',}}>3- Réinitialisez votre mot de passe.</Text>
            </View>
                  
             
          </View>
       </KeyboardAvoidingView> 
     </View>
     </TouchableWithoutFeedback>
     );    
};

ForgotPasswordScreen.navigationOptions= ()=>{
  return {
    headerTransparent : true ,
    headerStyle:{
        backgroundColor: 'white'
    },
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
    headerTintColor: '#fff',
  
  };
}

const styles= StyleSheet.create({
 container:{
    flex: 1,
    backgroundColor: 'black',
    width:'100%'
   },
   backgroundContainer:{
     height:'35%',
  },
  secondContainer:{
    height:'65%',
    width:'100%',
    backgroundColor:'#fff',
    borderTopLeftRadius:30,
    borderTopRightRadius:30,
    overflow:'hidden'
  },
  logoContainer:{
    height:'25%',
    width:'100%',
    justifyContent:'center',
    alignItems:'center'
  },
  logo:{
    width:180,
    height:42,
    marginVertical:10
  },
  callToAction:{
    fontSize:13,
    fontFamily:'poppins',
    color:'#323446'
  },
  inputsContainer:{
    height:'55%',
    width:'90%',
    justifyContent:'center',
    alignSelf:'center'
  },
  inputPhoneContainer:{
    width:'90%',
    borderWidth:1,
    borderRadius:25,
    backgroundColor:'#d3d3d3',
    borderColor:'#d3d3d3',
    height:45
  },
  input:{
    borderBottomWidth:0,
    paddingHorizontal:10
  },
  inputPasswordContainer:{
    width:'90%',
    borderWidth:1,
    borderRadius:25,
    height:50,
    marginTop:10,
    backgroundColor:'#d3d3d3',
    borderColor:'#d3d3d3'
  },
  labelButton:{
    color:'#FFF',
    fontFamily:'poppins',
    fontSize:16,
    textTransform:null,
   },
   buttonStyle:{
    borderColor:'#fd6c57',
    width:'100%',
    borderRadius:20,
    height:45,
    alignSelf:'center',
    marginTop:15
   },
  signupContainer:{
    alignSelf:'center',
    height:'20%',
    
  },
  loader: {
    marginTop: 10,
  },
  cofirmResendContainer:{
    flexDirection:'row',
    justifyContent:'space-around',
    alignItems:'center',
    width:'100%',
    marginTop:15
  },
  confirmedButtonStyle:{
    borderColor:'#fd6c57',
    width:'80%',
    borderRadius:20,
    height:45,
    alignSelf:'center',
    marginTop:3
   },
   confirmErrorText:{
    color:Colors.primary,
    fontSize:13,
    alignSelf:'center'
  },
  smsText:{
    color:Colors.blue,
    fontSize:11,
    paddingTop:10,
    alignSelf:'center',
    fontFamily:'poppins-bold'
  },
});

export default ForgotPasswordScreen;