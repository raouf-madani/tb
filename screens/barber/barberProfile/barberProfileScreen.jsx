import React,{useState,useEffect,useReducer,useCallback} from 'react';
import { StyleSheet,View,Linking,ScrollView,TouchableWithoutFeedback,Keyboard,ImageBackground,TouchableOpacity,Text,Image,Alert,KeyboardAvoidingView,Dimensions,ActivityIndicator,Platform,StatusBar,ActionSheetIOS} from 'react-native';
import {MaterialIcons,MaterialCommunityIcons,Ionicons,AntDesign} from "@expo/vector-icons";
import {useSelector,useDispatch} from 'react-redux';
import Colors from "../../../constants/Colors";
import {HeaderButtons,Item} from "react-navigation-header-buttons";
import HeaderButton from "../../../components/HeaderButton";
import InputProfile from '../../../components/InputProfile';
import polylanar from "../../../lang/ar";
import polylanfr from "../../../lang/fr";
import RNPickerSelect from 'react-native-picker-select';
import * as barberActions from '../../../store/actions/barberActions';
import * as authActions from '../../../store/actions/authActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { deleteToken } from '../../../store/actions/tokenActions';

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
    const [error,setError]=useState();
    
    
    //bring firebase user id
    const barberUID= props.navigation.getParam('barberUID');
    const barberID=props.navigation.getParam('barberID');
    //get the barber's data
    const barber= useSelector(state=>state.barbers.barber);
    const myToken = useSelector(state=>state.tokens.currentToken);

    const info = ()=>{
      setIsInfo(true);
      setIsLocalisation(false);
    };
    const localisation = ()=>{
      setIsInfo(false);
      setIsLocalisation(true);
    };

  const URL = "http://rebornapp.com";
  const URLAbout = "http://rebornapp.com/qui-sommes-nous/";
  const url= ()=>{
    Linking.openURL(URL).catch((err) => {
      if(err){
        Alert.alert(barber && barber[0].lang?polylanfr.Oups:polylanar.Oups,barber && barber[0].lang?polylanfr.WeakInternet:polylanar.WeakInternet,[{text:barber && barber[0].lang?polylanfr.OK:polylanar.OK}]);
    } 
    });
   };
   const url2= ()=>{
    Linking.openURL(URLAbout).catch((err) => {
      if(err){
        Alert.alert(barber && barber[0].lang?polylanfr.Oups:polylanar.Oups,barber && barber[0].lang?polylanfr.WeakInternet:polylanar.WeakInternet,[{text:barber && barber[0].lang?polylanfr.OK:polylanar.OK}]);
    } 
    });
   };

    //States for complex information textInputs
   const [wilaya,setWilaya] = useState(barber[0]?barber[0].wilaya:null);
   const wilayas = ['Wilaya','Alger','Blida'];

   const dispatch = useDispatch();

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
   
  
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///ImagePicker

//state for image
const [pickedImage,setPickedImage]= useState(barber[0]?barber[0].image : false);


const verifyPermissions= async ()=>{
  const result= await Permissions.askAsync(Permissions.CAMERA,Permissions.CAMERA_ROLL);
  if(result.status !== 'granted'){
      Alert.alert('Permissions insuffisantes!',
      'Vous devez accorder les autorisations de la caméra pour utiliser cette application.',
      [{text:barber && barber[0].lang?polylanfr.Agree:polylanar.Agree}]);
      return false;
  }
  return true;
};

//////////////////////////****************************************************************************Image 1 
    const takeImageHandler = async ()=>{

      try{
      const hasPermissions = await verifyPermissions();
      if(!hasPermissions){
          return;
      }
      let image = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing:true,
          aspect:[60,60],
          quality:0.7,
          base64: true
      });
      
      if (!image.cancelled) {
        const imageSplit= image.uri.split('/');
        const imageName= imageSplit.pop();
        
        setPickedImage(imageName);
        
        setIsLoadingImage(true);
        await dispatch(barberActions.updateBarberImage(barberID,image.base64,imageName));
        setIsLoadingImage(false);
        }
      }catch(err){
        console.log(err);
      Alert.alert(barber && barber[0].lang?polylanfr.Oups:polylanar.Oups,barber && barber[0].lang?polylanfr.WeakInternet:polylanar.WeakInternet,[{text:barber && barber[0].lang?polylanfr.OK:polylanar.OK}]);
      }
    };

      const takeLibraryHandler = async ()=>{

      try{
        const hasPermissions = await verifyPermissions();
        if(!hasPermissions){
            return;
        }

        let library = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing:true,
        aspect:[60,60],
        quality:0.7,
        base64: true
      });

      if (!library.cancelled) {
        const imageSplit= library.uri.split('/');
        const imageName= imageSplit.pop();
        
        setPickedImage(imageName);
        
        setIsLoadingImage(true);
        await dispatch(barberActions.updateBarberImage(barberID,library.base64,imageName));
        setIsLoadingImage(false);
        }
      }catch(err){
        console.log(err);
        Alert.alert(barber && barber[0].lang?polylanfr.Oups:polylanar.Oups,barber && barber[0].lang?polylanfr.WeakInternet:polylanar.WeakInternet,[{text:barber && barber[0].lang?polylanfr.OK:polylanar.OK}]);
        }
      
      };


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///Input management

const[formState,disaptchFormState] = useReducer(formReducer,
  {inputValues:{
    b_name: barber[0]?barber[0].b_name:'',
    age:barber[0]?barber[0].age:'',
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
    const logout = async ()=>{
      let isMounted=true;
      await  dispatch(deleteToken(myToken));
      dispatch(authActions.logout());
      AsyncStorage.clear();
      props.navigation.navigate('Auth');
      
      return ()=>{
        isMounted = false;
      };
    };

    const alertLogout = ()=>{
      Alert.alert(
        barber && barber[0].lang?polylanfr.Warning:polylanar.Warning,
        barber && barber[0].lang?polylanfr.DoYouWantToDisconnect:polylanar.DoYouWantToDisconnect,
       [{text:barber && barber[0].lang?polylanfr.Yes:polylanar.Yes, style:'destructive', onPress:logout},
        {text:barber && barber[0].lang?polylanfr.No:polylanar.No, style:'cancel'}]);
        
   };

   

   //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //Update barber's data Management after pressing in Check icon
  const saveHandler = useCallback(async()=>{
    if(formState.formIsValid && (wilaya!==null || wilaya!==wilayas[0])){
      
      
    try{
        setIsLoading(true);
        setError(false);
         await dispatch(barberActions.updateBarber(barberID,formState.inputValues.name,formState.inputValues.surname,
                                          formState.inputValues.b_name,formState.inputValues.age,
                                          formState.inputValues.email,formState.inputValues.address,
                                          wilaya,formState.inputValues.region));
        setIsLoading(false); 
                               
        Alert.alert(barber && barber[0].lang?polylanfr.Congratulations:polylanar.Congratulations,barber && barber[0].lang?polylanfr.SuccessfulDataSent:polylanar.SuccessfulDataSent,[{text:barber && barber[0].lang?polylanfr.OK:polylanar.OK}]);
  
    }catch(err){
      console.log(err);
      setError(true);
      if(error){
        Alert.alert(barber && barber[0].lang?polylanfr.Oups:polylanar.Oups,barber && barber[0].lang?polylanfr.WeakInternet:polylanar.WeakInternet,[{text:barber && barber[0].lang?polylanfr.OK:polylanar.OK}]);
       }
       throw err;
    }
    
    }else{
      Alert.alert(barber[0] && barber[0].lang?polylanfr.Error:polylanar.Error,barber && barber[0].lang?polylanfr.EmptyFields:polylanar.EmptyFields,[{text:barber && barber[0].lang?polylanfr.OK:polylanar.OK}]);
    }
  
  },[dispatch,barber[0].id,formState,wilaya]);

   useEffect(()=>{
    let isMounted = true; // note this flag denote mount status
     props.navigation.setParams({load:isLoading});
     props.navigation.setParams({save:saveHandler});

     return ()=>{
      isMounted = false;
    };
   },[saveHandler,isLoading]);


   if(isLoadingImage){
    return <ImageBackground source={{uri:'http://95.111.243.233/assets/tahfifabarber/support.png'}} style={styles.activityIndicatorContainer} >
            <StatusBar hidden />
            <ActivityIndicator size='large' color={Colors.primary} />
           </ImageBackground>
  };

  
    return(
      <TouchableWithoutFeedback onPress = {()=>Keyboard.dismiss()}>  
    <View style={styles.container}>
    <StatusBar hidden />
        <View style={styles.firstCard}>
          <ImageBackground source={barber[0].sex==='Femme'?{uri:'http://95.111.243.233/assets/tahfifabarber/woman5.jpg'}:{uri:'http://95.111.243.233/assets/tahfifabarber/loginimage.jpg'}} style={styles.backgroundFirstCard} resizeMode='cover'/>
       </View>
       <View style={styles.secondCard}>
            <View style={styles.secondCardContent}>
                <View style={styles.imageContainer}>
                {barber && pickedImage?<Image source={{uri:`http://95.111.243.233/profileImages/barber/${pickedImage}`}} style={styles.image} />:
                barber && barber[0].sex==='Homme'? <Image source={{uri:'http://95.111.243.233/assets/tahfifabarber/unknown.jpg'}} style={styles.image} />:<Image source={{uri:'http://95.111.243.233/assets/tahfifabarber/unknownfemale.jpg'}} style={styles.image}/>}
                </View>
                <View style={styles.detailsContainer}>
                  <View style={{width:'30%'}}>
                    <TouchableOpacity style={styles.iconFormCircle1} onPress={takeImageHandler}>
                      <MaterialIcons title = "camera" name ='camera-enhance' color='#323446' size={screen.width/15.7} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconFormCircle1} onPress={takeLibraryHandler}>
                      <MaterialIcons title = "library" name ='photo-library' color='#FE457C' size={screen.width/15.7} />
                    </TouchableOpacity>
                  </View>  
                  <View style={{width:'70%'}}>
                    <Text style={styles.bnameText}>{barber[0].b_name!==null?barber[0].b_name: barber && barber[0].lang?polylanfr.BusinessName:polylanar.BusinessName}</Text>
                    <Text style={styles.age}>{barber[0].age && barber[0].lang?`${barber[0].age} ans`: barber[0].age!==null && !barber[0].lang?barber[0].age+' سنة':barber[0].age===null && barber[0].lang?polylanfr.YourAge:barber[0].age===null && !barber[0].lang?polylanar.YourAge :undefined}</Text>
                  </View>
                </View>
            </View>
          </View>
          <View style={styles.menuContainer}>
               <TouchableOpacity onPress={info} style={{padding:screen.width/72,width:'50%',backgroundColor:isInfo?'#fd6c57':'#fff',alignItems:'center',justifyContent:'center'}}>
                  <Text style={{color:isInfo?'#fff':'#fd6c57',fontFamily:'poppins'}}>{barber && barber[0].lang?polylanfr.profileInfo:polylanar.profileInfo}</Text>
               </TouchableOpacity>
               <TouchableOpacity onPress={localisation} style={{padding:screen.width/72,width:'50%',backgroundColor:isLocalisation?'#fd6c57':'#fff',alignItems:'center',justifyContent:'center'}}>
                   <Text style={{color:isLocalisation?'#fff':'#fd6c57',fontFamily:'poppins'}}>{barber && barber[0].lang?polylanfr.MyAccount:polylanar.MyAccount}</Text>
               </TouchableOpacity>
          </View>
       {isInfo?(<ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <KeyboardAvoidingView keyboardVerticalOffset={10}  behavior={Platform.OS === "ios" ? "padding" : null}>
            <View style={styles.bnameAgeContainer}>
              
                <InputProfile
                      id='b_name'
                      rightIcon={<MaterialCommunityIcons title = "instagram" name ='instagram' color={Platform.OS==='android'?'#323446':'#fff'} size={screen.width/15.7} />}
                      placeholder={barber && barber[0].lang?polylanfr.BusinessName:polylanar.BusinessName}
                      keyboardType="default"
                      returnKeyType="next"
                      onInputChange={inputChangeHandler}
                      initialValue={barber[0]?barber[0].b_name:''}
                      initiallyValid={true}
                      required
                      placeholderTextColor={Platform.OS==='android'?'rgba(50,52,70,0.4)':'#f9f9f9'}
                      widthView='57%'
                      backgroundColor={Platform.OS==='android'?'#fff':Colors.blue}
                      height={screen.width/8}
                      autoCapitalize='none'
                    />
              
              
                <InputProfile
                      id='age'
                      rightIcon={<AntDesign title = "age" name ='idcard' color={Platform.OS==='android'?'#323446':'#fff'} size={screen.width/15.7} />}
                      placeholder={barber && barber[0].lang?polylanfr.Age:polylanar.Age}
                      keyboardType="phone-pad"
                      returnKeyType="next"
                      onInputChange={inputChangeHandler}
                      initialValue={barber[0].age!== null && barber[0].lang?`${barber[0].age} ans`:barber[0].age!== null && !barber[0].lang?`${barber[0].age} سنة`:''}
                      initiallyValid={true}
                      required
                      placeholderTextColor={Platform.OS==='android'?'rgba(50,52,70,0.4)':'#f9f9f9'}
                      widthView='40%'
                      backgroundColor={Platform.OS==='android'?'#fff':Colors.blue}
                      height={screen.width/8}
                    />
              </View>
            
            
              <InputProfile
                  id='name'
                  rightIcon={<MaterialIcons title = "firstName" name ='person' color={Platform.OS==='android'?'#323446':'#fff'} size={screen.width/15.7} />}
                  placeholder={barber && barber[0].lang?polylanfr.Name:polylanar.Name}
                  keyboardType="default"
                  returnKeyType="next"
                  onInputChange={inputChangeHandler}
                  initialValue={barber[0]?barber[0].name:''}
                  initiallyValid={true}
                  required
                  placeholderTextColor={Platform.OS==='android'?'rgba(50,52,70,0.4)':'#f9f9f9'}
                  minLength={3}
                  autoCapitalize='sentences'
                  widthView='90%'
                  backgroundColor={Platform.OS==='android'?'#fff':Colors.blue}
                  height={screen.width/8}
                />
             
             
              <InputProfile
                id='surname'
                rightIcon={<MaterialIcons title = "firstName" name ='person' color={Platform.OS==='android'?'#323446':'#fff'} size={screen.width/15.7} />}
                placeholder={barber && barber[0].lang?polylanfr.Surname:polylanar.Surname}
                keyboardType="default"
                returnKeyType="next"
                onInputChange={inputChangeHandler}
                initialValue={barber[0]?barber[0].surname:''}
                initiallyValid={true}
                required
                placeholderTextColor={Platform.OS==='android'?'rgba(50,52,70,0.4)':'#f9f9f9'}
                minLength={3}
                autoCapitalize='sentences'
                widthView='90%'
                backgroundColor={Platform.OS==='android'?'#fff':Colors.blue}
                height={screen.width/8}
              />
            
           
              <InputProfile
                  id='email'
                  rightIcon={<MaterialIcons title = "email" name ='email' color={Platform.OS==='android'?'#323446':'#fff'} size={screen.width/15.7} />}
                  placeholder={barber && barber[0].lang?polylanfr.Email:polylanar.Email}
                  keyboardType="default"
                  returnKeyType="next"
                  onInputChange={inputChangeHandler}
                  initialValue={barber[0]?barber[0].email:''}
                  initiallyValid={true}
                  email
                  required
                  placeholderTextColor={Platform.OS==='android'?'rgba(50,52,70,0.4)':'#f9f9f9'}
                  minLength={6}
                  widthView='90%'
                  backgroundColor={Platform.OS==='android'?'#fff':Colors.blue}
                  height={screen.width/8}
                  autoCapitalize='none'
                />
            
              <InputProfile
                id='address'
                rightIcon={<MaterialIcons title = "address" name ='home' color={Platform.OS==='android'?'#323446':'#fff'} size={screen.width/15.7} />}
                placeholder={barber && barber[0].lang?polylanfr.ComfortZone:polylanar.ComfortZone}
                keyboardType="default"
                returnKeyType="next"
                onInputChange={inputChangeHandler}
                initialValue={barber[0]?barber[0].address:''}
                initiallyValid={true}
                required
                placeholderTextColor={Platform.OS==='android'?'rgba(50,52,70,0.4)':'#f9f9f9'}
                minLength={12}
                autoCapitalize='sentences'
                widthView='90%'
                backgroundColor={Platform.OS==='android'?'#fff':Colors.blue}
                height={screen.width/8}
              />
            
            <View style={{ width:'90%',borderWidth:1,paddingHorizontal:screen.width/18,borderRadius:screen.width/14.4,backgroundColor:Platform.OS==='android'?'#fff':Colors.blue,borderColor:wilaya!=='wilaya'?'#fff':Colors.primary,marginVertical:screen.width/72,height:screen.width/8,justifyContent:'center',shadowColor: 'black',shadowOpacity: 0.96,
                          shadowOffset: {width: 0, height:2},shadowRadius: screen.width/36,elevation: 3,overflow:'hidden',alignSelf:'center'}}>
              { Platform.OS==='android'?(<RNPickerSelect
                              value={wilaya}
                              useNativeAndroidPickerStyle={false}
                              style={{ inputIOS:{fontFamily:'poppins',fontSize:screen.width/30,color:'#fff'},inputAndroid: {
                                fontFamily:'poppins',
                                color:'#323446',
                                fontSize:screen.width/30
                              }}}
                              placeholder={{label:barber && barber[0].lang?polylanfr.City:polylanar.City,value:null}}
                              onValueChange={itemValue => setWilaya(itemValue)}
                              doneText={barber && barber[0].lang?polylanfr.Cancel:polylanar.Cancel}
                              items={[
                                { label: 'Alger', value: 'Alger'}
                            ]}
                            />):(<TouchableOpacity onPress={onPress}  style={{ width:'100%',flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingLeft:screen.width/36,paddingRight:screen.width/36}}>
                            <Text style={{fontFamily:'poppins',color:wilaya?'#fff':'#f9f9f9',fontSize:screen.width/30,fontWeight:'500'}}>
                              {wilaya?wilaya:wilayas[0]}
                            </Text>
                            <Ionicons name="ios-arrow-down" size={screen.width/15} color='#fff' onPress={onPress} />
                            </TouchableOpacity>)
                          }
            </View>
            
              <InputProfile
                id='region'
                rightIcon={<MaterialIcons title="region" name ='home' color={Platform.OS==='android'?'#323446':'#fff'} size={screen.width/15.7} />}
                placeholder={barber && barber[0].lang?polylanfr.Region:polylanar.Region}
                keyboardType="default"
                returnKeyType="next"
                minLength={3}
                autoCapitalize='sentences'
                onInputChange={inputChangeHandler}
                initialValue={barber[0]?barber[0].region:''}
                initiallyValid={true}
                required
                placeholderTextColor={Platform.OS==='android'?'rgba(50,52,70,0.4)':'#f9f9f9'}
                widthView='90%'
                height={screen.width/8}
                backgroundColor={Platform.OS==='android'?'#fff':Colors.blue}
              />
           
            </KeyboardAvoidingView>
       </ScrollView>):
       (<ScrollView style={{width:'100%'}} showsVerticalScrollIndicator={false}>
           <View style={styles.noticeContainer}>
             <Text style={styles.noticeTitle}>{barber && barber[0].lang?polylanfr.DoYouKnow:polylanar.DoYouKnow}</Text>
             <Text style={styles.noticeContent}>{barber && barber[0].lang?polylanfr.DoYouKnowNotice:polylanar.DoYouKnowNotice} <Text onPress={url} style={{color:Colors.primary}}>rebornapp.com</Text></Text>
             <Text style={styles.tahfifaSignature} onPress={url2}>{barber && barber[0].lang?polylanfr.TeamTahfifa:polylanar.TeamTahfifa}</Text>
         </View>
           <View style={styles.buttonContainer}>
                <View style={styles.cartContainer}>
                  <TouchableOpacity style={styles.cart} onPress={alertLogout}>
                      <View style={{paddingBottom:screen.width/72}}>
                        <MaterialCommunityIcons title = "logout" name ='logout' color='#FD6C57' size={screen.width/15.7} />
                      </View>
                      <View>
                        <Text style={styles.optionTitle}>{barber && barber[0].lang?polylanfr.Disconnect:polylanar.Disconnect}</Text>
                      </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.cartContainer}>
                  <TouchableOpacity style={styles.cart} onPress={()=>props.navigation.navigate('BarberParameters',{barberUID:barberUID,barberID:barberID})}>
                       <View style={{paddingBottom:5}}>
                         <Ionicons title = "options" name ='ios-options' color='#56A7FF' size={screen.width/15.7} />
                       </View>
                       <View>
                         <Text style={styles.optionTitle}>{barber && barber[0].lang?polylanfr.Parameters:polylanar.Parameters}</Text>
                       </View>
                  </TouchableOpacity>
                </View>
                
           </View>
         </ScrollView>)}
         
    </View>
    </TouchableWithoutFeedback>
     );    
};


BarberProfileScreen.navigationOptions = navData => {
  const saveFunction=navData.navigation.getParam('save');
  const load=navData.navigation.getParam('load');
    
    return {
      headerTransparent : true ,
      headerStyle:{
          backgroundColor: 'white',
      },
      
      headerBackTitle : " ",
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
      headerTintColor: '#fff',
      headerRight : ()=> (load ? <ActivityIndicator color={Colors.primary} style={{marginRight:screen.width/32}} />:
        <HeaderButtons HeaderButtonComponent = {HeaderButton}> 
          <Item title = "save" 
            iconName ='md-checkmark'
            color='white' 
            onPress={saveFunction}
            style={{marginRight:screen.width/72}}
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
     borderTopLeftRadius:screen.width/12,
     borderTopRightRadius:screen.width/12,
     shadowColor: 'black',
     shadowOpacity: 0.96,
     shadowOffset: {width: 0, height:2},
     shadowRadius: screen.width/36,
     elevation: 5,
    },
    backgroundFirstCard:{
      width:'100%',
      height:'100%',
      alignItems:'center',
      justifyContent:'space-between',
      borderTopLeftRadius:screen.width/12,
      borderTopRightRadius:screen.width/12, 
      overflow:'visible'
    },
    secondCard:{
      height:screen.width/4.5,
      width:'90%',
      backgroundColor:'white',
      borderRadius:screen.width/36,
      marginTop:-(screen.width/7.2), 
      shadowColor: 'black',
      shadowOpacity: 0.96,
      shadowOffset: {width: 0, height:2},
      shadowRadius: screen.width/36,
      elevation: 5,
    },
    secondCardContent:{
      justifyContent:'space-around',
      flexDirection:'row'
    },
    imageContainer:{
      width:screen.width/4.5,
      height:screen.width/3.27
    },
    image:{
      width:'100%',
      height:'100%',
      borderRadius:screen.width/36,
      marginTop:-(screen.width/6)
    },
    detailsContainer:{
      marginTop:screen.width/72,
      width:'60%',
      flexDirection:'row',
      justifyContent:'space-between',
      marginLeft:-(screen.width/24)
    },
    bnameText:{
      fontFamily:'poppins-bold',
      color:'#323446',
      fontSize:screen.width/24,
      alignSelf:'flex-start'
    },
    secondFirstCard:{
      width:'95%',
      height:'20%',
      flexDirection:'row',
      justifyContent:'space-between',
      alignItems:'flex-end'
    },
    iconFormCircle1:{
      width:screen.width/9,
      height:screen.width/12,
      borderRadius:screen.width/18,
      justifyContent:'center',
      alignItems:'center'
    },
    iconFormCircle2:{
      width:screen.width/9,
      height:screen.width/12,
      borderRadius:screen.width/18,
      justifyContent:'center',
      alignItems:'center',
      
    },
    age:{
      fontFamily:'poppins',
      color:'grey',
      fontSize:screen.width/32.7,
      marginTop:(screen.width/78),
      alignSelf:'flex-start'
    },
    menuContainer:{
      marginTop:screen.width/14.4,
      width:'90%',
      backgroundColor:'#f9f9f9',
      borderRadius:screen.width/72,
      borderColor:'#fd6c57',
      borderWidth:1,
      flexDirection:'row',
      alignSelf:'center',
      overflow:'hidden'
    },
    scrollView:{
      width:'100%',
      marginVertical:screen.width/18
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
    borderRadius:screen.width/18,
    backgroundColor:'#fff',
    borderColor:'#fff',
    height:screen.width/9,
    justifyContent:'center',
    paddingHorizontal:screen.width/30,
    shadowColor: 'black',
    shadowOpacity: 0.96,
    shadowOffset: {width: 0, height:2},
    shadowRadius: screen.width/36,
    elevation: 3,
    overflow:'hidden',
    marginVertical:screen.width/72,
    alignSelf:'center'
   },
   pickerContainerRegion:{
    width:'90%',
    borderWidth:1,
    borderRadius:screen.width/18,
    backgroundColor:'#fff',
    borderColor:'#fff',
    height:screen.width/9,
    justifyContent:'center',
    paddingHorizontal:screen.width/30,
    shadowColor: 'black',
    shadowOpacity: 0.96,
    shadowOffset: {width: 0, height:2},
    shadowRadius: screen.width/36,
    elevation: 3,
    overflow:'hidden',
    marginTop:screen.width/72,
    marginBottom:screen.width/18,
    alignSelf:'center'
   },
   noticeContainer:{
     width:'85%',
     alignSelf:'center',
     marginBottom:screen.width/24,
     marginTop:screen.width/12
    },
    optionTitle:{
      fontFamily:'poppins-bold',
      fontSize:screen.width/32.7,
      color:'#323446'
    },
    buttonContainer:{
      width:'90%',
      alignSelf:'center',
      marginVertical:screen.width/36,
      flexDirection:'row',
      justifyContent:'center'
    },
    cart:{
      width:'90%',
      height:'95%',
      alignItems:'center',
      justifyContent:'center',
      elevation: 2,
      overflow:'hidden',
      borderRadius:screen.width/36
    },
    cartContainer:{
      width:'50%',
      height:screen.width/3.6,
      alignItems:'center',
      justifyContent:'center',
      borderWidth:Platform.OS==='ios'? 1:null,
      borderRadius:Platform.OS==='ios'? screen.width/9:null,
      marginHorizontal:Platform.OS==='ios'? screen.width/120:null,
      borderColor:Platform.OS==='ios'? Colors.blue:undefined,
      borderStyle:Platform.OS==='ios'? 'dashed':undefined
    },
    coverTwo:{
      flex:1,
      alignItems:'center',
      justifyContent:'center',
      width:'100%',
      height:'100%',
      resizeMode:'cover'
    },
    noticeContent:{
      fontFamily:'poppins',
      fontSize:screen.width/30,
      color:'#323446'
    },
     noticeTitle:{
       fontFamily:'poppins-bold',
       fontSize:screen.width/27.7,
       color:'#323446'
     },
  
     
     tahfifaSignature:{
       fontFamily:'poppins',
       fontSize:screen.width/30,
       color:'#fd6c57',
       paddingTop:screen.width/72
     },
     activityIndicatorContainer:{
      flex:1,
      resizeMode:'cover',
      width:'100%',
      height:'100%',
      justifyContent:'center',
      alignItems:'center' 
    }
});

export default BarberProfileScreen;