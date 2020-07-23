import React,{useState} from 'react';
import {StyleSheet,View,AsyncStorage,ScrollView,ImageBackground,TouchableOpacity,Text,Image,Alert,KeyboardAvoidingView,Dimensions,ActionSheetIOS,Picker} from 'react-native';
import {MaterialIcons,MaterialCommunityIcons} from "@expo/vector-icons";
import {Button,Input} from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import polylanar from "../../../lang/ar";
import polylanfr from "../../../lang/fr";
import Colors from '../../../constants/Colors';


//responsivity (Dimensions get method)
const screen = Dimensions.get('window');

const BarberSupportScreen = props =>{
  const [isPhone,setIsPhone]= useState(true);
  const [isPassword,setIsPassword]= useState(false);
  const [isLang,setIsLang]= useState(false);
  const [isArabic,setIsArabic]= useState(false);
  

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
  
  const arabic= ()=>{
    setIsArabic(prevValue=>!prevValue);
  }
  

    return(
      <View style={styles.container}>
         <View style={styles.firstCard}>
          <ImageBackground source={require('../../../assets/images/man1-1.jpg')} style={styles.backgroundFirstCard} resizeMode='cover'/>
         </View>
         <View style={styles.menuContainer}>
              <TouchableOpacity onPress={phone} style={{padding:5,width:'30%',backgroundColor:isPhone?'#fd6c57':'#fff',alignItems:'center',justifyContent:'center'}}>
                <Text style={{color:isPhone?'#fff':'#fd6c57',fontFamily:'poppins'}}>
                  {!isArabic?polylanfr.Phone:polylanar.Phone}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={password} style={{borderRightWidth:1,borderRightColor:'#fd6c57',borderLeftWidth:1,borderLeftColor:'#fd6c57',padding:5,width:'40%',backgroundColor:isPassword?'#fd6c57':'#fff',alignItems:'center',justifyContent:'center'}}>
                  <Text style={{color:isPassword?'#fff':'#fd6c57',fontFamily:'poppins'}}>
                    {!isArabic?polylanfr.Password:polylanar.Password}
                  </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={lang} style={{padding:5,width:'30%',backgroundColor:isLang?'#fd6c57':'#fff',alignItems:'center',justifyContent:'center'}}>
                  <Text style={{color:isLang?'#fff':'#fd6c57',fontFamily:'poppins'}}>
                    {!isArabic?polylanfr.Languages:polylanar.Languages}
                  </Text>
              </TouchableOpacity>
        </View>
        {isPhone?(<ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <KeyboardAvoidingView keyboardVerticalOffset={10}>
            <View style={styles.inputPhoneContainer}>
                <Input 
                    rightIcon={!isArabic?<MaterialIcons title="phone" name ='phone' color='#323446' size={23} />:undefined}
                    leftIcon={isArabic?<MaterialIcons title="phone" name ='phone' color='#323446' size={23} />:undefined}
                    placeholder={!isArabic?polylanfr.Example+': +213658341876':polylanar.Example+': 213658341876+'}
                    inputContainerStyle={styles.input}
                    placeholderTextColor='rgba(50,52,70,0.4)'
                    inputStyle={{fontSize:15}}
                    />
              </View>
              <View style={styles.buttonContainer}>
                <Button
                    theme={{colors: {primary:'#fd6c57'}}} 
                    title={!isArabic?polylanfr.Register:polylanar.Register}
                    titleStyle={styles.labelButton}
                    buttonStyle={styles.buttonStyle}
                    ViewComponent={LinearGradient} 
                    linearGradientProps={{
                        colors: ['#fd6d57', '#fd9054'],
                        start: {x: 0, y: 0} ,
                        end:{x: 1, y: 0}
                        
                    }}
                />
           </View>
           </KeyboardAvoidingView>
        </ScrollView>):undefined}
        {isPassword?(<ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <KeyboardAvoidingView keyboardVerticalOffset={10}>
            <View style={styles.inputPhoneContainer}>
                <Input 
                    rightIcon={!isArabic?<MaterialIcons title="lock" name ='remove-red-eye' color='#323446' size={23} />:undefined}
                    leftIcon={isArabic?<MaterialIcons title="lock" name ='remove-red-eye' color='#323446' size={23} />:undefined}
                    placeholder={!isArabic?polylanfr.NewPassword:polylanar.NewPassword}
                    inputContainerStyle={styles.input}
                    placeholderTextColor='rgba(50,52,70,0.4)'
                    inputStyle={{fontSize:15}}
                    />
              </View>
              <View style={styles.buttonContainer}>
                <Button
                    theme={{colors: {primary:'#fd6c57'}}} 
                    title={!isArabic?polylanfr.Register:polylanar.Register}
                    titleStyle={styles.labelButton}
                    buttonStyle={styles.buttonStyle}
                    ViewComponent={LinearGradient} 
                    linearGradientProps={{
                        colors: ['#fd6d57', '#fd9054'],
                        start: {x: 0, y: 0} ,
                        end:{x: 1, y: 0}
                        
                    }}
                />
           </View>
           </KeyboardAvoidingView>
        </ScrollView>):undefined}
        {isLang?(<ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <KeyboardAvoidingView keyboardVerticalOffset={10}>
            <View style={styles.langContainer}>
              {!isArabic?(<View style={styles.langRow}>
                <Text style={{fontFamily:'poppins',fontSize:12,color:'#323446'}}>Français</Text>
                <Image source={require('../../../assets/images/france.png')} style={{width:24,height:24}}/>
              </View>):undefined}
              {isArabic?(<View style={styles.langRow}>
                <Text style={{fontFamily:'poppins',fontSize:13,color:'#323446'}}>العربية</Text>
                <Image source={require('../../../assets/images/algeria.png')} style={{width:24,height:24}}/>
              </View>):undefined}
            </View>
            <View style={styles.buttonContainer}>
                <Button
                    theme={{colors: {primary:'#fd6c57'}}} 
                    title={!isArabic?polylanfr.Change:polylanar.Change}
                    titleStyle={styles.labelButton}
                    buttonStyle={styles.buttonStyle}
                    ViewComponent={LinearGradient} 
                    linearGradientProps={{
                        colors: ['#fd6d57', '#fd9054'],
                        start: {x: 0, y: 0} ,
                        end:{x: 1, y: 0}
                        
                    }}
                    onPress={arabic}
                />
           </View>
           </KeyboardAvoidingView>
        </ScrollView>):undefined}
        
      </View>

     );    
};

BarberSupportScreen.navigationOptions= navData => {
    
     return {
      title:'Paramètres',
      headerTransparent : true ,
      headerBackTitle : " ",
      headerTintColor: '#fff',
      headerTitleStyle:{
        fontFamily:'poppins-bold',
        marginTop:5
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
  inputPhoneContainer:{
    width:'80%',
    borderWidth:1,
    borderRadius:20,
    backgroundColor:'#fff',
    borderColor:'#fff',
    marginVertical:5,
    alignSelf:'center',
    shadowColor: 'black',
    shadowOpacity: 0.96,
    shadowOffset: {width: 0, height:2},
    shadowRadius: 10,
    elevation: 3,
    overflow:'hidden'
  },
  langContainer:{
    width:'80%',
    borderWidth:1,
    borderRadius:20,
    backgroundColor:'#fff',
    borderColor:'#fff',
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
  input:{
    borderBottomWidth:0,
    paddingHorizontal:10
  },
  buttonContainer:{
    width:'90%',
    alignSelf:'center',
    marginVertical:20
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
 }
});

export default BarberSupportScreen;