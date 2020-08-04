import React,{useState,useCallback,useReducer} from 'react';
import { StyleSheet,View,KeyboardAvoidingView,Text,Image,Dimensions,StatusBar,Alert,ActivityIndicator,AsyncStorage} from 'react-native';
import {MaterialIcons,MaterialCommunityIcons} from "@expo/vector-icons";
import {Button } from 'react-native-elements';
import Colors from '../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import CustomInput from '../components/Input';
import * as Crypto from 'expo-crypto'; 
import * as barberActions from '../store/actions/barberActions';
import {useDispatch} from 'react-redux';

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

const ForgotPasswordScreen = props =>{

  

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///Input management
//Press verifyNumber Button handling ==> Verification
const [isVerified,setIsVerified]= useState(false);
const [isLogin,setIsLogin]= useState(false);
const prefix='+213';
const dispatch= useDispatch();
const [isEye,setIsEye]=useState(false);

      const eye=()=>{
        setIsEye(prevValue=>!prevValue);
      };

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

const verifyNumber = async ()=>{

    if(formState.inputValidities.phone && formState.inputValues.phone){
        try{
        
        setIsLogin(true);
        const result = await fetch(`http://192.168.1.36:3000/phone/${prefix+formState.inputValues.phone}`);
        const resData= await result.json();
        setIsLogin(false);
        
                                                
        if(resData.userRecord.phoneNumber === prefix+formState.inputValues.phone){
            setIsVerified(true);
        }else{
            setIsVerified(false);
            Alert.alert('Erreur!','Ce numéro de téléphone n\'existe pas. Veuillez créer un nouveau compte svp!',[{text:"OK"}]);
        }
        
        }catch(error){
        console.log(error);
        Alert.alert('Oups!','Une erreur est survenue.',[{text:"OK"}]);
        setIsLogin(false);
        }
    }else{
        Alert.alert('Erreur!','Numéro de téléphone invalide.',[{text:"OK"}]);
    } 
    
    };
          
const login = async()=>{

    if(formState.formIsValid && formState.inputValues.password){
    try{
    const hashedPassword = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA512,
    formState.inputValues.password
    );


    setIsLogin(true);
    const result = await fetch(`http://192.168.1.36:3000/phone/${prefix+formState.inputValues.phone}`);
    const resData= await result.json();
    const barbers= await fetch('http://192.168.1.36:3000/barber');
    const barbersData= await barbers.json();
    setIsLogin(false);

const currentBarberObject= barbersData.find(item=> item.phone===prefix+formState.inputValues.phone && item.password===hashedPassword);

if(currentBarberObject){
Alert.alert('Erreur!','Votre nouveau mot de passe doit être différent d\'ancien mot de passe.',[{text:"Réessayer"}]);
return;
}

const currentBarber= barbersData.find(item=>item.phone===prefix+formState.inputValues.phone);

if(currentBarber){
    
    dispatch(barberActions.updateBarberPassword(formState.inputValues.phone,hashedPassword));
    
    Alert.alert(`${currentBarber.name} ${currentBarber.surname}`,'Contents de vous revoir!',[{text:"Merci"}]);
    props.navigation.navigate('Barber',{barberID:currentBarber.id,barberUID:resData.userRecord.uid});
    saveDataToStorage(resData.token,resData.userRecord.uid,new Date(resData.expirationDate),currentBarber.type,currentBarber.id);
}

}catch(error){
    console.log(error);
    Alert.alert('Oups!','Une erreur est survenue.',[{text:"OK"}]);
    setIsLogin(false);
}

}else{
Alert.alert('Erreur!','Veuillez rentrer votre nouveau mot de passe s\'il vous plait!',[{text:"OK"}]);
}

};  

    return(
      <View style={styles.container}>
       <KeyboardAvoidingView  keyboardVerticalOffset={10}>
         <StatusBar hidden />
          <View style={styles.backgroundContainer}>
            <Image source={require('../assets/images/man1-1.jpg')} style={{resizeMode:'cover',width:'100%',height:'100%'}}/>
          </View>
          <View style={styles.secondContainer}>
             <View style={styles.logoContainer}>
                 <Image source={require('../assets/images/t1.png')} style={styles.logo}/>
                 <Text style={styles.callToAction}>Contactez un coiffeur en quelques clics</Text>
             </View>
              <View style={styles.inputsContainer}>
                  <CustomInput
                    id={'phone'}
                    rightIcon={<MaterialIcons title = "phone" name ='phone' color='#323446' size={23} />}
                    leftIcon={<View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-around',borderRightWidth:1,borderRightColor:Colors.blue,paddingRight:5}}><Image source={require('../assets/images/algeriaFlag.png')} style={{width:24,height:28,marginRight:5}}></Image><Text style={styles.phoneNumber}>+213</Text></View>}
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
                    editable={!isVerified}
                  />
                  <CustomInput
                  id='password'
                  rightIcon={<MaterialCommunityIcons title="lock" onPress={eye} name ={!isEye?'eye':'eye-off'} color='#323446' size={23} />}
                  placeholder='Nouveau Mot de Passe'
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
                  inputStyle={{fontSize:15}}
                  editable={isVerified}
                />
                 <Button
                    theme={{colors: {primary:'#fd6c57'}}} 
                    title={!isVerified?"Vérifier":"Se connecter"}
                    titleStyle={styles.labelButton}
                    buttonStyle={styles.buttonStyle}
                    ViewComponent={LinearGradient} 
                    onPress={!isVerified ?verifyNumber:login}
                    linearGradientProps={{
                        colors: ['#fd6d57', '#fd9054'],
                        start: {x: 0, y: 0} ,
                        end:{x: 1, y: 0}
                        
                    }}
                  />
              </View>
             
             
             {isLogin && <ActivityIndicator  size='small' color={Colors.primary} />}
            <View style={styles.signupContainer}>
                <Text style={{color:!isVerified ?Colors.primary:'#A8A8A8',fontFamily:'poppins',fontSize:12,alignSelf:'center',}}>1- Vérifier votre numéro de téléphone.</Text>
                <Text style={{color:isVerified?Colors.primary:Colors.blue,fontFamily:'poppins',fontSize:12,alignSelf:'center',}}>2- Réinitialiser votre mot de passe.</Text>
            </View>
                  
             
          </View>
       </KeyboardAvoidingView> 
     </View>

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
    width:160,
    height:49,
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
    paddingTop:10,
    alignSelf:'center',
    height:'20%',
    
  },
});

export default ForgotPasswordScreen;