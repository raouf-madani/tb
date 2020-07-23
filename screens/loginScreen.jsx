import React,{useState} from 'react';
import { StyleSheet,View,KeyboardAvoidingView,Text,Image,Dimensions,TouchableOpacity, StatusBar} from 'react-native';
import {MaterialIcons} from "@expo/vector-icons";
import { Input,Button } from 'react-native-elements';
import Colors from '../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';

//responsivity (Dimensions get method)
const screen = Dimensions.get('window');

const LoginScreen = props =>{

  

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /*Responsivity */
  
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const [phone,setPhone] = useState('');
  const [password,setPassword] = useState('');

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
                 <View style={styles.inputPhoneContainer}>
                  <Input 
                      rightIcon={<MaterialIcons title = "phone" name ='phone' color='#323446' size={23} />}
                      placeholder="Téléphone"
                      inputContainerStyle={styles.input}
                      placeholderTextColor='rgba(50,52,70,0.4)'
                      inputStyle={{fontSize:15}}
                      />
                  
                 </View>
                 <View style={styles.inputPasswordContainer}>
                  <Input 
                      rightIcon={<MaterialIcons title="lock" name ='remove-red-eye' color='#323446' size={23} />}
                      placeholder=" Mot de Passe"
                      inputContainerStyle={styles.input}
                      placeholderTextColor='rgba(50,52,70,0.4)'
                      inputStyle={{fontSize:15}}
                      />
                 </View>
             </View>
             <View style={styles.footerContainer}>
                <Button
                    theme={{colors: {primary:'#fd6c57'}}} 
                    title="Se connecter"
                    titleStyle={styles.labelButton}
                    buttonStyle={styles.buttonStyle}
                    ViewComponent={LinearGradient} 
                    linearGradientProps={{
                        colors: ['#fd6d57', '#fd9054'],
                        start: {x: 0, y: 0} ,
                        end:{x: 1, y: 0}
                        
                    }}
                  />
                  <Text style={styles.forgotPassword}>Mot de passe oublié?</Text>
                  <View style={styles.signupContainer}>
                    <Text style={styles.doYouHaveAnAccount}>Vous n'avez pas un compte? </Text>
                    <TouchableOpacity onPress={()=>props.navigation.navigate('SignupBarber')}>
                     <Text style={styles.signupText}>S'inscrire</Text>
                    </TouchableOpacity>
                  </View>
                  
             </View>
          </View>
       </KeyboardAvoidingView> 
     </View>

     );    
};

LoginScreen.navigationOptions= ()=>{
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
    headerLeft:()=>null,
  
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
    height:'40%',
    width:'100%',
    justifyContent:'center',
    alignItems:'center'
  },
  inputPhoneContainer:{
    width:'90%',
    borderWidth:1,
    borderRadius:25,
    backgroundColor:'#d3d3d3',
    borderColor:'#d3d3d3',
    height:50
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
  footerContainer:{
    height:'35%',
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
    height:45,
    alignSelf:'center'
   },
  forgotPassword:{
    fontSize:14,
    fontFamily:'poppins',
    color:'#323446',
    alignSelf:'center',
    paddingTop:10
  },
  signupContainer:{
    flexDirection:'row',
    paddingTop:10,
    alignSelf:'center'
  },
  doYouHaveAnAccount:{
    fontSize:14,
    fontFamily:'poppins',
    color:'grey'
  },
  signupText:{
    fontSize:14,
    fontFamily:'poppins-bold',
    color:'#fd6c57'
  }
});

export default LoginScreen;