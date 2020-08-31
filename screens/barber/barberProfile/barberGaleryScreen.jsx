import React,{useState} from 'react';
import { StyleSheet,View,Button,Text,TouchableHighlight,Image,Dimensions,ScrollView} from 'react-native';
import {Ionicons} from "@expo/vector-icons";
import {HeaderButtons,Item} from "react-navigation-header-buttons";
import HeaderButton from "../../../components/HeaderButton";
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

//responsivity (Dimensions get method)
const screen = Dimensions.get('window');
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const BarberGaleryScreen = props =>{
     
  const [pickedImage,setPickedImage]= useState();

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
    const hasPermissions = await verifyPermissions();
    if(!hasPermissions){
        return;
    }
    const image = await ImagePicker.launchCameraAsync({
        allowsEditing:true,
        aspect:[60,60],
        quality:0.7
    });
    
    setPickedImage(image.uri);
 };
  
    return(
   
    <View style={styles.container}>
      <ScrollView style={styles.grid} contentContainerStyle={{ alignItems:'center'}} showsVerticalScrollIndicator={false}>
        <View style={styles.row}>
            <View style={styles.imageConainer}>
              <Image source={!pickedImage? require('../../../assets/images/man1.jpg'):{uri:pickedImage}} style={styles.modelImage} />
              <TouchableHighlight style={styles.iconContainer} onPress={!pickedImage? takeImageHandler:()=>setPickedImage(false)}>
                <Ionicons title = "add" 
                name ={!pickedImage?'ios-camera':'ios-remove'}
                color='#fff' 
                size={23}
                />
              </TouchableHighlight>
            </View>
            <View style={styles.imageConainer}>
              <Image source={!pickedImage? require('../../../assets/images/man1.jpg'):{uri:pickedImage}} style={styles.modelImage} />
              <TouchableHighlight style={styles.iconContainer} onPress={!pickedImage? takeImageHandler:()=>setPickedImage(false)}>
                <Ionicons title = "add" 
                name ={!pickedImage?'ios-camera':'ios-remove'}
                color='#fff' 
                size={23}
                />
              </TouchableHighlight>
            </View>
            <View style={styles.imageConainer}>
              <Image source={!pickedImage? require('../../../assets/images/man1.jpg'):{uri:pickedImage}} style={styles.modelImage} />
              <TouchableHighlight style={styles.iconContainer} onPress={!pickedImage? takeImageHandler:()=>setPickedImage(false)}>
                <Ionicons title = "add" 
                name ={!pickedImage?'ios-camera':'ios-remove'}
                color='#fff' 
                size={23}
                />
              </TouchableHighlight>
            </View>
        </View>
        <View style={styles.row}>
            <View style={styles.imageConainer}>
              <Image source={!pickedImage? require('../../../assets/images/man1.jpg'):{uri:pickedImage}} style={styles.modelImage} />
              <TouchableHighlight style={styles.iconContainer} onPress={!pickedImage? takeImageHandler:()=>setPickedImage(false)}>
                <Ionicons title = "add" 
                name ={!pickedImage?'ios-camera':'ios-remove'}
                color='#fff' 
                size={23}
                />
              </TouchableHighlight>
            </View>
            <View style={styles.imageConainer}>
              <Image source={!pickedImage? require('../../../assets/images/man1.jpg'):{uri:pickedImage}} style={styles.modelImage} />
              <TouchableHighlight style={styles.iconContainer} onPress={!pickedImage? takeImageHandler:()=>setPickedImage(false)}>
                <Ionicons title = "add" 
                name ={!pickedImage?'ios-camera':'ios-remove'}
                color='#fff' 
                size={23}
                />
              </TouchableHighlight>
            </View>
            <View style={styles.imageConainer}>
              <Image source={!pickedImage? require('../../../assets/images/man1.jpg'):{uri:pickedImage}} style={styles.modelImage} />
              <TouchableHighlight style={styles.iconContainer} onPress={!pickedImage? takeImageHandler:()=>setPickedImage(false)}>
                <Ionicons title = "add" 
                name ={!pickedImage?'ios-camera':'ios-remove'}
                color='#fff' 
                size={23}
                />
              </TouchableHighlight>
            </View>
        </View>
        <View style={styles.row}>
            <View style={styles.imageConainer}>
              <Image source={!pickedImage? require('../../../assets/images/man1.jpg'):{uri:pickedImage}} style={styles.modelImage} />
              <TouchableHighlight style={styles.iconContainer} onPress={!pickedImage? takeImageHandler:()=>setPickedImage(false)}>
                <Ionicons title = "add" 
                name ={!pickedImage?'ios-camera':'ios-remove'}
                color='#fff' 
                size={23}
                />
              </TouchableHighlight>
            </View>
            <View style={styles.imageConainer}>
              <Image source={!pickedImage? require('../../../assets/images/man1.jpg'):{uri:pickedImage}} style={styles.modelImage} />
              <TouchableHighlight style={styles.iconContainer} onPress={!pickedImage? takeImageHandler:()=>setPickedImage(false)}>
                <Ionicons title = "add" 
                name ={!pickedImage?'ios-camera':'ios-remove'}
                color='#fff' 
                size={23}
                />
              </TouchableHighlight>
            </View>
            <View style={styles.imageConainer}>
              <Image source={!pickedImage? require('../../../assets/images/man1.jpg'):{uri:pickedImage}} style={styles.modelImage} />
              <TouchableHighlight style={styles.iconContainer} onPress={!pickedImage? takeImageHandler:()=>setPickedImage(false)}>
                <Ionicons title = "add" 
                name ={!pickedImage?'ios-camera':'ios-remove'}
                color='#fff' 
                size={23}
                />
              </TouchableHighlight>
            </View>
        </View>
        <View style={styles.row}>
            <View style={styles.imageConainer}>
              <Image source={!pickedImage? require('../../../assets/images/man1.jpg'):{uri:pickedImage}} style={styles.modelImage} />
              <TouchableHighlight style={styles.iconContainer} onPress={!pickedImage? takeImageHandler:()=>setPickedImage(false)}>
                <Ionicons title = "add" 
                name ={!pickedImage?'ios-camera':'ios-remove'}
                color='#fff' 
                size={23}
                />
              </TouchableHighlight>
            </View>
            <View style={styles.imageConainer}>
              <Image source={!pickedImage? require('../../../assets/images/man1.jpg'):{uri:pickedImage}} style={styles.modelImage} />
              <TouchableHighlight style={styles.iconContainer} onPress={!pickedImage? takeImageHandler:()=>setPickedImage(false)}>
                <Ionicons title = "add" 
                name ={!pickedImage?'ios-camera':'ios-remove'}
                color='#fff' 
                size={23}
                />
              </TouchableHighlight>
            </View>
            <View style={styles.imageConainer}>
              <Image source={!pickedImage? require('../../../assets/images/man1.jpg'):{uri:pickedImage}} style={styles.modelImage} />
              <TouchableHighlight style={styles.iconContainer} onPress={!pickedImage? takeImageHandler:()=>setPickedImage(false)}>
                <Ionicons title = "add" 
                name ={!pickedImage?'ios-camera':'ios-remove'}
                color='#fff' 
                size={23}
                />
              </TouchableHighlight>
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
      headerRight : () =>(
        <HeaderButtons HeaderButtonComponent = {HeaderButton}> 
          <Item title = "save" 
            iconName ='md-checkmark'
            color='#323446'
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
    width:'30%',
    marginHorizontal:15,
    alignItems:'center'
  },
   modelImage:{ 
     width:windowWidth*0.3,
     height:windowHeight*0.18
    },
  iconContainer:{
    height:30,
    width:30,
    borderRadius:30/2,
    backgroundColor:'#323446',
    justifyContent:'center',
    alignItems:'center',
    marginVertical:5
   }
});

export default BarberGaleryScreen;