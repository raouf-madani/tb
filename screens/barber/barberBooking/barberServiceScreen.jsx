import React, {useState,useEffect,useCallback} from 'react';
import { StyleSheet,View,Image, ScrollView,ImageBackground,Text,TouchableOpacity,Switch,Platform,ActivityIndicator,Alert} from 'react-native';
import {Button } from 'react-native-elements';
import Colors from '../../../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import ServiceCart from '../../../components/ServiceCart';
import {MaterialIcons,Entypo} from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {HeaderButtons,Item} from "react-navigation-header-buttons";
import HeaderButton from "../../../components/HeaderButton";
import { useDispatch,useSelector } from 'react-redux';
import * as barberActions from '../../../store/actions/barberActions';
import * as servicesActions from '../../../store/actions/serviceActions';

 
const BarberServiceScreen = props =>{
  
  const [isServices,setIsServices]= useState(true);
  const [isDisponible,setIsDisponible]= useState(false);

  const barberID= props.navigation.getParam('barberID');  //get Barber ID
  const [error, setError] = useState();
  const [isLoading,setIsLoading]= useState(false);//ActivityIndicator handling

  const dispatch= useDispatch();

   /*
   *******Fetch One barber DATA
  */
 const getBarber=useCallback(async()=>{
  try{
    setError(null);
    setIsLoading(true);
    await dispatch(barberActions.setBarber(barberID));
    setIsLoading(false);
    }catch(err){
      setError(err);
      if(err){
        Alert.alert('Oups!','Une erreur est survenue',[{text:'OK'}]);
    } 
      console.log(err);
    }
},[dispatch]);

  useEffect(()=>{
  getBarber();
  },[dispatch,getBarber]);

  useEffect(()=>{
    const willFocusSub= props.navigation.addListener('willFocus',getBarber);
    return ()=>{
      willFocusSub.remove();
    };
  },[getBarber]);

  const barber= useSelector(state=>state.barbers.barber);

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



    const deleteHandler = id => {
      Alert.alert('Êtes-vous sûr?','Voulez-vous vraiment supprimer ce service?',[
                  {text: 'Non', style:'default'}, {text:'Oui',style:'destructive',
                    onPress: async() =>{
                      {
                        setIsLoading(true);
                        await dispatch(servicesActions.deleteService(id));
                        getBarber();
                        setIsLoading(false);
                      }
                    }}
      ]);

   };

   useEffect(() => {
    if(error){
        Alert.alert('Oups','Une erreur est survenue!',[{text:'OK'}]);
        console.log(error);
    } 
  }, [error]); 

    if(isLoading){
      return <View style={styles.activityIndicatorContainer} >
              <ActivityIndicator size='large' color={Colors.primary} />
             </View>
    };

     
    if(barber[0].services.length === 0){
      return (
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
             <View style={styles.iconsMenuContainer}>
               <TouchableOpacity style={styles.iconContainer} onPress={()=>props.navigation.navigate('EditService')}>
                 <View style={styles.iconFormCircle}>
                         <MaterialIcons title = "service" name ='add-shopping-cart' color='#fff' size={23} onPress={()=>props.navigation.navigate('EditService')} />
                 </View>
                 <Text style={styles.iconText}>Ajouter Service</Text>
               </TouchableOpacity>
               <TouchableOpacity style={styles.iconContainer} onPress={()=>props.navigation.navigate('BarberGalery')}>
               <View style={styles.iconFormCircle1}>
                       <MaterialIcons title = "portfolio" name ='linked-camera' color='#fff' size={23} onPress={()=>props.navigation.navigate('EditService')} />
               </View>
               <Text style={styles.iconText}>Ajouter Portfolio</Text>
               </TouchableOpacity>
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
        {isServices ? (<View style={styles.noServicesContainer}>
            <View style={{marginBottom:10,alignSelf:'center'}}>
              <Text style={styles.noServicesText}>Aucun service trouvé.</Text>
            </View>
            <Button
              theme={{colors: {primary:'#fd6c57'}}} 
              title="Ajouter"
              titleStyle={styles.labelButton}
              buttonStyle={styles.buttonStyle}
              ViewComponent={LinearGradient} 
              onPress={()=>props.navigation.navigate('EditService')}
              linearGradientProps={{
                  colors: ['#fd6d57', '#fd9054'],
                  start: {x: 0, y: 0} ,
                  end:{x: 1, y: 0}
                }}/>
        </View>): (<ScrollView style={{width:'100%'}} showsVerticalScrollIndicator={false}>
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
      )
   }
   
   
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
              <View style={styles.iconsMenuContainer}>
                <TouchableOpacity style={styles.iconContainer} onPress={()=>props.navigation.navigate('EditService')}>
                  <View style={styles.iconFormCircle}>
                          <MaterialIcons title = "service" name ='add-shopping-cart' color='#fff' size={23} onPress={()=>props.navigation.navigate('EditService')} />
                  </View>
                  <Text style={styles.iconText}>Ajouter Service</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconContainer} onPress={()=>props.navigation.navigate('BarberGalery')}>
                <View style={styles.iconFormCircle1}>
                        <MaterialIcons title = "portfolio" name ='linked-camera' color='#fff' size={23} onPress={()=>props.navigation.navigate('EditService')} />
                </View>
                <Text style={styles.iconText}>Ajouter Portfolio</Text>
                </TouchableOpacity>
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
          {barber[0].services.map(service=>
          <ServiceCart
            key={service.serviceId}
            number={1}
            name={service.name}
            minute={service.duration}
            price={service.price}
            onPressUpdate={()=>props.navigation.navigate('EditService',{idService:service.serviceId})}
            onPressDelete={deleteHandler.bind(this,service.serviceId)}
          />)}
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
              iconName ='md-checkmark'
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
    height:'30%',
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
    height:'30%',
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
  iconFormCircle1:{
    backgroundColor:'#BA55D3',
    width:40,
    height:40,
    borderRadius:20,
    justifyContent:'center',
    alignItems:'center'
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
  },
  iconsMenuContainer:{
    flexDirection:'row',
    paddingVertical:5
  },
  iconContainer:{
    marginHorizontal:13,
    alignItems:'center'
  },
  iconText:{
    fontFamily:'poppins',
    color:'grey',
    paddingTop:3,
    fontSize:10
  },
  activityIndicatorContainer:{
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'white'
 },
 noServicesContainer:{
  width:'100%',
  height:'50%',
  justifyContent:'center'
},
noServicesText:{
  fontFamily:'poppins',
  fontSize:14,
  color:Colors.blue
},
labelButton:{
  color:'#FFF',
  fontFamily:'poppins',
  fontSize:16,
  textTransform:null,
 },
 buttonStyle:{
  borderColor:'#fd6c57',
  width:'50%',
  borderRadius:20,
  height:45,
  alignSelf:'center'
 }
});

export default BarberServiceScreen;