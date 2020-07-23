import React, {useState} from 'react';
import { StyleSheet,View,KeyboardAvoidingView,Text,Image,Dimensions,ActionSheetIOS, StatusBar,Picker} from 'react-native';
import { Input,Button } from 'react-native-elements';
import Colors from '../../../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';

//responsivity (Dimensions get method)
const screen = Dimensions.get('window');

const EditServiceScreen = props =>{

   //States for complex information textInputs
   const [hour,setHour] = useState('0');
   const hours = ['0','1','2','3','4','5','6','7','8','9','10','11','12'];
   const [minute,setMinute] = useState('0');
   const minutes = ['0','5','10','15','20','25','30','35','40','45','50','55']; 
   
   
   //picker only iOS function 
   const onPress = () =>{
     const hoursIOS = ['0','1','2','3','4','5','6','7','8','9','10','11','12'];    
     ActionSheetIOS.showActionSheetWithOptions(
       {
         options: hoursIOS,
         cancelButtonIndex: -1
       },
       buttonIndex => {
         if (buttonIndex === -1) {
           // cancel action
         } else {
          setHour(hoursIOS[buttonIndex]);
         } 
       }
     );  
 }

 //picker only iOS function 
 const onPressMinute = () =>{
  const minutesIOS = ['0','5','10','15','20','25','30','35','40','45','50','55'];    
  ActionSheetIOS.showActionSheetWithOptions(
    {
      options: minutesIOS,
      cancelButtonIndex: -1
    },
    buttonIndex => {
      if (buttonIndex === -1) {
        // cancel action
      } else {
       setMinute(minutesIOS[buttonIndex]);
      } 
    }
  );  
}

    return(
           
    <View style={styles.container}>
      <KeyboardAvoidingView  keyboardVerticalOffset={10}>
         <StatusBar hidden />
          <View style={styles.backgroundContainer}>
            <Image source={require('../../../assets/images/man1-1.jpg')} style={{resizeMode:'cover',width:'100%',height:'100%'}}/>
          </View>
          <View style={styles.secondContainer}>
             <View style={styles.headerContainer}>
                   <View>
                     <Text style={{fontFamily:'poppins-bold',fontSize:13,color:'#323446'}}>Choisissez votre service</Text>
                   </View>
                   <View>
                     <Text style={{fontFamily:'poppins-bold',fontSize:13,color:'#fd6c57'}}>Total: 0دج</Text>
                   </View>
             </View>

             <View style={styles.inputsContainer}>
                 <View style={{flexDirection:'row',width:'90%',marginVertical:5,alignItems:'center'}}>
                   <View style={{width:'50%'}}>
                    <Text style={{fontFamily:'poppins',fontSize:12,color:'#323446'}}>Nom de service</Text>
                   </View>
                   <View style={styles.inputContainer}>
                    <Input 
                        placeholder="Ex: Barbe"
                        inputContainerStyle={styles.input}
                        placeholderTextColor='rgba(50,52,70,0.4)'
                        inputStyle={{fontSize:15}}
                        /> 
                  </View>
                 </View>

                 <View style={{flexDirection:'row',width:'90%',marginVertical:5,alignItems:'center'}}>
                   <View style={{width:'50%'}}>
                    <Text style={{fontFamily:'poppins',fontSize:12,color:'#323446'}}>Heures</Text>
                   </View>
                   <View style={styles.pickerContainer}>
                   {Platform.OS === 'android' ? 
                              <Picker
                              selectedValue={hour}
                              onValueChange={itemValue => setHour(itemValue)}
                              style={{fontFamily:'poppins',fontSize:12,color:'#323446'}}
                              >
                              {hours.map(el=> <Picker.Item label={el} value={el} key={el} />)}
                              </Picker> :
                              <Text onPress={onPress} style={{fontFamily:'poppins',fontSize:12,color:'#323446'}}>
                                {hour}
                              </Text>} 
                  </View>
                 </View>
                 
                 <View style={{flexDirection:'row',width:'90%',marginVertical:5,alignItems:'center'}}>
                   <View style={{width:'50%'}}>
                    <Text style={{fontFamily:'poppins',fontSize:12,color:'#323446'}}>Minutes</Text>
                   </View>
                   <View style={styles.pickerContainer}>
                   {Platform.OS === 'android' ? 
                              <Picker
                              selectedValue={minute}
                              onValueChange={itemValue => setMinute(itemValue)}
                              style={{fontFamily:'poppins',fontSize:12,color:'#323446'}}
                              >
                              {minutes.map(el=> <Picker.Item label={el} value={el} key={el} />)}
                              </Picker> :
                              <Text onPress={onPressMinute} style={{fontFamily:'poppins',fontSize:12,color:'#323446'}}>
                                {minute}
                              </Text>} 
                  </View>
                 </View>

                 <View style={{flexDirection:'row',width:'90%',marginVertical:5,alignItems:'center'}}>
                   <View style={{width:'50%'}}>
                    <Text style={{fontFamily:'poppins',fontSize:12,color:'#323446'}}>Prix en دج</Text>
                   </View>
                   <View style={styles.inputContainer}>
                    <Input 
                        placeholder="Ex: 1500"
                        inputContainerStyle={styles.input}
                        placeholderTextColor='rgba(50,52,70,0.4)'
                        inputStyle={{fontSize:15}}
                        /> 
                  </View>
                 </View>
             </View>
             <View style={styles.footerContainer}>
                  <Button
                    theme={{colors: {primary:'#fd6c57'}}} 
                    title="Ajouter"
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
          </View>
       </KeyboardAvoidingView>
    </View>
     );    
};


 EditServiceScreen.navigationOptions= () => {
   
    return {
            
            title:'Ajouter Service',
            headerTransparent : true ,
            headerBackTitle : " ",
            headerTintColor: '#fff',
            headerTitleStyle:{
              fontFamily:'poppins-bold',
              marginTop:5
            }
    };

 };

const styles= StyleSheet.create({
container:{
  flex:1,
  backgroundColor:'black',
  width:'100%',
},
backgroundContainer:{
  height:'30%'
},
secondContainer:{
 height:'70%',
 width:'100%',
 backgroundColor:'#fff',
 borderTopLeftRadius:30,
 borderTopRightRadius:30,
 overflow:'hidden',
 
},
headerContainer:{
  width:'90%',
  height:'20%',
  flexDirection:'row',
  justifyContent:'space-between',
  alignItems:'center',
  alignSelf:'center'
},
inputsContainer:{
 height:'55%',
 width:'100%',
 alignItems:'center',
},
inputContainer:{
 width:'50%',
 borderWidth:1,
 borderRadius:20,
 backgroundColor:'#d3d3d3',
 borderColor:'#d3d3d3'
},
pickerContainer:{
 width:'50%',
 borderWidth:1,
 borderRadius:20,
 backgroundColor:'#d3d3d3',
 borderColor:'#d3d3d3',
 height:40,
 justifyContent:'center',
 paddingLeft:15
},
input:{
 borderBottomWidth:0,
 paddingHorizontal:10
},
footerContainer:{
 height:'25%',
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
 height:40,
 alignSelf:'center'
}
});

export default EditServiceScreen;