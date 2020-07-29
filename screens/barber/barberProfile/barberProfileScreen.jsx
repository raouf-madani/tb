import React,{useState,useEffect,useReducer,useCallback} from 'react';
import { StyleSheet,View,AsyncStorage,ScrollView,ImageBackground,TouchableOpacity,Text,Image,Alert,KeyboardAvoidingView,Dimensions,ActionSheetIOS,Picker,ActivityIndicator} from 'react-native';
import {MaterialIcons,MaterialCommunityIcons,Ionicons} from "@expo/vector-icons";
import {useSelector,useDispatch} from 'react-redux';
import Colors from "../../../constants/Colors";
import {HeaderButtons,Item} from "react-navigation-header-buttons";
import HeaderButton from "../../../components/HeaderButton";
import InputProfile from '../../../components/InputProfile';
import polylanar from "../../../lang/ar";
import polylanfr from "../../../lang/fr";

import * as barberActions from '../../../store/actions/barberActions';
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
    //State for update loading 
    const [isLoading,setIsLoading]=useState(false);
    const [isLoadingImage,setIsLoadingImage]=useState(false);
    
    //bring firebase user id
    const barberUID= props.navigation.getParam('barberUID');
    //get the barber's data
    const barber= useSelector(state=>state.barbers.barber);

    const info = ()=>{
      setIsInfo(true);
      setIsLocalisation(false);
    };
    const localisation = ()=>{
      setIsInfo(false);
      setIsLocalisation(true);
    };

    //States for complex information textInputs
   const [wilaya,setWilaya] = useState(barber[0]?barber[0].wilaya:undefined);
   const wilayas = ['wilaya','Alger','Blida'];

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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///ImagePicker

//state for image
const [pickedImage,setPickedImage]= useState(barber[0]?barber[0].image : undefined);


const verifyPermissions= async ()=>{
  const result= await Permissions.askAsync(Permissions.CAMERA,Permissions.CAMERA_ROLL);
  if(result.status !== 'granted'){
      Alert.alert('Permissions insuffisantes!',
      'Vous devez accorder les autorisations de la caméra pour utiliser cette application.',
      [{text:"D'accord"}]);
      return false;
  }
  return true;
};

const takeImageHandler = async ()=>{
 const hasPermissions = await verifyPermissions();
 if(!hasPermissions){
     return;
 }
 const image = await ImagePicker.launchCameraAsync({
  mediaTypes: ImagePicker.MediaTypeOptions.All,
     allowsEditing:true,
     aspect:[60,60],
     quality:0.7
 });
  
  setPickedImage(image.uri);
  
};



const takeLibraryHandler = async ()=>{
  const hasPermissions = await verifyPermissions();
  if(!hasPermissions){
      return;
  }
 
  const library = await ImagePicker.launchImageLibraryAsync({
   mediaTypes: ImagePicker.MediaTypeOptions.All,
   allowsEditing:true,
   aspect:[60,60],
   quality:0.7
 });
  
  
  if(library){
   setPickedImage(library.uri);
  }
  
  
 };


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///Input management

const[formState,disaptchFormState] = useReducer(formReducer,
  {inputValues:{
    b_name: barber[0]?barber[0].b_name:'',
    age:barber[0]?barber[0].age.toString():'',
    name:barber[0]?barber[0].name:'',
    surname:barber[0]?barber[0].surname:'',
    email:barber[0]?barber[0].email:'',
    address:barber[0]?barber[0].address:'',
    region:barber[0]?barber[0].region:''
  },
   inputValidities:{
    b_name: true,
    age:true,
    name:true,
    surname:true,
    email:true,
    address:true,
    region:true
   },
   formIsValid:true});

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

    const deleteAccount= async()=>{
      try{
 
         dispatch(barberActions.deleteBarber(barber[0].id));
         dispatch(authActions.deleteUser(barberUID)); 
         dispatch(authActions.logout());
         AsyncStorage.clear();
         props.navigation.navigate('Auth');
      }catch(err){
       console.log(err);
       Alert.alert('Oups!','Une erreur est survenue!',[{text:"OK"}]);
      }
   };
 
   const alertDelete = ()=>{
      Alert.alert(
       'Attention!',
       'Voulez-vous vraiment supprimer votre compte?',
       [{text:'Oui', style:'destructive', onPress:deleteAccount},
        {text:'Non', style:'cancel'}]);
        return;
   };

   //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //Update player's data Management after pressing in Check icon
  const saveHandler = useCallback(async()=>{
    if(formState.formIsValid && wilaya!=='Wilaya'){
      
    try{
        setIsLoading(true);
         await dispatch(barberActions.updateBarber(barber[0].id,formState.inputValues.name,formState.inputValues.surname,
                                          formState.inputValues.b_name,formState.inputValues.age,
                                          formState.inputValues.email,formState.inputValues.address,
                                          wilaya,formState.inputValues.region,pickedImage));
        setIsLoading(false);                        
        Alert.alert('Félicitation!','Vos données ont été changées avec succès!',[{text:"OK"}]);
  
    }catch(err){
      console.log(err);
      Alert.alert('Oups!','Une erreur est survenue!',[{text:"OK"}]);
    }
    
    }else{
      Alert.alert('Erreur!','Veuillez remplir le(s) champ(s) manquants svp!',[{text:"OK"}]);
    }
  
  },[dispatch,barber[0].id,formState,pickedImage,wilaya]);

   useEffect(()=>{
     props.navigation.setParams({load:isLoading});
     props.navigation.setParams({save:saveHandler});
     
   },[saveHandler,isLoading]);

  
    return(
    <View style={styles.container}>
        <View style={styles.firstCard}>
          <ImageBackground source={require('../../../assets/images/man1-1.jpg')} style={styles.backgroundFirstCard} resizeMode='cover'/>
       </View>
       <View style={styles.secondCard}>
            <View style={styles.secondCardContent}>
                <View style={styles.imageContainer}>
                {!pickedImage ? <Image source={require('../../../assets/images/man2.jpg')} style={styles.image} />
                : (<Image style={styles.image} source={{uri:pickedImage}} />)}
                </View>
                <View style={styles.detailsContainer}>
                  <View style={{width:'30%'}}>
                    <TouchableOpacity style={styles.iconFormCircle1} onPress={takeImageHandler}>
                      <MaterialIcons title = "camera" name ='camera-enhance' color='#323446' size={23} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconFormCircle1} onPress={takeLibraryHandler}>
                      <MaterialIcons title = "library" name ='photo-library' color='#323446' size={23} />
                    </TouchableOpacity>
                  </View>  
                  <View style={{width:'70%'}}>
                    <Text style={styles.bnameText}>{barber[0].b_name!==null?barber[0].b_name: 'Nom buisness'}</Text>
                    <Text style={styles.age}>{barber[0].age!==null?barber[0].age+' ans': 'Votre age'}</Text>
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
              
                <InputProfile
                      id='b_name'
                      rightIcon={<MaterialIcons title = "person-pin" name ='person-pin' color='#323446' size={23} />}
                      placeholder='Nom business'
                      keyboardType="default"
                      returnKeyType="next"
                      onInputChange={inputChangeHandler}
                      initialValue={barber[0]?barber[0].b_name:''}
                      initiallyValid={true}
                      required
                      placeholderTextColor='rgba(50,52,70,0.4)'
                      inputStyle={{fontSize:15}}
                      widthView='57%'
                    />
              
              
                <InputProfile
                      id='age'
                      rightIcon={<MaterialCommunityIcons title = "age" name ='sort-numeric' color='#323446' size={23} />}
                      placeholder='Age'
                      keyboardType="phone-pad"
                      returnKeyType="next"
                      onInputChange={inputChangeHandler}
                      initialValue={barber[0]?barber[0].age.toString():''}
                      initiallyValid={true}
                      required
                      placeholderTextColor='rgba(50,52,70,0.4)'
                      inputStyle={{fontSize:15}}
                      widthView='40%'
                    />
              </View>
            
            
              <InputProfile
                  id='name'
                  rightIcon={<MaterialIcons title = "firstName" name ='person' color='#323446' size={23} />}
                  placeholder='Nom'
                  keyboardType="default"
                  returnKeyType="next"
                  onInputChange={inputChangeHandler}
                  initialValue={barber[0]?barber[0].name:''}
                  initiallyValid={true}
                  required
                  placeholderTextColor='rgba(50,52,70,0.4)'
                  inputStyle={{fontSize:15}}
                  minLength={3}
                  autoCapitalize='sentences'
                  widthView='90%'
                />
             
             
              <InputProfile
                id='surname'
                rightIcon={<MaterialIcons title = "firstName" name ='person' color='#323446' size={23} />}
                placeholder='Prénom'
                keyboardType="default"
                returnKeyType="next"
                onInputChange={inputChangeHandler}
                initialValue={barber[0]?barber[0].surname:''}
                initiallyValid={true}
                required
                placeholderTextColor='rgba(50,52,70,0.4)'
                inputStyle={{fontSize:15}}
                minLength={3}
                autoCapitalize='sentences'
                widthView='90%'
              />
            
           
              <InputProfile
                  id='email'
                  rightIcon={<MaterialIcons title = "email" name ='email' color='#323446' size={23} />}
                  placeholder='Email'
                  keyboardType="default"
                  returnKeyType="next"
                  onInputChange={inputChangeHandler}
                  initialValue={barber[0]?barber[0].email:''}
                  initiallyValid={true}
                  email
                  required
                  placeholderTextColor='rgba(50,52,70,0.4)'
                  inputStyle={{fontSize:15}}
                  minLength={6}
                  autoCapitalize='sentences'
                  widthView='90%'
                />
            
              <InputProfile
                id='address'
                rightIcon={<MaterialIcons title = "address" name ='map' color='#323446' size={23} />}
                placeholder='Adresse'
                keyboardType="default"
                returnKeyType="next"
                onInputChange={inputChangeHandler}
                initialValue={barber[0]?barber[0].address:''}
                initiallyValid={true}
                required
                placeholderTextColor='rgba(50,52,70,0.4)'
                inputStyle={{fontSize:15}}
                minLength={12}
                autoCapitalize='sentences'
                widthView='90%'
              />
            
            <View style={{ width:'90%',borderWidth:1,paddingHorizontal:12,borderRadius:25,backgroundColor:'#fff',borderColor:wilaya!=='wilaya'?'#fff':Colors.primary,marginVertical:5,height:45,justifyContent:'center',shadowColor: 'black',shadowOpacity: 0.96,
                          shadowOffset: {width: 0, height:2},shadowRadius: 10,elevation: 3,overflow:'hidden',alignSelf:'center'}}>
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
            
              <InputProfile
                id='region'
                rightIcon={<MaterialIcons title="region" name ='home' color='#323446' size={23} />}
                placeholder='Région'
                keyboardType="default"
                returnKeyType="next"
                minLength={3}
                autoCapitalize='sentences'
                onInputChange={inputChangeHandler}
                initialValue={barber[0]?barber[0].region:''}
                initiallyValid={true}
                required
                placeholderTextColor='rgba(50,52,70,0.4)'
                inputStyle={{fontSize:15}}
                widthView='90%'
              />
           
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
                  <TouchableOpacity style={styles.cart} onPress={()=>props.navigation.navigate('BarberParameters',{barberUID:barberUID})}>
                       <View style={{paddingBottom:5}}>
                         <Ionicons title = "options" name ='ios-options' color='#56A7FF' size={23} />
                       </View>
                       <View>
                         <Text style={styles.optionTitle}>Paramètres</Text>
                       </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.cartContainer}>
                  <TouchableOpacity style={styles.cart} onPress={alertDelete}>
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
  const saveFunction=navData.navigation.getParam('save');
  const load=navData.navigation.getParam('load');
    
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
      headerRight : ()=> (load ? <ActivityIndicator color={Colors.primary} style={{marginRight:10}} />:
        <HeaderButtons HeaderButtonComponent = {HeaderButton}> 
          <Item title = "save" 
            iconName ='md-checkmark'
            color={Platform.OS === 'android' ? 'white' : Colors.blue}
            onPress={saveFunction}
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
      alignSelf:'center',
      justifyContent:'space-between'
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