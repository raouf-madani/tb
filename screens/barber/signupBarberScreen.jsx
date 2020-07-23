import React,{useState} from 'react';
import { StyleSheet,View,KeyboardAvoidingView,Text,Image,ImageBackground,StatusBar,TouchableOpacity,Picker,ActionSheetIOS} from 'react-native';
import {Input,Button} from 'react-native-elements';
import {MaterialIcons,MaterialCommunityIcons} from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';




const SignupBarberScreen = props =>{

     //States for complex information textInputs
     const [wilaya,setWilaya] = useState('Wilaya');
     const wilayas = ['Wilaya','Alger','Blida'];
     const [region,setRegion] = useState('Region');
     const regions = ['Hydra','Salombé','Bab Dzair','Said Hamdine','Bab Essebt','Joinville']; 
     const [sex,setSex] = useState('Sexe');
     const sexTypes= ['Homme','Femme'];
     
     //picker only iOS function 
     const onPress = () =>{
       const wilayasIOS = ['Alger','Blida'];    
       ActionSheetIOS.showActionSheetWithOptions(
         {
           options: wilayasIOS,
           cancelButtonIndex: -1
         },
         buttonIndex => {
           if (buttonIndex === -1) {
             // cancel action
           } else {
            setHour(wilayasIOS[buttonIndex]);
           } 
         }
       );  
   }
  
   //picker only iOS function 
   const onPressRegion = () =>{
    const regionsIOS = ['Hydra','Salombé','Bab Dzair','Said Hamdine','Bab Essebt','Joinville'];    
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: regionsIOS,
        cancelButtonIndex: -1
      },
      buttonIndex => {
        if (buttonIndex === -1) {
          // cancel action
        } else {
         setMinute(regionsIOS[buttonIndex]);
        } 
      }
    );  
  }

   //picker only iOS function 
   const onPressSex = () =>{
    const sexIOS = ['Homme','Femme'];    
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: sexIOS,
        cancelButtonIndex: -1
      },
      buttonIndex => {
        if (buttonIndex === -1) {
          // cancel action
        } else {
         setSex(sexIOS[buttonIndex]);
        } 
      }
    );  
}

    return(
       
        <ImageBackground source={require('../../assets/images/chica4.jpg')} style={styles.container}>
          <KeyboardAvoidingView keyboardVerticalOffset={10}>
          <StatusBar hidden />
              <View style={styles.firstContainer}>
                 <Image source={require('../../assets/images/icon.png')} style={styles.icon}/>
                 <Text style={styles.slogan}>Allez chez votre client ou recevez-le au salon</Text>
              </View>
              <View style={styles.secondContainer}>
                 <View style={styles.inputPhoneContainer}>
                    <Input 
                        rightIcon={<MaterialIcons title = "phone" name ='phone' color='#323446' size={23} />}
                        placeholder="Téléphone"
                        inputContainerStyle={styles.input}
                        placeholderTextColor='rgba(50,52,70,0.4)'
                        inputStyle={{fontSize:15}}
                        />
                 </View>
                 <View style={styles.inputPhoneContainer}>
                    <Input 
                        rightIcon={<MaterialIcons title = "lock" name ='remove-red-eye' color='#323446' size={23} />}
                        placeholder="Mot de passe"
                        inputContainerStyle={styles.input}
                        placeholderTextColor='rgba(50,52,70,0.4)'
                        inputStyle={{fontSize:15}}
                        />
                 </View>
                 <View style={styles.inputPhoneContainer}>
                  {Platform.OS === 'android' ? 
                      <Picker
                      selectedValue={sex}
                      onValueChange={itemValue => setSex(itemValue)}
                      style={{fontFamily:'poppins',fontSize:12,color:'#323446',marginHorizontal:14}}
                      >
                      {sexTypes.map(el=> <Picker.Item label={el} value={el} key={el} />)}
                      </Picker> :
                      <Text onPress={onPressSex} style={{fontFamily:'poppins',fontSize:12,color:'#323446'}}>
                        {sex}
                      </Text>}
                  </View>
                  <View style={styles.inputPhoneContainer}>
                  {Platform.OS === 'android' ? 
                              <Picker
                              selectedValue={wilaya}
                              onValueChange={itemValue => setWilaya(itemValue)}
                              style={{fontFamily:'poppins',fontSize:12,color:'#323446',marginHorizontal:14}}
                              >
                              {wilayas.map(el=> <Picker.Item label={el} value={el} key={el} />)}
                              </Picker> :
                              <Text onPress={onPress} style={{fontFamily:'poppins',fontSize:12,color:'#323446'}}>
                                {wilaya}
                              </Text>}
                </View>
                <View style={styles.inputPhoneContainer}>
                {Platform.OS === 'android' ? 
                              <Picker
                              selectedValue={region}
                              onValueChange={itemValue => setRegion(itemValue)}
                              style={{fontFamily:'poppins',fontSize:12,color:'#323446',marginHorizontal:14}}
                              >
                              {regions.map(el=> <Picker.Item label={el} value={el} key={el} />)}
                              </Picker> :
                              <Text onPress={onPressRegion} style={{fontFamily:'poppins',fontSize:12,color:'#323446'}}>
                                {region}
                              </Text>} 
                </View>
             
                <Button
                    theme={{colors: {primary:'#fd6c57'}}} 
                    title="S'inscrire"
                    titleStyle={styles.labelButton}
                    buttonStyle={styles.buttonStyle}
                    ViewComponent={LinearGradient} 
                    linearGradientProps={{
                        colors: ['#fd6d57', '#fd9054'],
                        start: {x: 0, y: 0} ,
                        end:{x: 1, y: 0}
                        
                    }}
                  />
                  <View style={styles.loginContainer}>
                    <Text style={styles.doYouHaveAnAccount}>Avez-vous déjà un compte? </Text>
                    <TouchableOpacity>
                      <Text style={styles.loginText}>Se connecter</Text>
                    </TouchableOpacity>
                  </View>
              </View>
            
              
          </KeyboardAvoidingView>
        </ImageBackground>
     

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
          width:150,
          height:40,
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
    flex: 1,
    resizeMode:'cover',
    width:'100%',
    
   },
  firstContainer:{
    width:'85%',
    height:'30%',
    alignSelf:'center',
    alignItems:'flex-start',
    justifyContent:'flex-end'
  },
  icon:{
    width:80,
    height:80
  },
  slogan:{
    fontSize:18,
    fontFamily:'poppins-bold',
    color:'#FFF',
    paddingTop:5
  },
  secondContainer:{
    width:'85%',
    height:'70%',
    alignSelf:'center',
    paddingTop:20
  },
   inputPhoneContainer:{
    width:'100%',
    borderWidth:1,
    borderRadius:25,
    backgroundColor:'#d3d3d3',
    borderColor:'#d3d3d3',
    marginVertical:3,
    height:50
  },
  input:{
    borderBottomWidth:0,
    paddingHorizontal:10
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
    marginTop:10
   },
   loginContainer:{
    flexDirection:'row',
    paddingTop:15
  },
  doYouHaveAnAccount:{
    fontSize:14,
    fontFamily:'poppins',
    color:'#fff'
  },
  loginText:{
    fontSize:14,
    fontFamily:'poppins-bold',
    color:'#fd6c57'
  }
   
});

export default SignupBarberScreen;