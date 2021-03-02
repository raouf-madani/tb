import React,{useState,useCallback,useRef,useReducer} from 'react';
import { StyleSheet,View,KeyboardAvoidingView,TouchableWithoutFeedback,Keyboard,Text,Image,ImageBackground,StatusBar,TextInput,TouchableOpacity,ActionSheetIOS,Alert,ActivityIndicator,AsyncStorage,Dimensions,Platform} from 'react-native';
import {Button} from 'react-native-elements';
import Colors from '../../constants/Colors';
import {MaterialIcons,MaterialCommunityIcons,Ionicons} from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import * as FirebaseRecaptcha from "expo-firebase-recaptcha";
import * as firebase from "firebase";
import Firebaseconfig from '../../helpers/Firebaseconfig';
import * as barberActions from '../../store/actions/barberActions';
import * as worktimeActions from '../../store/actions/worktimeActions';
import * as portfolioActions from '../../store/actions/portfolioActions';
import {useDispatch} from 'react-redux';
import * as Crypto from 'expo-crypto'; 
import CustomInput from '../../components/Input';
import RNPickerSelect from 'react-native-picker-select';


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

const SignupBarberScreen = props =>{

    //States for recaptcha and auth handling
    const recaptchaVerifier = useRef(null);
    const [verificationId, setVerificationId] = useState('');
    const [verifyInProgress, setVerifyInProgress] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
    const [confirmError, setConfirmError] = useState(false);
    const [confirmInProgress, setConfirmInProgress] = useState(false);
    const dispatch = useDispatch();
    const prefix='+213';
    
     //States for complex information textInputs
     const [wilaya,setWilaya] = useState(undefined);
     const [sex,setSex] = useState(undefined);
     const [isEye,setIsEye]=useState(false);
     const wilayas = ['Wilaya','Alger','Blida'];
     const sexTypes= ['Sexe','Homme','Femme'];

      const eye=()=>{
        setIsEye(prevValue=>!prevValue);
      };

       //picker only iOS function 
   const onPress = () =>{
    const wilayasIOS = ['Annuler','Alger','Blida'];    
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: wilayasIOS,
        cancelButtonIndex:0
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          // cancel action
        } else {
         setWilaya(wilayasIOS[buttonIndex]);
        } 
      }
    );  
}


    //picker only iOS function 
    const onPressSex = () =>{
    const sexIOS = ['Annuler','Homme','Femme'];    
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: sexIOS,
        cancelButtonIndex: 0
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          // cancel action
        } else {
          setSex(sexIOS[buttonIndex]);
        } 
      }
    );  
    }
      
 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///Input management

const[formState,disaptchFormState] = useReducer(formReducer,
    {inputValues:{
      phone: '',
      password:'',
      region:''
    },
     inputValidities:{
       phone:false,
       password:false,
       region:false
     },
     formIsValid:false});

const inputChangeHandler = useCallback((inputIdentifier, inputValue,inputValidity) =>{

disaptchFormState({type:Form_Input_Update,value:inputValue,isValid:inputValidity,inputID:inputIdentifier});
},[disaptchFormState]);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const saveDataToStorage = (token,userID,expirationDate,gender,id) => {

  AsyncStorage.setItem('userData',
                        JSON.stringify({
                        token:token,
                        userID:userID,
                        expiryDate: expirationDate.toISOString(),
                        gender:gender,
                        id:id
                      }) 
                      );

};

const signupHandler = async () => {

  const phoneProvider = new firebase.auth.PhoneAuthProvider();
 
  if(formState.formIsValid && (wilaya!==null || wilaya!==wilayas[0]) &&  (sex!==null || sex!==sexTypes[0])  && wilaya!==undefined && sex!==undefined){
    try {

      setVerifyInProgress(true);

    

      const result = await fetch(`http://95.111.243.233:3000/phone/${prefix+formState.inputValues.phone}`);
    
      const resData= await result.json();
      console.log(resData);
      setVerifyInProgress(false);

      //Check if User Exists
      if(resData.userRecord.phoneNumber === prefix+formState.inputValues.phone){
        Alert.alert('Erreur!','Ce Numéro de Téléphone existe déjà!',[{text:"OK"}]);
      }else{
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
      }

    }catch (err) {
      console.log(err); 
      Alert.alert('Oups!','Une erreur est survenue.',[{text:"OK"}]);
      setVerifyInProgress(false);
    }
  }else{
     Alert.alert('Erreur!','Veuillez remplir le(s) champ(s) manquants svp!',[{text:"OK"}]);
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

      //Retrieve user data
      const user = firebase.auth().currentUser;
      const tokenResult = await user.getIdTokenResult();
      const expirationDate= new Date(Date.parse(tokenResult.expirationTime));

      const hashedPassword = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA512,
        formState.inputValues.password
      );

      await dispatch(barberActions.createBarber(formState.inputValues.phone, prefix+formState.inputValues.phone,
        hashedPassword,sex,wilaya,formState.inputValues.region));
      await dispatch(worktimeActions.createWorktime(formState.inputValues.phone));
      await dispatch(portfolioActions.createPortfolio(formState.inputValues.phone));
      setConfirmInProgress(false);
      setVerificationId("");
      setVerificationCode("");

     
        
      props.navigation.navigate('Barber',{barberID:formState.inputValues.phone,barberUID:user.uid}); 
      Alert.alert('Salut!','Bienvenue à ReBorn :-)',[{text:"Merci"}]);
      saveDataToStorage(tokenResult.token,user.uid,expirationDate,"Barber",formState.inputValues.phone);                                  


  } catch (err) {
        setConfirmError(err);
        Alert.alert('Oups!','Une erreur est survenue.',[{text:"OK"}]);
        console.log(err);
        setConfirmInProgress(false);
  }
  
};

    return(
      <TouchableWithoutFeedback onPress = {()=>{Keyboard.dismiss()}}>
        <ImageBackground source={{uri:'http://95.111.243.233/assets/tahfifabarber/chica4.jpg'}} style={styles.container}>
          <KeyboardAvoidingView keyboardVerticalOffset={screen.width/36}  behavior={Platform.OS === "ios" ? "padding" : null}>
          <StatusBar hidden />
          <FirebaseRecaptcha.FirebaseRecaptchaVerifierModal
                ref={recaptchaVerifier}
                firebaseConfig={Firebaseconfig}
                title='Prouvez que vous êtes humain!'
                cancelLabel='Fermer'
              />
          
              <View style={{width:'85%',height:verificationId?'50%':'30%',alignSelf:'center',alignItems:'flex-start',justifyContent:'flex-end'}}>
                 <Image source={require('../../assets/iconReBorn.png')} style={styles.icon}/>
                 <Text style={styles.slogan}>Allez chez votre client ou recevez-le au salon</Text>
              </View>
              <View style={styles.secondContainer}>
              {!verificationId ? (<View>
                <CustomInput
                    id='phone'
                    rightIcon={<MaterialIcons title = "phone" name ='phone' color='#323446' size={screen.width/15.7} />}
                    leftIcon={<View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-around',borderRightWidth:1,borderRightColor:Colors.blue,paddingRight:screen.width/72}}><Image source={{uri:'http://95.111.243.233/assets/tahfifabarber/algeriaFlag.png'}} style={{width:screen.width/15,height:screen.width/12.85,marginRight:screen.width/72}}></Image><Text style={styles.phoneNumber}>+213</Text></View>}
                    placeholder='555555555'
                    keyboardType="phone-pad"
                    returnKeyType="next"
                    onInputChange={inputChangeHandler}
                    initialValue=''
                    initiallyValid={true}
                    phone
                    required
                    placeholderTextColor='rgba(50,52,70,0.4)'
                    editable={!verificationId}
                    />
                 <CustomInput
                        id='password'
                        rightIcon={<MaterialCommunityIcons title="lock" onPress={eye} name ={!isEye?'eye':'eye-off'} color='#323446' size={screen.width/15.7} />}
                        placeholder='Mot de Passe'
                        keyboardType="default"
                        returnKeyType="next"
                        secureTextEntry={!isEye?true:false}
                        minLength={6}
                        autoCapitalize='none'
                        onInputChange={inputChangeHandler}
                        initialValue=''
                        initiallyValid={true}
                        required
                        placeholderTextColor='rgba(50,52,70,0.4)'
                        editable={!verificationId}
                      />
                
                 <View style={{ width:'100%',borderWidth:1,borderRadius:screen.width/14.4,backgroundColor:'#d3d3d3',borderColor:sex!==null?'#d3d3d3':Colors.primary,marginVertical:screen.width/120,height:screen.width/8,justifyContent:'center', paddingHorizontal:screen.width/28}}>
                 {Platform.OS === 'android' ?(<RNPickerSelect
                              value={sex}
                              useNativeAndroidPickerStyle={false}
                              style={{ color:'red',inputIOS:{fontFamily:'poppins',fontSize:screen.width/35,color:'#323446'},inputAndroid: {
                                fontFamily:'poppins',
                                color:'#323446',
                                fontSize:screen.width/30
                              }}}
                              placeholder={{label:'Sexe',value:null}}
                              onValueChange={itemValue => setSex(itemValue)}
                              doneText='Annuler'
                              items={[
                                { label: 'Homme', value: 'Homme'},
                                { label: 'Femme', value: 'Femme' }
                            ]}
                            />):
                            (<TouchableOpacity onPress={onPressSex} style={{ width:'100%',flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingLeft:screen.width/36,paddingRight:screen.width/36}}>
                            <Text  style={{fontFamily:'poppins',color:sex?'#323446':'rgba(50,52,70,0.4)',fontSize:screen.width/30,fontWeight:'500'}}>
                              {sex?sex:sexTypes[0]}
                            </Text>
                            <Ionicons name="ios-arrow-down" size={screen.width/15} color='#323446' onPress={onPressSex} />
                            </TouchableOpacity>)}
                  </View>
                  <View style={{ width:'100%',borderWidth:1,borderRadius:screen.width/14.4,backgroundColor:'#d3d3d3',borderColor:wilaya!==null?'#d3d3d3':Colors.primary,marginVertical:screen.width/120,height:screen.width/8,justifyContent:'center',paddingHorizontal:screen.width/28}}>
                  {Platform.OS==='android'?
                          (<RNPickerSelect
                              value={wilaya}
                              useNativeAndroidPickerStyle={false}
                              style={{ inputIOS:{fontFamily:'poppins',fontSize:screen.width/35,color:'#323446'},inputAndroid: {
                                fontFamily:'poppins',
                                color:'#323446',
                                fontSize:screen.width/30
                              }}}
                              placeholder={{label:'Wilaya',value:null}}
                              onValueChange={itemValue => setWilaya(itemValue)}
                              doneText='Annuler'
                              items={[
                                { label: 'Alger', value: 'Alger'},
                                { label: 'Blida', value: 'Blida' }
                            ]}
                            />):
                            (<TouchableOpacity onPress={onPress}  style={{ width:'100%',flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingLeft:screen.width/36,paddingRight:screen.width/36}}>
                            <Text style={{fontFamily:'poppins',color:wilaya?'#323446':'rgba(50,52,70,0.4)',fontSize:screen.width/30,fontWeight:'500'}}>
                              {wilaya?wilaya:wilayas[0]}
                            </Text>
                            <Ionicons name="ios-arrow-down" size={screen.width/15} color='#323446' onPress={onPress} />
                            </TouchableOpacity>)}
                </View>
                <CustomInput
                        id='region'
                        rightIcon={<MaterialIcons title="region" name ='home' color='#323446' size={23} />}
                        placeholder='Région'
                        keyboardType="default"
                        returnKeyType="next"
                        minLength={3}
                        autoCapitalize='sentences'
                        onInputChange={inputChangeHandler}
                        initialValue=''
                        initiallyValid={true}
                        required
                        placeholderTextColor='rgba(50,52,70,0.4)'
                        inputStyle={{fontSize:screen.width/24}}
                        editable={!verificationId}
                      />
             
                <View><Button
                    theme={{colors: {primary:'#fd6c57'}}} 
                    title="S'inscrire"
                    titleStyle={styles.labelButton}
                    buttonStyle={styles.buttonStyle}
                    onPress={signupHandler}
                    ViewComponent={LinearGradient} 
                    linearGradientProps={{
                        colors: ['#fd6d57', '#fd9054'],
                        start: {x: 0, y: 0} ,
                        end:{x: 1, y: 0}
                        
                    }}
                  />
                  {verifyInProgress && <ActivityIndicator color={Colors.primary} style={styles.loader} />}
                  </View>
                  </View>):
                  (<View style={{height:'50%'}}>
                    <View style={{width:'100%',borderWidth:1, borderRadius:screen.width/14.4,backgroundColor:'#d3d3d3',borderColor:confirmError?Colors.primary:'#d3d3d3',marginVertical:screen.width/120,height:screen.width/8,alignItems:'center',justifyContent:'center'}}>
                      <TextInput
                              placeholder='Entrez les 6 chiffres'
                              keyboardType='number-pad'
                              autoCapitalize='none'
                              returnKeyType="next"
                              onChangeText={verificationCode=>setVerificationCode(verificationCode)}
                              placeholderTextColor='rgba(50,52,70,0.4)'
                              style={{color:'#323446'}}
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
                    onPress={signupHandler}
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

                  </View>
                  
                  )}
                  
                  {!verificationId?<View style={styles.loginContainer}>
                    <Text style={styles.doYouHaveAnAccount}>Avez-vous déjà un compte? </Text>
                    <TouchableOpacity onPress={()=>props.navigation.navigate('Login')}>
                      <Text style={styles.loginText}>Se connecter</Text>
                    </TouchableOpacity>
                  </View>:undefined}
              </View>
            
             
          </KeyboardAvoidingView>
        </ImageBackground>
       </TouchableWithoutFeedback>

     );    
};

SignupBarberScreen.navigationOptions= ()=>{
    return {
      headerTransparent : true ,
      headerStyle:{
          backgroundColor: 'white'
      },
      headerTitle: () => (
        <Image 
        resizeMode="cover"
        style={{
          width:screen.width/2.4,
          height:screen.width/9,
          resizeMode:'contain',
          alignSelf: 'center'}}
        
        />
      ),
       headerBackTitle : " ",
       headerLeft:()=>null
    };
  }


const styles= StyleSheet.create({
   container:{
    resizeMode:'cover',
    width:'100%',
    flex:1
   },
  icon:{
    width:screen.width/4,
    height:screen.width/4,
    position:'relative',
    
  },
  slogan:{
    fontSize:screen.width/20,
    fontFamily:'poppins-bold',
    color:'#FFF',
    paddingTop:screen.width/72
  },
  secondContainer:{
    width:'85%',
    alignSelf:'center',
    paddingTop:screen.width/18
  },
  labelButton:{
    color:'#FFF',
    fontFamily:'poppins',
    fontSize:screen.width/22.5,
    textTransform:null,
   },
   buttonStyle:{
    borderColor:'#fd6c57',
    width:'100%',
    borderRadius:screen.width/18,
    height:screen.width/8,
    alignSelf:'center',
    marginTop:screen.width/24
   },
   confirmedButtonStyle:{
    borderColor:'#fd6c57',
    width:'80%',
    borderRadius:screen.width/18,
    height:screen.width/8,
    alignSelf:'center',
    marginTop:screen.width/120
   },
   loginContainer:{
    flexDirection:'row',
    paddingTop:screen.width/24,
    alignSelf:'center'
  },
  doYouHaveAnAccount:{
    fontSize:screen.width/25.7,
    fontFamily:'poppins',
    color:'#fff'
  },
  loginText:{
    fontSize:screen.width/25.7,
    fontFamily:'poppins-bold',
    color:'#fd6c57'
  },
  loader: {
    marginTop: screen.width/36,
  },
  confirmErrorText:{
    color:Colors.primary,
    fontSize:screen.width/27.7,
    alignSelf:'center'
  },
  smsText:{
    color:'green',
    fontSize:screen.width/32.7,
    paddingTop:screen.width/36,
    alignSelf:'center',
    fontFamily:'poppins-bold'
  },
  phoneNumber:{
    fontSize:screen.width/30,
    color:Colors.blue,
  },
  cofirmResendContainer:{
    flexDirection:'row',
    justifyContent:'space-around',
    alignItems:'center',
    width:'100%',
    marginTop:screen.width/24
  }
   
});

export default SignupBarberScreen;