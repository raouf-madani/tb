import React,{useState,useEffect,useReducer,useCallback} from 'react';
import { StyleSheet,View,AsyncStorage,ScrollView,ImageBackground,TouchableOpacity,Text,Image,Alert,KeyboardAvoidingView,Dimensions,ActionSheetIOS,Picker} from 'react-native';
import {MaterialIcons,MaterialCommunityIcons,Ionicons} from "@expo/vector-icons";
import {useSelector,useDispatch} from 'react-redux';
import {HeaderButtons,Item} from "react-navigation-header-buttons";
import HeaderButton from "../../../components/HeaderButton";
import InputProfile from '../../../components/InputProfile';
import polylanar from "../../../lang/ar";
import polylanfr from "../../../lang/fr";

import * as authActions from '../../../store/actions/authActions';

import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

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

const BarberProfileScreen = props =>{

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

   const dispatch = useDispatch();
   
   
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
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///Input management

const[formState,disaptchFormState] = useReducer(formReducer,
  {inputValues:{
    b_name: '',
    age:'',
    name:'',
    surname:'',
    email:'',
    address:'',
    region:''
  },
   inputValidities:{
    b_name: false,
    age:false,
    name:false,
    surname:false,
    email:false,
    address:false,
    region:false
   },
   formIsValid:false});

const inputChangeHandler = useCallback((inputIdentifier, inputValue,inputValidity) =>{

disaptchFormState({type:Form_Input_Update,value:inputValue,isValid:inputValidity,inputID:inputIdentifier});
},[disaptchFormState]);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //logout handler
    const logout = ()=>{
      dispatch(authActions.logout());
      AsyncStorage.clear();
      props.navigation.navigate('Auth');
    }
  
    return(
    <View style={styles.container}>
        <View style={styles.firstCard}>
          <ImageBackground source={require('../../../assets/images/man1-1.jpg')} style={styles.backgroundFirstCard} resizeMode='cover'/>
       </View>
       <View style={styles.secondCard}>
            <View style={styles.secondCardContent}>
                <View style={styles.imageContainer}>
                    <Image source={require('../../../assets/images/man2.jpg')} style={styles.image} />
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
                   <Text style={{color:isLocalisation?'#fff':'#fd6c57',fontFamily:'poppins'}}>Mon Compte</Text>
               </TouchableOpacity>
          </View>
       {isInfo?(<ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <KeyboardAvoidingView keyboardVerticalOffset={10}>
            <View style={styles.bnameAgeContainer}>
              <View style={styles.inputBnameContainer}>
                <InputProfile
                      id='b_name'
                      rightIcon={<MaterialIcons title = "person-pin" name ='person-pin' color='#323446' size={23} />}
                      placeholder='Nom business'
                      keyboardType="default"
                      returnKeyType="next"
                      onInputChange={inputChangeHandler}
                      initialValue=''
                      initiallyValid={true}
                      required
                      placeholderTextColor='rgba(50,52,70,0.4)'
                      inputStyle={{fontSize:15}}
                    />
              </View>
              <View style={styles.inputAgeContainer}>
                <InputProfile
                      id='age'
                      rightIcon={<MaterialCommunityIcons title = "age" name ='sort-numeric' color='#323446' size={23} />}
                      placeholder='Age'
                      keyboardType="phone-pad"
                      returnKeyType="next"
                      onInputChange={inputChangeHandler}
                      initialValue=''
                      initiallyValid={true}
                      required
                      placeholderTextColor='rgba(50,52,70,0.4)'
                      inputStyle={{fontSize:15}}
                    />
              </View>
            </View>
            <View style={styles.inputPhoneContainer}>
              <InputProfile
                  id='name'
                  rightIcon={<MaterialIcons title = "firstName" name ='person' color='#323446' size={23} />}
                  placeholder='Nom'
                  keyboardType="default"
                  returnKeyType="next"
                  onInputChange={inputChangeHandler}
                  initialValue=''
                  initiallyValid={true}
                  required
                  placeholderTextColor='rgba(50,52,70,0.4)'
                  inputStyle={{fontSize:15}}
                  minLength={3}
                  autoCapitalize='sentences'
                />
             </View>
             <View style={styles.inputPhoneContainer}>
              <InputProfile
                id='surname'
                rightIcon={<MaterialIcons title = "firstName" name ='person' color='#323446' size={23} />}
                placeholder='Prénom'
                keyboardType="default"
                returnKeyType="next"
                onInputChange={inputChangeHandler}
                initialValue=''
                initiallyValid={true}
                required
                placeholderTextColor='rgba(50,52,70,0.4)'
                inputStyle={{fontSize:15}}
                minLength={3}
                autoCapitalize='sentences'
              />
            </View>
            <View style={styles.inputPhoneContainer}>
              <InputProfile
                  id='email'
                  rightIcon={<MaterialIcons title = "email" name ='email' color='#323446' size={23} />}
                  placeholder='Email'
                  keyboardType="default"
                  returnKeyType="next"
                  onInputChange={inputChangeHandler}
                  initialValue=''
                  initiallyValid={true}
                  email
                  required
                  placeholderTextColor='rgba(50,52,70,0.4)'
                  inputStyle={{fontSize:15}}
                  minLength={6}
                  autoCapitalize='sentences'
                />
            </View>
            <View style={styles.inputPhoneContainer}>
              <InputProfile
                id='address'
                rightIcon={<MaterialIcons title = "address" name ='map' color='#323446' size={23} />}
                placeholder='Adresse'
                keyboardType="default"
                returnKeyType="next"
                onInputChange={inputChangeHandler}
                initialValue=''
                initiallyValid={true}
                required
                placeholderTextColor='rgba(50,52,70,0.4)'
                inputStyle={{fontSize:15}}
                minLength={12}
                autoCapitalize='sentences'
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
            <View style={styles.inputPhoneContainer}>
              <InputProfile
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
                inputStyle={{fontSize:15}}
              />
            </View>
            </KeyboardAvoidingView>
       </ScrollView>):
       (<ScrollView style={{width:'100%'}} showsVerticalScrollIndicator={false}>
           <View style={styles.noticeContainer}>
               <Text style={styles.noticeTitle}>Remarque</Text>
               <Text style={styles.noticeContent}>Avertir notre équipe avant de supprimer votre compte!</Text>
               <Text style={styles.tahfifaSignature}>Equipe Tahfifa.</Text>
           </View>
           <View style={styles.buttonContainer}>
                <View style={styles.cartContainer}>
                  <TouchableOpacity style={styles.cart} onPress={logout}>
                      <View style={{paddingBottom:5}}>
                        <MaterialCommunityIcons title = "logout" name ='logout' color='#FD6C57' size={23} />
                      </View>
                      <View>
                        <Text style={styles.optionTitle}>Se déconnecter</Text>
                      </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.cartContainer}>
                  <TouchableOpacity style={styles.cart} onPress={()=>props.navigation.navigate('BarberSupport')}>
                       <View style={{paddingBottom:5}}>
                         <Ionicons title = "options" name ='ios-options' color='#56A7FF' size={23} />
                       </View>
                       <View>
                         <Text style={styles.optionTitle}>Paramètres</Text>
                       </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.cartContainer}>
                  <TouchableOpacity style={styles.cart}>
                         <View style={{paddingBottom:5}}>
                            <MaterialCommunityIcons title = "delete" name ='delete-forever' color='#FE457C' size={23} />
                          </View>
                          <View>
                            <Text style={styles.optionTitle}>Mon compte</Text>
                          </View>
                  </TouchableOpacity>
                </View>
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
      marginVertical:20
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
    optionTitle:{
      fontFamily:'poppins-bold',
      fontSize:11,
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
      marginVertical:10,
      flexDirection:'row'
    },
    cart:{
      width:'90%',
      height:'95%',
      alignItems:'center',
      justifyContent:'center',
      shadowColor: 'black',
      shadowOpacity: 0.96,
      shadowOffset: {width: 0, height:2},
      shadowRadius: 10,
      elevation: 2,
      overflow:'hidden',
      borderRadius:10
    },
    cartContainer:{
      width:'33%',
      height:100,
      alignItems:'center',
      justifyContent:'center',
      
    }
});

export default BarberProfileScreen;