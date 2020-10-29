import React,{useState} from 'react';
import { StyleSheet,View,Button,Alert,TouchableHighlight,Image,Dimensions,ScrollView,ImageBackground,StatusBar,ActivityIndicator} from 'react-native';
import {Ionicons,MaterialIcons} from "@expo/vector-icons";
import Colors from '../../../constants/Colors';
import {HeaderButtons,Item} from "react-navigation-header-buttons";
import HeaderButton from "../../../components/HeaderButton";
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as portfolioActions from '../../../store/actions/portfolioActions';
import { useDispatch,useSelector } from 'react-redux';
import polylanar from "../../../lang/ar";
import polylanfr from "../../../lang/fr";

//responsivity (Dimensions get method)
const screen = Dimensions.get('window');
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const BarberGaleryScreen = props =>{

  const barberPortfolio=useSelector(state=>state.portfolio.portfolio);
  console.log(barberPortfolio);
  const barber= useSelector(state=>state.barbers.barber);
  const barberID= props.navigation.getParam('barberID');  //get Barber ID
  const dispatch= useDispatch();

  const [pickedImage,setPickedImage]= useState(barberPortfolio[0]?barberPortfolio[0].model:false);
  const [isLoading,setIsLoading]= useState(false);
  


  //Permissions 
  const verifyPermissions= async ()=>{
    const result= await Permissions.askAsync(Permissions.CAMERA,Permissions.CAMERA_ROLL);
    if(result.status !== 'granted'){
        Alert.alert('Permissions insuffisantes!',
        'Vous devez autoriser votre caméra pour utiliser cette application.',
        [{text:"D'accord"}]);
        return false;
    }
    return true;
  };

  //Image 1 
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
      console.log(imageName);
      setPickedImage(imageName);
      
      setIsLoading(true);
      await dispatch(portfolioActions.updatePortfolio(image.base64,imageName,barberID));
      setIsLoading(false);
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
    console.log(imageName);
    setPickedImage(imageName);
    
    setIsLoading(true);
    await dispatch(portfolioActions.updatePortfolio(library.base64,imageName,barberID));
    setIsLoading(false);
    }
   }catch(err){
    console.log(err);
    Alert.alert(barber && barber[0].lang?polylanfr.Oups:polylanar.Oups,barber && barber[0].lang?polylanfr.WeakInternet:polylanar.WeakInternet,[{text:barber && barber[0].lang?polylanfr.OK:polylanar.OK}]);
    }
   
 };

 if(isLoading){
  return <ImageBackground source={require('../../../assets/images/support.png')} style={styles.activityIndicatorContainer} >
          <StatusBar hidden />
          <ActivityIndicator size='large' color={Colors.primary} />
         </ImageBackground>
};
  
    return(
   
    <View style={styles.container}>
      <StatusBar hidden />
      <ScrollView style={styles.grid} contentContainerStyle={{ alignItems:'center'}} showsVerticalScrollIndicator={false}>
        <View style={styles.row}>
            <View style={styles.imageConainer}>
              {barberPortfolio && barberPortfolio.length===0?<Image source={{uri:'http://173.212.234.137/uploads/out.png'}} style={styles.modelImage} />:
              <Image source={{uri:`http://173.212.234.137/uploads/${barberPortfolio[0].model}`}} style={styles.modelImage} />}
              <View style={{width:'100%',flexDirection:'row',justifyContent:'space-around',alignItems:'center'}}>
              <TouchableHighlight style={styles.iconContainer} onPress={takeImageHandler}>
                <Ionicons title = "add" 
                name ={'ios-camera'}
                color='#fff' 
                size={23}
                />
              </TouchableHighlight>
              <TouchableHighlight style={styles.iconContainer2} onPress={takeLibraryHandler}>
              <MaterialIcons 
                title = "library" 
                name ='photo-library' 
                color='#FFF' 
                size={21} />
              </TouchableHighlight>
              </View>
            </View>
     
        </View>
      </ScrollView> 
    </View>
    
     );    
};

BarberGaleryScreen.navigationOptions= navData => {
    
     return {
      title:'Portfolio',
      headerTransparent : true ,
      headerBackTitle : " ",
      headerTintColor: '#323446',
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
    alignItems:'center',
    justifyContent:'center'
   },
   grid:{
     width:'100%',
     backgroundColor:'#f9f9f9',
     paddingHorizontal:15,
     borderRadius:10,
     marginTop:windowHeight*0.1
    },
   row:{
    flexDirection:'row',
    width:'90%',marginVertical:10,
    justifyContent:'center'
    },
  imageConainer:{
    width:'45%',
    marginHorizontal:15,
    alignItems:'center'
  },
   modelImage:{ 
     width:windowWidth*0.4,
     height:windowHeight*0.25
    },
  iconContainer:{
    height:30,
    width:30,
    borderRadius:30/2,
    backgroundColor:'#323446',
    justifyContent:'center',
    alignItems:'center',
    marginVertical:5
   },
   iconContainer2:{
    height:30,
    width:30,
    borderRadius:30/2,
    backgroundColor:'#FE457C',
    justifyContent:'center',
    alignItems:'center',
    marginVertical:5
   },
   activityIndicatorContainer:{
    flex:1,
    resizeMode:'cover',
    width:'100%',
    height:'100%',
    justifyContent:'center',
    alignItems:'center' 
  },
});

export default BarberGaleryScreen;