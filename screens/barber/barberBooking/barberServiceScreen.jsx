import React, {useState,useEffect} from 'react';
import { StyleSheet,View,Image, ScrollView,ImageBackground,Text,TouchableOpacity,Switch,Platform} from 'react-native';
import Colors from '../../../constants/Colors';
import {MaterialIcons,Entypo} from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {HeaderButtons,Item} from "react-navigation-header-buttons";
import HeaderButton from "../../../components/HeaderButton";


const data=[{id:'1',fullname:'Walid .M',imagePth:require('../../../assets/images/angelina.jpg'),phone:'0659853214',sexe:'Homme',email:'walid@gmail.com',experience:5,imagePth2:require('../../../assets/images/angelina.png'),place:'DM',placeTwo:'CC'},
]; 
const BarberServiceScreen = props =>{
  
  const [isServices,setIsServices]= useState(true);
  const [isDisponible,setIsDisponible]= useState(false);

    const services = ()=>{
      setIsServices(true);
      setIsDisponible(false);
    };

    const disponibility =()=>{
      setIsServices(false);
      setIsDisponible(true);
    };

    let switchIOS;
    if(Platform.OS === 'ios'){
      switchIOS = {
       alignSelf:'center', 
       transform:  [{ scaleX: .7 }, { scaleY: .7 }] 
     };
   }

     //Switch buttons states for slots
     const [switchSat, setSwitchSat] = useState(false);
     const [switchSun, setSwitchSun] = useState(false);
     const [switchMon, setSwitchMon] = useState(false);
     const [switchTue, setSwitchTue] = useState(false);
     const [switchWed, setSwitchWed] = useState(false);
     const [switchThu, setSwitchThu] = useState(false);
     const [switchFri, setSwitchFri] = useState(false);
   
     //Text states for 7 days isOpenSat ? date : Début
     // isCloseSat ? date : Fin
     //Open Date states for 7 days. isOpenSat ? openTimeSat : Début
     //Close Date states for 7 days. isCloseSat ? closeTimeSat : Fin
     const [sat, setSat] = useState({isOpenSat:false,openTimeSat:'début'});
     const [satClose, setSatClose] = useState({isCloseSat:false,closeTimeSat:'début'});
     const [sun, setSun] = useState({isOpenSun:false,openTimeSun:'début'});
     const [sunClose, setSunClose] = useState({isCloseSun:false,closeTimeSun:'début'});
     const [mon, setMon] = useState({isOpenMon:false,openTimeMon:'début'});
     const [monClose, setMonClose] = useState({isCloseMon:false,closeTimeMon:'début'});
     const [tue, setTue] = useState({isOpenTue:false,openTimeTue:'début'});
     const [tueClose, setTueClose] = useState({isCloseTue:false,closeTimeTue:'début'});
     const [wed, setWed] = useState({isOpenWed:false,openTimeWed:'début'});
     const [wedClose, setWedClose] = useState({isCloseWed:false,closeTimeWed:'début'});
     const [thu, setThu] = useState({isOpenThu:false,openTimeThu:'début'});
     const [thuClose, setThuClose] = useState({isCloseThu:false,openTimeThu:'début'});
     const [fri, setFri] = useState({isOpenFri:false,openTimeFri:'début'});
     const [friClose, setFriClose] = useState({isCloseFri:false,closeTimeFri:'début'});
     
     //Date Picker states
     const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
     //id state 
     const [id,setId] = useState('');
 
     const showDatePicker = () => {
         setDatePickerVisibility(true);
       };
     const hideDatePicker = () => {
         setDatePickerVisibility(false);
       };
 
      //if the Saturday switch is off >>> initialState
      useEffect(()=>{
        if(!switchSat){
           setSat({...sat,isOpenSat:false,openTimeSat:'Début'});
           setSatClose({...satClose,isCloseSat:false,closeTimeSat:'Fin'})
        }if (!switchSun){
           setSun({...sun,isOpenSun:false,openTimeSun:'Début'});
           setSunClose({...sunClose,isCloseSun:false,closeTimeSun:'Fin'});
        }if (!switchMon){
           setMon({...mon,isOpenMon:false,openTimeMon:'Début'});
           setMonClose({...monClose,isCloseMon:false,closeTimeMon:'Fin'});
        }if (!switchTue){
           setTue({...tue,isOpenTue:false,openTimeTue:'Début'});
           setTueClose({...tueClose,isCloseTue:false,closeTimeTue:'Fin'});
        }if(!switchWed){
           setWed({...wed,isOpenWed:false,openTimeWed:'Début'}); 
           setWedClose({...wedClose,isCloseWed:false,closeTimeWed:'Fin'});
        }if(!switchThu){
           setThu({...thu,isOpenThu:false,openTimeThu:'Début'});
           setThuClose({...thuClose,isCloseThu:false,closeTimeThu:'Fin'});
        }if(!switchFri){
           setFri({...fri,isOpenFri:false,openTimeFri:'Début'});
           setFriClose({...friClose,isCloseFri:false,closeTimeFri:'Fin'});
        }    
          
      },[switchSat,switchSun,switchMon,switchTue,switchWed,switchThu,switchFri]);
 
      const handleConfirm = (date) => {
        
        hideDatePicker();
        //set the hours after confirming it in the datePicker
        if(id === 'sat'){
          setSat({...sat,openTimeSat:date.getHours()+'h'+date.getMinutes()});
        }else if(id==='satClose'){
          setSatClose({...satClose,closeTimeSat:date.getHours()+'h'+date.getMinutes()});
        }else if (id==='sun'){
          setSun({...sun,openTimeSun:date.getHours()+'h'+date.getMinutes()}); 
        }else if(id==='sunClose'){
          setSunClose({...sunClose,closeTimeSun:date.getHours()+'h'+date.getMinutes()});
        }else if (id==='mon'){
          setMon({...mon,openTimeMon:date.getHours()+'h'+date.getMinutes()});
        }else if(id==='monClose'){
          setMonClose({...monClose,closeTimeMon:date.getHours()+'h'+date.getMinutes()});
        }else if(id==='tue'){
          setTue({...tue,openTimeTue:date.getHours()+'h'+date.getMinutes()});
        }else if(id === 'tueClose'){
          setTueClose({...tueClose,closeTimeTue:date.getHours()+'h'+date.getMinutes()});
        }else if(id==='wed'){
          setWed({...wed,openTimeWed:date.getHours()+'h'+date.getMinutes()});
        }else if(id==='wedClose'){
          setWedClose({...wedClose,closeTimeWed:date.getHours()+'h'+date.getMinutes()});
        }else if(id==='thu'){
          setThu({...thu,openTimeThu:date.getHours()+'h'+date.getMinutes()});
        }else if (id === 'thuClose'){
          setThuClose({...thuClose,closeTimeThu:date.getHours()+'h'+date.getMinutes()});
        }else if(id === 'fri'){
          setFri({...fri,openTimeFri:date.getHours()+'h'+date.getMinutes()});
        }else if(id === 'friClose'){
          setFriClose({...friClose,closeTimeFri:date.getHours()+'h'+date.getMinutes()});
        }
      
    };
   
    return(
        <View style={styles.container}> 
         <View style={styles.firstContainer}>
           <View style={styles.coverContainer}>
               <ImageBackground source={require('../../../assets/images/barberScreen.png')} style={styles.cover} />
           </View>
           
           <View style={styles.infoContainer}>
              <View style={styles.imageContainer}>
                  <Image source={require('../../../assets/images/angelina.png')} style={styles.icon} />
              </View>
            
              <Text style={styles.bname}>Djazia William</Text>
             
              <View style={styles.iconFormCircle}>
                      <Entypo title = "scissors" name ='scissors' color='#fff' size={23} />
              </View>
           </View>
           <View style={styles.menu}>
              <TouchableOpacity style={{borderBottomWidth:2,borderBottomColor:isServices ?'#fd6c57':'#f9f9f9',paddingBottom:3}} onPress={services}>
               <Text style={styles.itemText}>Mes services</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{borderBottomWidth:2,borderBottomColor:isDisponible?'#fd6c57':'#f9f9f9',paddingBottom:3}} onPress={disponibility}>
               <Text style={styles.itemText}>Disponibilité</Text>
              </TouchableOpacity>
           </View>
         </View>
        {isServices ?( <ScrollView style={{width:'100%'}} showsVerticalScrollIndicator={false}>
           <View style={styles.serviceContainer}>
               <View style={{width:'80%'}}>
                  <View style={styles.serviceTextContainer}>
                    <Text style={styles.serviceText}>Service 1</Text>
                  </View>
                  <Text style={styles.detailText}>Brushing</Text>
                  <Text style={styles.detailText}>30min</Text>
                  <View style={styles.priceContainer}>
                    <Text style={styles.price}>2 000 DA</Text>
                  </View>
                  
               </View>
               <View style={styles.iconsContainer}>
                <TouchableOpacity style={styles.iconFormCircleService}>
                        <Entypo title = "edit" name ='edit' color='#BA55D3' size={23} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconFormCircleService}>
                      <MaterialIcons title = "delete" name ='delete-forever' color='#FE457C' size={23} />
                </TouchableOpacity> 
               </View>
           </View>
           <View style={{overflow:'hidden',shadowOpacity:1,shadowRadius:10,shadowColor:"#323446",elevation:5,alignSelf:'center',flexDirection:'row',width:'90%',marginVertical:10,backgroundColor:'#f9f9f9',borderRadius:10,paddingHorizontal:10,paddingVertical:15}}>
               <View style={{width:'80%'}}>
                  <View style={{backgroundColor:'#fd6c57',width:60,alignItems:'center',justifyContent:'center',marginBottom:10,borderRadius:5}}>
                    <Text style={{color:'#fff',fontFamily:'poppins',fontSize:12}}>Service 2</Text>
                  </View>
                  <Text style={{color:'#323446',fontFamily:'poppins',fontSize:12}}>Coiffure de mariée</Text>
                  <Text style={{color:'#323446',fontFamily:'poppins',fontSize:12}}>1h</Text>
                  <View style={{marginTop:10}}>
                    <Text style={{color:'#fd6c57',fontFamily:'poppins',fontSize:12}}>10 000 DA</Text>
                  </View>
                  
               </View>
               <View style={{width:'20%',justifyContent:'space-between',alignItems:'center',borderLeftWidth:2,borderLeftColor:'#323446'}}>
                <TouchableOpacity style={styles.iconFormCircleService}>
                        <Entypo title = "edit" name ='edit' color='#BA55D3' size={23} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconFormCircleService}>
                      <MaterialIcons title = "delete" name ='delete-forever' color='#FE457C' size={23} />
                </TouchableOpacity> 
               </View>
           </View>
           <View style={{overflow:'hidden',shadowOpacity:1,shadowRadius:10,shadowColor:"#323446",elevation:5,alignSelf:'center',flexDirection:'row',width:'90%',marginVertical:10,backgroundColor:'#f9f9f9',borderRadius:10,paddingHorizontal:10,paddingVertical:15}}>
               <View style={{width:'80%'}}>
                  <View style={{backgroundColor:'#fd6c57',width:60,alignItems:'center',justifyContent:'center',marginBottom:10,borderRadius:5}}>
                    <Text style={{color:'#fff',fontFamily:'poppins',fontSize:12}}>Service 3</Text>
                  </View>
                  <Text style={{color:'#323446',fontFamily:'poppins',fontSize:12}}>Coiffure de soirée</Text>
                  <Text style={{color:'#323446',fontFamily:'poppins',fontSize:12}}>45min</Text>
                  <View style={{marginTop:10}}>
                    <Text style={{color:'#fd6c57',fontFamily:'poppins',fontSize:12}}>9 000 DA</Text>
                  </View>
                  
               </View>
               <View style={{width:'20%',justifyContent:'space-between',alignItems:'center',borderLeftWidth:2,borderLeftColor:'#323446'}}>
                <TouchableOpacity style={styles.iconFormCircleService}>
                        <Entypo title = "edit" name ='edit' color='#BA55D3' size={23} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconFormCircleService}>
                      <MaterialIcons title = "delete" name ='delete-forever' color='#FE457C' size={23} />
                </TouchableOpacity> 
               </View>
           </View>
         </ScrollView>): 
         (<ScrollView style={{width:'100%'}} showsVerticalScrollIndicator={false}>
           <View style={styles.disponibilityContainer}>
              <View style={styles.dayContainer}>
                    <Text style={{fontFamily:'poppins-bold',fontSize:12,color:switchSat ? '#fd6c57':'#323446'}}>Samedi</Text>
                    <Switch style={switchIOS} value={switchSat} onValueChange={()=>setSwitchSat(prevValue=>!prevValue)} trackColor={{true:'rgba(253,108,87,0.7)'}} thumbColor={switchSat? '#fd6c57': 'white'}/>
              </View>
              <View>
                  <TouchableOpacity>
                    <Text style={styles.debutEndText} onPress={()=>{ if(switchSat){showDatePicker();setSat({...sat,isOpenSat:true});setId('sat');} }}>{sat.isOpenSat === true ? sat.openTimeSat: 'Début'} - <Text onPress={()=>{if(switchSat){showDatePicker();setSatClose({...satClose,isCloseSat:true});setId('satClose')}}}>{satClose.isCloseSat ? satClose.closeTimeSat : 'Fin'}</Text></Text>
                  </TouchableOpacity>
              </View>
           </View>

           <View style={{overflow:'hidden',shadowOpacity:1,shadowRadius:10,shadowColor:"#323446",borderRadius:10,elevation:5,paddingHorizontal:10,paddingVertical:15,marginVertical:10,width:'90%',alignSelf:'center',backgroundColor:'#f9f9f9',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
              <View style={{alignItems:'flex-start',justifyContent:'center'}}>
                    <Text style={{fontFamily:'poppins-bold',fontSize:12,color:switchSun ? '#fd6c57':'#323446'}}>Dimanche</Text>
                    <Switch style={switchIOS} value={switchSun} onValueChange={()=>setSwitchSun(prevValue=>!prevValue)} trackColor={{true:'rgba(253,108,87,0.7)'}} thumbColor={switchSun? '#fd6c57': 'white'}/>
              </View>
              <View stlye={{backgroundColor:'red'}}>
                  <TouchableOpacity>
                    <Text style={{fontFamily:'poppins',color:'#323446',fontSize:12}} onPress={()=>{ if(switchSun){showDatePicker();setSun({...sun,isOpenSun:true});setId('sun');} }}>{sun.isOpenSun === true ? sun.openTimeSun: 'Début'} - <Text onPress={()=>{if(switchSun){showDatePicker();setSunClose({...sunClose,isCloseSun:true});setId('sunClose')}}}>{sunClose.isCloseSun ? sunClose.closeTimeSun : 'Fin'}</Text></Text>
                  </TouchableOpacity>
              </View>
           </View>

           <View style={{overflow:'hidden',shadowOpacity:1,shadowRadius:10,shadowColor:"#323446",borderRadius:10,elevation:5,paddingHorizontal:10,paddingVertical:15,marginVertical:10,width:'90%',alignSelf:'center',backgroundColor:'#f9f9f9',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
              <View style={{alignItems:'flex-start',justifyContent:'center'}}>
                    <Text style={{fontFamily:'poppins-bold',fontSize:12,color:switchMon ? '#fd6c57':'#323446'}}>Lundi</Text>
                    <Switch style={switchIOS} value={switchMon} onValueChange={()=>setSwitchMon(prevValue=>!prevValue)} trackColor={{true:'rgba(253,108,87,0.7)'}} thumbColor={switchMon? '#fd6c57': 'white'}/>
              </View>
              <View stlye={{backgroundColor:'red'}}>
                  <TouchableOpacity>
                    <Text style={{fontFamily:'poppins',color:'#323446',fontSize:12}} onPress={()=>{ if(switchMon){showDatePicker();setMon({...mon,isOpenMon:true});setId('mon');} }}>{mon.isOpenMon === true ? mon.openTimeMon: 'Début'} - <Text onPress={()=>{if(switchMon){showDatePicker();setMonClose({...monClose,isCloseSat:true});setId('monClose')}}}>{monClose.isCloseSat ? monClose.closeTimeMon : 'Fin'}</Text></Text>
                  </TouchableOpacity>
              </View>
           </View>

           <View style={{overflow:'hidden',shadowOpacity:1,shadowRadius:10,shadowColor:"#323446",borderRadius:10,elevation:5,paddingHorizontal:10,paddingVertical:15,marginVertical:10,width:'90%',alignSelf:'center',backgroundColor:'#f9f9f9',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
              <View style={{alignItems:'flex-start',justifyContent:'center'}}>
                    <Text style={{fontFamily:'poppins-bold',fontSize:12,color:switchTue ? '#fd6c57':'#323446'}}>Mardi</Text>
                    <Switch style={switchIOS} value={switchTue} onValueChange={()=>setSwitchTue(prevValue=>!prevValue)} trackColor={{true:'rgba(253,108,87,0.7)'}} thumbColor={switchTue? '#fd6c57': 'white'}/>
              </View>
              <View stlye={{backgroundColor:'red'}}>
                  <TouchableOpacity>
                    <Text style={{fontFamily:'poppins',color:'#323446',fontSize:12}} onPress={()=>{ if(switchTue){showDatePicker();setTue({...tue,isOpenTue:true});setId('tue');} }}>{tue.isOpenTue === true ? tue.openTimeTue: 'Début'} - <Text onPress={()=>{if(switchTue){showDatePicker();setTueClose({...tueClose,isCloseTue:true});setId('tueClose')}}}>{tueClose.isCloseTue ? tueClose.closeTimeTue : 'Fin'}</Text></Text>
                  </TouchableOpacity>
              </View>
           </View>

           <View style={{overflow:'hidden',shadowOpacity:1,shadowRadius:10,shadowColor:"#323446",borderRadius:10,elevation:5,paddingHorizontal:10,paddingVertical:15,marginVertical:10,width:'90%',alignSelf:'center',backgroundColor:'#f9f9f9',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
              <View style={{alignItems:'flex-start',justifyContent:'center'}}>
                    <Text style={{fontFamily:'poppins-bold',fontSize:12,color:switchWed ? '#fd6c57':'#323446'}}>Mercredi</Text>
                    <Switch style={switchIOS} value={switchWed} onValueChange={()=>setSwitchSat(prevValue=>!prevValue)} trackColor={{true:'rgba(253,108,87,0.7)'}} thumbColor={switchSat? '#fd6c57': 'white'}/>
              </View>
              <View stlye={{backgroundColor:'red'}}>
                  <TouchableOpacity>
                    <Text style={{fontFamily:'poppins',color:'#323446',fontSize:12}} onPress={()=>{ if(switchSat){showDatePicker();setSat({...sat,isOpenSat:true});setId('sat');} }}>{sat.isOpenSat === true ? sat.openTimeSat: 'Début'} - <Text onPress={()=>{if(switchSat){showDatePicker();setSatClose({...satClose,isCloseSat:true});setId('satClose')}}}>{satClose.isCloseSat ? satClose.closeTimeSat : 'Fin'}</Text></Text>
                  </TouchableOpacity>
              </View>
           </View>

           <View style={{overflow:'hidden',shadowOpacity:1,shadowRadius:10,shadowColor:"#323446",borderRadius:10,elevation:5,paddingHorizontal:10,paddingVertical:15,marginVertical:10,width:'90%',alignSelf:'center',backgroundColor:'#f9f9f9',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
              <View style={{alignItems:'flex-start',justifyContent:'center'}}>
                    <Text style={{fontFamily:'poppins-bold',fontSize:12,color:switchSat ? '#fd6c57':'#323446'}}>Jeudi</Text>
                    <Switch style={switchIOS} value={switchSat} onValueChange={()=>setSwitchSat(prevValue=>!prevValue)} trackColor={{true:'rgba(253,108,87,0.7)'}} thumbColor={switchSat? '#fd6c57': 'white'}/>
              </View>
              <View stlye={{backgroundColor:'red'}}>
                  <TouchableOpacity>
                    <Text style={{fontFamily:'poppins',color:'#323446',fontSize:12}} onPress={()=>{ if(switchSat){showDatePicker();setSat({...sat,isOpenSat:true});setId('sat');} }}>{sat.isOpenSat === true ? sat.openTimeSat: 'Début'} - <Text onPress={()=>{if(switchSat){showDatePicker();setSatClose({...satClose,isCloseSat:true});setId('satClose')}}}>{satClose.isCloseSat ? satClose.closeTimeSat : 'Fin'}</Text></Text>
                  </TouchableOpacity>
              </View>
           </View>

           <View style={{overflow:'hidden',shadowOpacity:1,shadowRadius:10,shadowColor:"#323446",borderRadius:10,elevation:5,paddingHorizontal:10,paddingVertical:15,marginVertical:10,width:'90%',alignSelf:'center',backgroundColor:'#f9f9f9',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
              <View style={{alignItems:'flex-start',justifyContent:'center'}}>
                    <Text style={{fontFamily:'poppins-bold',fontSize:12,color:switchSat ? '#fd6c57':'#323446'}}>Vendredi</Text>
                    <Switch style={switchIOS} value={switchSat} onValueChange={()=>setSwitchSat(prevValue=>!prevValue)} trackColor={{true:'rgba(253,108,87,0.7)'}} thumbColor={switchSat? '#fd6c57': 'white'}/>
              </View>
              <View stlye={{backgroundColor:'red'}}>
                  <TouchableOpacity>
                    <Text style={{fontFamily:'poppins',color:'#323446',fontSize:12}} onPress={()=>{ if(switchSat){showDatePicker();setSat({...sat,isOpenSat:true});setId('sat');} }}>{sat.isOpenSat === true ? sat.openTimeSat: 'Début'} - <Text onPress={()=>{if(switchSat){showDatePicker();setSatClose({...satClose,isCloseSat:true});setId('satClose')}}}>{satClose.isCloseSat ? satClose.closeTimeSat : 'Fin'}</Text></Text>
                  </TouchableOpacity>
              </View>
           </View>
            

             <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="time"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
              is24Hour={true}
              />
           </ScrollView>)} 
        </View>
          
     );    
};

BarberServiceScreen.navigationOptions = navData => {
    
    return  {
    
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
        headerRight : () =>(
          <HeaderButtons HeaderButtonComponent = {HeaderButton}> 
            <Item title = "save" 
              iconName ='ios-checkmark'
              color='#fff'
              size={23}       
            />
          </HeaderButtons>)
  };
  
}

const styles= StyleSheet.create({
    container:{
      flex:1,
      backgroundColor:'white',
      width:'100%',
      alignItems:'center'
    },
    
  firstContainer:{
    width:'100%',
    height:'40%',
    alignItems:'center',
    backgroundColor:'#f9f9f9'
  },
  coverContainer:{
    width:'100%',
    height:'40%',
    overflow:'hidden'
  },
  icon:{
    width:'100%',
    height:'100%',
  },
  cover:{
    width:'100%',
    resizeMode:'contain',
    height:'100%'
  },
  infoContainer:{
    width:'100%',
    height:'40%',
    alignItems:'center'
  },
  imageContainer:{
    width:90,
    height:90,
    borderRadius:50,
    marginTop:-55,
    overflow:'hidden'
  },
  bname:{
    fontFamily:'poppins-bold',
    fontSize:17,color:'#323446',
    paddingTop:3
  },
  menu:{
    width:'90%',
    height:'20%',
    flexDirection:'row',
    justifyContent:'space-around',
    alignItems:'flex-end'
  },
  itemContainer:{
    borderBottomWidth:2,
    borderBottomColor:'#fd6c57',
    paddingBottom:3
  },
  itemText:{
    fontFamily:'poppins',
    color:'grey',
    fontSize:12
  },
  iconFormCircle:{
    backgroundColor:'#FD6C57',
    width:40,
    height:40,
    borderRadius:20,
    justifyContent:'center',
    alignItems:'center',
  },
  iconFormCircleService:{
    width:30,
    height:30,
    borderRadius:20,
    justifyContent:'center',
    alignItems:'center',
  },
  serviceContainer:{
    overflow:'hidden',
    shadowOpacity:1,
    shadowRadius:10,
    shadowColor:"#323446",
    elevation:5,
    alignSelf:'center',
    flexDirection:'row',
    width:'90%',
    marginVertical:10,
    backgroundColor:'#f9f9f9',
    borderRadius:10,
    paddingHorizontal:10,
    paddingVertical:15
  },
  serviceTextContainer:{
    backgroundColor:'#fd6c57',
    width:60,
    alignItems:'center',
    justifyContent:'center',
    marginBottom:10,
    borderRadius:5
  },
  serviceText:{
    color:'#fff',
    fontFamily:'poppins',
    fontSize:12
  },
  detailText:{
    color:'#323446',
    fontFamily:'poppins',
    fontSize:12
  },
  priceContainer:{
    marginTop:10
  },
  price:{
    color:'#fd6c57',
    fontFamily:'poppins',
    fontSize:12
  },
  iconsContainer:{
    width:'20%',
    justifyContent:'space-between',
    alignItems:'center',
    borderLeftWidth:2,
    borderLeftColor:'#323446'
  },
  disponibilityContainer:{
    overflow:'hidden',
    shadowOpacity:1,
    shadowRadius:10,
    shadowColor:"#323446",
    borderRadius:10,
    elevation:5,
    paddingHorizontal:10,
    paddingVertical:15,
    marginVertical:10,
    width:'90%',
    alignSelf:'center',
    backgroundColor:'#f9f9f9',
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center'
  },
  dayContainer:{
    alignItems:'flex-start',
    justifyContent:'center'
  },
  debutEndText:{
    fontFamily:'poppins',
    color:'#323446',
    fontSize:12
  }
});

export default BarberServiceScreen;