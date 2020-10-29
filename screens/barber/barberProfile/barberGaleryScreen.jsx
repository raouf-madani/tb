import React,{useState} from 'react';
import { StyleSheet,View,Alert,Dimensions,ScrollView,ImageBackground,StatusBar,ActivityIndicator} from 'react-native';
import Colors from '../../../constants/Colors';
import Portfolio from "../../../components/Portfolio";
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
  
  const barber= useSelector(state=>state.barbers.barber);
  const barberID= props.navigation.getParam('barberID');  //get Barber ID
  const dispatch= useDispatch();

  const [pickedImage,setPickedImage]= useState(barberPortfolio[0]?barberPortfolio[0].model:false);
  const [pickedImage2,setPickedImage2]= useState(barberPortfolio[1]?barberPortfolio[1].model:false);
  const [pickedImage3,setPickedImage3]= useState(barberPortfolio[2]?barberPortfolio[2].model:false);
  const [pickedImage4,setPickedImage4]= useState(barberPortfolio[3]?barberPortfolio[3].model:false);
  const [pickedImage5,setPickedImage5]= useState(barberPortfolio[4]?barberPortfolio[4].model:false);
  const [pickedImage6,setPickedImage6]= useState(barberPortfolio[5]?barberPortfolio[5].model:false);
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
      
      setIsLoading(true);
      await dispatch(portfolioActions.updatePortfolio(image.base64,imageName,barberID,barberPortfolio[0].id));
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
    
    setPickedImage(imageName);
    
    setIsLoading(true);
    await dispatch(portfolioActions.updatePortfolio(library.base64,imageName,barberID,barberPortfolio[0].id));
    setIsLoading(false);
    }
   }catch(err){
    console.log(err);
    Alert.alert(barber && barber[0].lang?polylanfr.Oups:polylanar.Oups,barber && barber[0].lang?polylanfr.WeakInternet:polylanar.WeakInternet,[{text:barber && barber[0].lang?polylanfr.OK:polylanar.OK}]);
    }
   
 };

  //////////////////////////****************************************************************************Image 2
 
  const takeImageHandler2 = async ()=>{
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
      
      setPickedImage2(imageName);
      
      setIsLoading(true);
      await dispatch(portfolioActions.updatePortfolio(image.base64,imageName,barberID,barberPortfolio[1].id));
      setIsLoading(false);
      }
    }catch(err){
      console.log(err);
    Alert.alert(barber && barber[0].lang?polylanfr.Oups:polylanar.Oups,barber && barber[0].lang?polylanfr.WeakInternet:polylanar.WeakInternet,[{text:barber && barber[0].lang?polylanfr.OK:polylanar.OK}]);
    }
 };

 const takeLibraryHandler2 = async ()=>{

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
    
    setPickedImage2(imageName);
    
    setIsLoading(true);
    await dispatch(portfolioActions.updatePortfolio(library.base64,imageName,barberID,barberPortfolio[1].id));
    setIsLoading(false);
    }
   }catch(err){
    console.log(err);
    Alert.alert(barber && barber[0].lang?polylanfr.Oups:polylanar.Oups,barber && barber[0].lang?polylanfr.WeakInternet:polylanar.WeakInternet,[{text:barber && barber[0].lang?polylanfr.OK:polylanar.OK}]);
    }
   
 };
 
  //////////////////////////****************************************************************************Image 3
 
  const takeImageHandler3 = async ()=>{
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
      
      setPickedImage3(imageName);
      
      setIsLoading(true);
      await dispatch(portfolioActions.updatePortfolio(image.base64,imageName,barberID,barberPortfolio[2].id));
      setIsLoading(false);
      }
    }catch(err){
      console.log(err);
    Alert.alert(barber && barber[0].lang?polylanfr.Oups:polylanar.Oups,barber && barber[0].lang?polylanfr.WeakInternet:polylanar.WeakInternet,[{text:barber && barber[0].lang?polylanfr.OK:polylanar.OK}]);
    }
 };

 const takeLibraryHandler3 = async ()=>{

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
    
    setPickedImage3(imageName);
    
    setIsLoading(true);
    await dispatch(portfolioActions.updatePortfolio(library.base64,imageName,barberID,barberPortfolio[2].id));
    setIsLoading(false);
    }
   }catch(err){
    console.log(err);
    Alert.alert(barber && barber[0].lang?polylanfr.Oups:polylanar.Oups,barber && barber[0].lang?polylanfr.WeakInternet:polylanar.WeakInternet,[{text:barber && barber[0].lang?polylanfr.OK:polylanar.OK}]);
    }
   
 };

  //////////////////////////****************************************************************************Image 4
 
  const takeImageHandler4 = async ()=>{
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
      
      setPickedImage4(imageName);
      
      setIsLoading(true);
      await dispatch(portfolioActions.updatePortfolio(image.base64,imageName,barberID,barberPortfolio[3].id));
      setIsLoading(false);
      }
    }catch(err){
      console.log(err);
    Alert.alert(barber && barber[0].lang?polylanfr.Oups:polylanar.Oups,barber && barber[0].lang?polylanfr.WeakInternet:polylanar.WeakInternet,[{text:barber && barber[0].lang?polylanfr.OK:polylanar.OK}]);
    }
 };

 const takeLibraryHandler4 = async ()=>{

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
    
    setPickedImage4(imageName);
    
    setIsLoading(true);
    await dispatch(portfolioActions.updatePortfolio(library.base64,imageName,barberID,barberPortfolio[3].id));
    setIsLoading(false);
    }
   }catch(err){
    console.log(err);
    Alert.alert(barber && barber[0].lang?polylanfr.Oups:polylanar.Oups,barber && barber[0].lang?polylanfr.WeakInternet:polylanar.WeakInternet,[{text:barber && barber[0].lang?polylanfr.OK:polylanar.OK}]);
    }
   
 };

  //////////////////////////****************************************************************************Image 5
 
  const takeImageHandler5 = async ()=>{
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
      
      setPickedImage5(imageName);
      
      setIsLoading(true);
      await dispatch(portfolioActions.updatePortfolio(image.base64,imageName,barberID,barberPortfolio[4].id));
      setIsLoading(false);
      }
    }catch(err){
      console.log(err);
    Alert.alert(barber && barber[0].lang?polylanfr.Oups:polylanar.Oups,barber && barber[0].lang?polylanfr.WeakInternet:polylanar.WeakInternet,[{text:barber && barber[0].lang?polylanfr.OK:polylanar.OK}]);
    }
 };

 const takeLibraryHandler5 = async ()=>{

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
    
    setPickedImage5(imageName);
    
    setIsLoading(true);
    await dispatch(portfolioActions.updatePortfolio(library.base64,imageName,barberID,barberPortfolio[4].id));
    setIsLoading(false);
    }
   }catch(err){
    console.log(err);
    Alert.alert(barber && barber[0].lang?polylanfr.Oups:polylanar.Oups,barber && barber[0].lang?polylanfr.WeakInternet:polylanar.WeakInternet,[{text:barber && barber[0].lang?polylanfr.OK:polylanar.OK}]);
    }
   
 };

  //////////////////////////****************************************************************************Image 6
 
  const takeImageHandler6 = async ()=>{
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
      
      setPickedImage6(imageName);
      
      setIsLoading(true);
      await dispatch(portfolioActions.updatePortfolio(image.base64,imageName,barberID,barberPortfolio[5].id));
      setIsLoading(false);
      }
    }catch(err){
      console.log(err);
    Alert.alert(barber && barber[0].lang?polylanfr.Oups:polylanar.Oups,barber && barber[0].lang?polylanfr.WeakInternet:polylanar.WeakInternet,[{text:barber && barber[0].lang?polylanfr.OK:polylanar.OK}]);
    }
 };

 const takeLibraryHandler6 = async ()=>{

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
    
    setPickedImage6(imageName);
    
    setIsLoading(true);
    await dispatch(portfolioActions.updatePortfolio(library.base64,imageName,barberID,barberPortfolio[5].id));
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
          <Portfolio
          modelName={barberPortfolio && pickedImage?pickedImage:'ayoungleaderportfolio.jpg'}
          cameraImage={takeImageHandler}
          libraryImage={takeLibraryHandler}
          />
            <Portfolio
          modelName={barberPortfolio && pickedImage2?pickedImage2:'ayoungleaderportfolio.jpg'}
          cameraImage={takeImageHandler2}
          libraryImage={takeLibraryHandler2}
          />
      </View>
      <View style={styles.row}>
       <Portfolio
        modelName={barberPortfolio && pickedImage3?pickedImage3:'ayoungleaderportfolio.jpg'}
        cameraImage={takeImageHandler3}
        libraryImage={takeLibraryHandler3}
       />
         <Portfolio
        modelName={barberPortfolio && pickedImage4?pickedImage4:'ayoungleaderportfolio.jpg'}
        cameraImage={takeImageHandler4}
        libraryImage={takeLibraryHandler4}
       />
    </View>
    <View style={styles.row}>
       <Portfolio
        modelName={barberPortfolio && pickedImage5?pickedImage5:'ayoungleaderportfolio.jpg'}
        cameraImage={takeImageHandler5}
        libraryImage={takeLibraryHandler5}
       />
         <Portfolio
        modelName={barberPortfolio && pickedImage6?pickedImage6:'ayoungleaderportfolio.jpg'}
        cameraImage={takeImageHandler6}
        libraryImage={takeLibraryHandler6}
       />
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