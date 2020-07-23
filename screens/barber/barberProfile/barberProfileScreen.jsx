import React,{useState,useEffect} from 'react';
import { StyleSheet,View,AsyncStorage,ScrollView,ImageBackground,TouchableOpacity,Text,Image,Alert,KeyboardAvoidingView,Dimensions,ActionSheetIOS,Picker} from 'react-native';
import {MaterialIcons,MaterialCommunityIcons} from "@expo/vector-icons";
import {Button,Input} from 'react-native-elements';
import {HeaderButtons,Item} from "react-navigation-header-buttons";
import HeaderButton from "../../../components/HeaderButton";
import polylanar from "../../../lang/ar";
import polylanfr from "../../../lang/fr";

import { LinearGradient } from 'expo-linear-gradient';

import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

//responsivity (Dimensions get method)
const screen = Dimensions.get('window');

const BarberProfileScreen = props =>{

    const data=[{id:'1',fullname:'Angelina .J',imagePth:require('../../../assets/images/man1-1.jpg'),phone:'0659853214',sexe:'Femme',email:'maxi@gmail.com',experience:5,imagePth2:require('../../../assets/images/man2.jpg')},
               ]; 
    const [isInfo,setIsInfo]= useState(true);
    const [isLocalisation,setIsLocalisation]= useState(false);

    const info = ()=>{
      setIsInfo(true);
      setIsLocalisation(false);
    };
    const localisation = ()=>{
      setIsInfo(false);
      setIsLocalisation(true);
    };

    //States for complex information textInputs
   const [wilaya,setWilaya] = useState('Wilaya');
   const wilayas = ['Alger','Blida'];
   const [region,setRegion] = useState('Region');
   const regions = ['Hydra','Salombé','Bab Dzair','Said Hamdine','Bab Essebt','Joinville']; 
   
   
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

    

    
  
    return(
    <View style={styles.container}>
        <View style={styles.firstCard}>
          <ImageBackground source={require('../../../assets/images/man1-1.jpg')} style={styles.backgroundFirstCard} resizeMode='cover'/>
       </View>
       <View style={styles.secondCard}>
            <View style={styles.secondCardContent}>
                <View style={styles.imageContainer}>
                    <Image source={data[0].imagePth2} style={styles.image} />
                </View>
                <View style={styles.detailsContainer}>
                  <View style={{width:'30%'}}>
                    <TouchableOpacity style={styles.iconFormCircle1}>
                      <MaterialIcons title = "camera" name ='camera-enhance' color='#323446' size={23} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconFormCircle2}>
                      <MaterialIcons title = "delete" name ='delete-forever' color='#FE457C' size={27} />
                    </TouchableOpacity>
                  </View>  
                  <View style={{width:'70%'}}>
                    <Text style={styles.bnameText}>Merouane.S</Text>
                    <Text style={styles.age}>26 ans</Text>
                  </View>
                </View>
            </View>
          </View>
          <View style={styles.menuContainer}>
               <TouchableOpacity onPress={info} style={{padding:5,width:'50%',backgroundColor:isInfo?'#fd6c57':'#fff',alignItems:'center',justifyContent:'center'}}>
                  <Text style={{color:isInfo?'#fff':'#fd6c57',fontFamily:'poppins'}}>Informations</Text>
               </TouchableOpacity>
               <TouchableOpacity onPress={localisation} style={{padding:5,width:'50%',backgroundColor:isLocalisation?'#fd6c57':'#fff',alignItems:'center',justifyContent:'center'}}>
                   <Text style={{color:isLocalisation?'#fff':'#fd6c57',fontFamily:'poppins'}}>Localisation</Text>
               </TouchableOpacity>
          </View>
       {isInfo?(<ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <KeyboardAvoidingView keyboardVerticalOffset={10}>
            <View style={styles.bnameAgeContainer}>
                <View style={styles.inputBnameContainer}>
                    <Input 
                        rightIcon={<MaterialIcons title = "person-pin" name ='person-pin' color='#323446' size={23} />}
                        placeholder="Nom business"
                        inputContainerStyle={styles.input}
                        placeholderTextColor='rgba(50,52,70,0.4)'
                        inputStyle={{fontSize:15}}
                        />
                 </View>
                 <View style={styles.inputAgeContainer}>
                    <Input 
                        rightIcon={<MaterialCommunityIcons title = "age" name ='sort-numeric' color='#323446' size={23} />}
                        placeholder="Age"
                        inputContainerStyle={styles.input}
                        placeholderTextColor='rgba(50,52,70,0.4)'
                        inputStyle={{fontSize:15}}
                        />
                 </View>
            </View>
             
                 <View style={styles.inputPhoneContainer}>
                    <Input 
                        rightIcon={<MaterialIcons title = "name" name ='person' color='#323446' size={23} />}
                        placeholder="Nom"
                        inputContainerStyle={styles.input}
                        placeholderTextColor='rgba(50,52,70,0.4)'
                        inputStyle={{fontSize:15}}
                        />
                 </View>
                 <View style={styles.inputPhoneContainer}>
                    <Input 
                        rightIcon={<MaterialIcons title = "firstName" name ='person' color='#323446' size={23} />}
                        placeholder="Prénom"
                        inputContainerStyle={styles.input}
                        placeholderTextColor='rgba(50,52,70,0.4)'
                        inputStyle={{fontSize:15}}
                        />
                 </View>
                 <View style={styles.inputPhoneContainer}>
                    <Input 
                        rightIcon={<MaterialIcons title = "email" name ='email' color='#323446' size={23} />}
                        placeholder="Email"
                        inputContainerStyle={styles.input}
                        placeholderTextColor='rgba(50,52,70,0.4)'
                        inputStyle={{fontSize:15}}
                        />
                 </View>
                 <View style={styles.inputPhoneContainer}>
                    <Input 
                        rightIcon={<MaterialIcons title = "address" name ='map' color='#323446' size={23} />}
                        placeholder="Adresse"
                        inputContainerStyle={styles.input}
                        placeholderTextColor='rgba(50,52,70,0.4)'
                        inputStyle={{fontSize:15}}
                        />
                 </View>
                 <View style={styles.pickerContainer}>
                   {Platform.OS === 'android' ? 
                              <Picker
                              selectedValue={wilaya}
                              onValueChange={itemValue => setWilaya(itemValue)}
                              style={{fontFamily:'poppins',fontSize:12,color:'#323446'}}
                              >
                              {wilayas.map(el=> <Picker.Item label={el} value={el} key={el} />)}
                              </Picker> :
                              <Text onPress={onPress} style={{fontFamily:'poppins',fontSize:12,color:'#323446'}}>
                                {wilaya}
                              </Text>} 
                  </View>
                  <View style={styles.pickerContainerRegion}>
                   {Platform.OS === 'android' ? 
                              <Picker
                              selectedValue={region}
                              onValueChange={itemValue => setRegion(itemValue)}
                              style={{fontFamily:'poppins',fontSize:12,color:'#323446'}}
                              >
                              {regions.map(el=> <Picker.Item label={el} value={el} key={el} />)}
                              </Picker> :
                              <Text onPress={onPressRegion} style={{fontFamily:'poppins',fontSize:12,color:'#323446'}}>
                                {region}
                              </Text>} 
                  </View>
            </KeyboardAvoidingView>
       </ScrollView>):
       (<ScrollView style={{width:'100%'}} showsVerticalScrollIndicator={false}>
           <View style={styles.noticeContainer}>
               <Text style={styles.noticeTitle}>Remarque</Text>
               <Text style={styles.noticeContent}>Nous vous prions de cliquer sur le bouton au-dessous afin d'activer votre localisation et que nous pouvons calculer la distance entre vous et vos futurs clients. </Text>
               <Text style={styles.tahfifaSignature}>Equipe Tahfifa.</Text>
           </View>
           <View style={styles.buttonContainer}>
            <Button
                      theme={{colors: {primary:'#fd6c57'}}} 
                      title="Activez votre localisation"
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
         </ScrollView>)}
    </View>
    
     );    
};


BarberProfileScreen.navigationOptions = navData => {
    
    
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
      headerLeft : () =>(
        <HeaderButtons HeaderButtonComponent = {HeaderButton}> 
          <Item title = "menu" 
            iconName ='ios-menu'
            color='#fff'
            size={23}
            style={{paddingLeft:10}} 
            onPress={()=>navData.navigation.navigate('BarberSupport')}      
          />
        </HeaderButtons>),
      headerRight : () =>(
        <HeaderButtons HeaderButtonComponent = {HeaderButton}> 
          <Item title = "save" 
            iconName ='md-checkmark'
            color='#fff'
            size={23} 
            style={{paddingRight:10}}       
            onPress={()=>navData.navigation.navigate('BarberGalery')}      
          />
        </HeaderButtons>)
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
      justifyContent:'space-between',
      borderTopLeftRadius:30,
      borderTopRightRadius:30, 
      overflow:'visible'
    },
    secondCard:{
      height:80,
      width:'90%',
      backgroundColor:'white',
      borderRadius:10,
      marginTop:-50, 
      shadowColor: 'black',
      shadowOpacity: 0.96,
      shadowOffset: {width: 0, height:2},
      shadowRadius: 10,
      elevation: 5,
    },
    secondCardContent:{
      justifyContent:'space-around',
      flexDirection:'row'
    },
    imageContainer:{
      width:80,
      height:110
    },
    image:{
      width:'100%',
      height:'100%',
      borderRadius:10,
      marginTop:-60
    },
    detailsContainer:{
      marginTop:5,
      width:'60%',
      flexDirection:'row',
      justifyContent:'space-between',
      marginLeft:-15
    },
    bnameText:{
      fontFamily:'poppins-bold',
      color:'#323446',
      fontSize:18
    },
    secondFirstCard:{
      width:'95%',
      height:'20%',
      flexDirection:'row',
      justifyContent:'space-between',
      alignItems:'flex-end'
    },
    iconFormCircle1:{
      width:40,
      height:30,
      borderRadius:20,
      justifyContent:'center',
      alignItems:'center'
    },
    iconFormCircle2:{
      width:40,
      height:30,
      borderRadius:20,
      justifyContent:'center',
      alignItems:'center',
      
    },
    age:{
      fontFamily:'poppins',
      color:'grey',
      fontSize:11,
      marginTop:-5
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
    scrollView:{
      width:'100%',
      marginTop:20
    },
    bnameAgeContainer:{
      flexDirection:'row',
      width:'90%',
      alignSelf:'center'
    },
   inputPhoneContainer:{
    width:'90%',
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
  inputBnameContainer:{
    width:'60%',
    borderWidth:1,
    borderRadius:20,
    backgroundColor:'#fff',
    borderColor:'#fff',
    marginVertical:5,
    marginRight:5,
    shadowColor: 'black',
    shadowOpacity: 0.96,
    shadowOffset: {width: 0, height:2},
    shadowRadius: 10,
    elevation: 3,
    overflow:'hidden'
  },
  inputAgeContainer:{
    width:'40%',
    borderWidth:1,
    borderRadius:20,
    backgroundColor:'#fff',
    borderColor:'#fff',
    marginVertical:5,
    shadowColor: 'black',
    shadowOpacity: 0.96,
    shadowOffset: {width: 0, height:2},
    shadowRadius: 10,
    elevation: 3,
    overflow:'hidden'
  },
  input:{
    borderBottomWidth:0,
    paddingHorizontal:10
  },
  pickerContainer:{
    width:'90%',
    borderWidth:1,
    borderRadius:20,
    backgroundColor:'#fff',
    borderColor:'#fff',
    height:40,
    justifyContent:'center',
    paddingHorizontal:12,
    shadowColor: 'black',
    shadowOpacity: 0.96,
    shadowOffset: {width: 0, height:2},
    shadowRadius: 10,
    elevation: 3,
    overflow:'hidden',
    marginVertical:5,
    alignSelf:'center'
   },
   pickerContainerRegion:{
    width:'90%',
    borderWidth:1,
    borderRadius:20,
    backgroundColor:'#fff',
    borderColor:'#fff',
    height:40,
    justifyContent:'center',
    paddingHorizontal:12,
    shadowColor: 'black',
    shadowOpacity: 0.96,
    shadowOffset: {width: 0, height:2},
    shadowRadius: 10,
    elevation: 3,
    overflow:'hidden',
    marginTop:5,
    marginBottom:20,
    alignSelf:'center'
   },
   noticeContainer:{
     width:'90%',
     alignSelf:'center',
     marginBottom:15,
     marginTop:30
    },
    noticeTitle:{
      fontFamily:'poppins-bold',
      fontSize:13,
      color:'#323446'
    },
    noticeContent:{
      fontFamily:'poppins',
      fontSize:12,
      color:'#323446'
    },
    tahfifaSignature:{
      fontFamily:'poppins',
      fontSize:12,
      color:'#fd6c57',
      paddingTop:5
    },
    buttonContainer:{
      width:'90%',
      alignSelf:'center',
      marginVertical:15
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
    height:40,
    alignSelf:'center'
   }
});

export default BarberProfileScreen;