import React, {useState,useEffect,useCallback} from 'react';
import { StyleSheet,View,Image, ScrollView,ImageBackground,Text,TouchableOpacity,StatusBar,Platform,ActivityIndicator,Alert,Dimensions} from 'react-native';
import {Button } from 'react-native-elements';
import Colors from '../../../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import ServiceCart from '../../../components/ServiceCart';
import {MaterialIcons} from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {HeaderButtons,Item} from "react-navigation-header-buttons";
import HeaderButton from "../../../components/HeaderButton";
import WorkTimeCart from "../../../components/WorkTimeCart";
import { useDispatch,useSelector } from 'react-redux';
import * as barberActions from '../../../store/actions/barberActions';
import * as servicesActions from '../../../store/actions/serviceActions';
import * as worktimeActions from '../../../store/actions/worktimeActions';
import polylanar from "../../../lang/ar";
import polylanfr from "../../../lang/fr";


const screen = Dimensions.get("window");
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

const BarberServiceScreen = props =>{
  
  const [isServices,setIsServices]= useState(true);
  const [isDisponible,setIsDisponible]= useState(false);
  
  
  const barberID= props.navigation.getParam('barberID');  //get Barber ID
  
  const [error, setError] = useState();
  const [isLoading,setIsLoading]= useState(false);//ActivityIndicator handling
  const [isUpdating,setIsUpdating]= useState(false);//ActivityIndicator handling for worktime update

  const dispatch= useDispatch();
  const isImage= {beard:{uri:'http://95.111.243.233/assets/tahfifabarber/barbe.jpg'},hair:{uri:'http://95.111.243.233/assets/tahfifabarber/hair.jpg'},supp:{uri:'http://95.111.243.233/assets/tahfifabarber/supplements.jpg'},womanHair:{uri:'http://95.111.243.233/assets/tahfifabarber/womanhair.jpg'},wedding:{uri:'http://95.111.243.233/assets/tahfifabarber/mariage.jpg'},care:{uri:'http://95.111.243.233/assets/tahfifabarber/soins.jpg'},manCare:{uri:'http://95.111.243.233/assets/tahfifabarber/soinshomme.jpg'},makeup:{uri:'http://95.111.243.233/assets/tahfifabarber/makeup.jpg'},manucure:{uri:'http://95.111.243.233/assets/tahfifabarber/manucure.jpg'},pedicure:{uri:'http://95.111.243.233/assets/tahfifabarber/pedicure.jpg'},epilation:{uri:'http://95.111.243.233/assets/tahfifabarber/epilation.jpg'}};
   //variables for open times
  let satTimeO;
  let sunTimeO;
  let monTimeO;
  let tueTimeO; 
  let wedTimeO;
  let thuTimeO;
  let friTimeO;

  //variables for closed times
  let satTimeC;
  let sunTimeC;
  let monTimeC;
  let tueTimeC;
  let wedTimeC;
  let thuTimeC;
  let friTimeC;

   /*
   *******Fetch One barber DATA
  */
 const getBarber=useCallback(async()=>{
  try{
    setError(false);
    setIsLoading(true);
    await dispatch(barberActions.setBarber(barberID));
    setIsLoading(false);
    }catch(err){
      setError(true);
      if(err){
        Alert.alert('Oups!','Votre connexion est trop faible!',[{text:'OK'}]);
    } 
      console.log(err);
      throw err;
    }
},[dispatch,setError]);

  useEffect(()=>{
  getBarber();
  },[dispatch,getBarber,setError]);

   


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

    
     //Switch buttons states for slots
     const [switchSat, setSwitchSat] = useState(barber[0] && barber[0].workingTimes['Sam']?barber[0].workingTimes['Sam'].isworking : false);
     const [switchSun, setSwitchSun] = useState(barber[0] && barber[0].workingTimes['Dim']?barber[0].workingTimes['Dim'].isworking :false);
     const [switchMon, setSwitchMon] = useState(barber[0] && barber[0].workingTimes['Lun']?barber[0].workingTimes['Lun'].isworking :false);
     const [switchTue, setSwitchTue] = useState(barber[0] && barber[0].workingTimes['Mar']?barber[0].workingTimes['Mar'].isworking :false);
     const [switchWed, setSwitchWed] = useState(barber[0] && barber[0].workingTimes['Mer']?barber[0].workingTimes['Mer'].isworking :false);
     const [switchThu, setSwitchThu] = useState(barber[0] && barber[0].workingTimes['Jeu']?barber[0].workingTimes['Jeu'].isworking:false);
     const [switchFri, setSwitchFri] = useState(barber[0] && barber[0].workingTimes['Ven']?barber[0].workingTimes['Ven'].isworking :false);
   
     //Text states for 7 days isOpenSat ? date : Début
     // isCloseSat ? date : Fin
     //Open Date states for 7 days. isOpenSat ? openTimeSat : Début
     //Close Date states for 7 days. isCloseSat ? closeTimeSat : Fin
     const [sat, setSat] = useState({isOpenSat:barber[0] && barber[0].workingTimes['Sam']?barber[0].workingTimes['Sam'].isworking :false,openTimeSat:barber[0] && barber[0].workingTimes['Sam']?barber[0].workingTimes['Sam'].debut :null});
     const [satClose, setSatClose] = useState({isCloseSat:barber[0] && barber[0].workingTimes['Sam']?barber[0].workingTimes['Sam'].isworking :false,closeTimeSat:barber[0] && barber[0].workingTimes['Sam']?barber[0].workingTimes['Sam'].finish :null});
     const [sun, setSun] = useState({isOpenSun:barber[0] && barber[0].workingTimes['Dim']?barber[0].workingTimes['Dim'].isworking :false,openTimeSun:barber[0] && barber[0].workingTimes['Dim']?barber[0].workingTimes['Dim'].debut :null});
     const [sunClose, setSunClose] = useState({isCloseSun:barber[0] && barber[0].workingTimes['Dim']?barber[0].workingTimes['Dim'].isworking :false,closeTimeSun:barber[0] && barber[0].workingTimes['Dim']?barber[0].workingTimes['Dim'].finish :null});
     const [mon, setMon] = useState({isOpenMon:barber[0] && barber[0].workingTimes['Lun']?barber[0].workingTimes['Lun'].isworking :false,openTimeMon:barber[0] && barber[0].workingTimes['Lun']?barber[0].workingTimes['Lun'].debut :null});
     const [monClose, setMonClose] = useState({isCloseMon:barber[0] && barber[0].workingTimes['Lun']?barber[0].workingTimes['Lun'].isworking :false,closeTimeMon:barber[0] && barber[0].workingTimes['Lun']?barber[0].workingTimes['Lun'].finish :null});
     const [tue, setTue] = useState({isOpenTue:barber[0] && barber[0].workingTimes['Mar']?barber[0].workingTimes['Mar'].isworking :false,openTimeTue:barber[0] && barber[0].workingTimes['Mar']?barber[0].workingTimes['Mar'].debut :null});
     const [tueClose, setTueClose] = useState({isCloseTue:barber[0] && barber[0].workingTimes['Mar']?barber[0].workingTimes['Mar'].isworking :false,closeTimeTue:barber[0] && barber[0].workingTimes['Mar']?barber[0].workingTimes['Mar'].finish :null});
     const [wed, setWed] = useState({isOpenWed:barber[0] && barber[0].workingTimes['Mer']?barber[0].workingTimes['Mer'].isworking :false,openTimeWed:barber[0] && barber[0].workingTimes['Mer']?barber[0].workingTimes['Mer'].debut :null});
     const [wedClose, setWedClose] = useState({isCloseWed:barber[0] && barber[0].workingTimes['Mer']?barber[0].workingTimes['Mer'].isworking :false,closeTimeWed:barber[0] && barber[0].workingTimes['Mer']?barber[0].workingTimes['Mer'].finish :null});
     const [thu, setThu] = useState({isOpenThu:barber[0] && barber[0].workingTimes['Jeu']?barber[0].workingTimes['Jeu'].isworking :false,openTimeThu:barber[0] && barber[0].workingTimes['Jeu']?barber[0].workingTimes['Jeu'].debut :null});
     const [thuClose, setThuClose] = useState({isCloseThu:barber[0] && barber[0].workingTimes['Jeu']?barber[0].workingTimes['Jeu'].isworking :false,closeTimeThu:barber[0] && barber[0].workingTimes['Jeu']?barber[0].workingTimes['Jeu'].finish :null});
     const [fri, setFri] = useState({isOpenFri:barber[0] && barber[0].workingTimes['Ven']?barber[0].workingTimes['Ven'].isworking :false,openTimeFri:barber[0] && barber[0].workingTimes['Ven']?barber[0].workingTimes['Ven'].debut :null});
     const [friClose, setFriClose] = useState({isCloseFri:barber[0] && barber[0].workingTimes['Ven']?barber[0].workingTimes['Ven'].isworking :false,closeTimeFri:barber[0] && barber[0].workingTimes['Ven']?barber[0].workingTimes['Ven'].finish :null});
     
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
        let isMounted=true;
        if(!switchSat){
           setSat({...sat,isOpenSat:false,openTimeSat:null});
           setSatClose({...satClose,isCloseSat:false,closeTimeSat:null})
        }if (!switchSun){
           setSun({...sun,isOpenSun:false,openTimeSun:null});
           setSunClose({...sunClose,isCloseSun:false,closeTimeSun:null});
        }if (!switchMon){
           setMon({...mon,isOpenMon:false,openTimeMon:null});
           setMonClose({...monClose,isCloseMon:false,closeTimeMon:null});
        }if (!switchTue){
           setTue({...tue,isOpenTue:false,openTimeTue:null});
           setTueClose({...tueClose,isCloseTue:false,closeTimeTue:null});
        }if(!switchWed){
           setWed({...wed,isOpenWed:false,openTimeWed:null}); 
           setWedClose({...wedClose,isCloseWed:false,closeTimeWed:null});
        }if(!switchThu){
           setThu({...thu,isOpenThu:false,openTimeThu:null});
           setThuClose({...thuClose,isCloseThu:false,closeTimeThu:null});
        }if(!switchFri){
           setFri({...fri,isOpenFri:false,openTimeFri:null});
           setFriClose({...friClose,isCloseFri:false,closeTimeFri:null});
        }    
        return ()=>{
          isMounted = false;
        };
      },[switchSat,switchSun,switchMon,switchTue,switchWed,switchThu,switchFri]);
 
      const handleConfirm = (date) => {
        
        hideDatePicker();
        //set the hours after confirming it in the datePicker
        if(id === 'sat'){
          setSat({...sat,openTimeSat:date.getHours()+':'+date.getMinutes()});
        }else if(id==='satClose'){
          setSatClose({...satClose,closeTimeSat:date.getHours()+':'+date.getMinutes()});
        }else if (id==='sun'){
          setSun({...sun,openTimeSun:date.getHours()+':'+date.getMinutes()}); 
        }else if(id==='sunClose'){
          setSunClose({...sunClose,closeTimeSun:date.getHours()+':'+date.getMinutes()});
        }else if (id==='mon'){
          setMon({...mon,openTimeMon:date.getHours()+':'+date.getMinutes()});
        }else if(id==='monClose'){
          setMonClose({...monClose,closeTimeMon:date.getHours()+':'+date.getMinutes()});
        }else if(id==='tue'){
          setTue({...tue,openTimeTue:date.getHours()+':'+date.getMinutes()});
        }else if(id === 'tueClose'){
          setTueClose({...tueClose,closeTimeTue:date.getHours()+':'+date.getMinutes()});
        }else if(id==='wed'){
          setWed({...wed,openTimeWed:date.getHours()+':'+date.getMinutes()});
        }else if(id==='wedClose'){
          setWedClose({...wedClose,closeTimeWed:date.getHours()+':'+date.getMinutes()});
        }else if(id==='thu'){
          setThu({...thu,openTimeThu:date.getHours()+':'+date.getMinutes()});
        }else if (id === 'thuClose'){
          setThuClose({...thuClose,closeTimeThu:date.getHours()+':'+date.getMinutes()});
        }else if(id === 'fri'){
          setFri({...fri,openTimeFri:date.getHours()+':'+date.getMinutes()});
        }else if(id === 'friClose'){
          setFriClose({...friClose,closeTimeFri:date.getHours()+':'+date.getMinutes()});
        }
      
    };


    const deleteHandler = id => {
      Alert.alert(barber && barber[0].lang?polylanfr.AreYouSure:polylanar.AreYouSure,barber && barber[0].lang?polylanfr.DeleteServiceMessage:polylanar.DeleteServiceMessage,[
                  {text: barber && barber[0].lang?polylanfr.No:polylanar.No, style:'default'}, {text:barber && barber[0].lang?polylanfr.Yes:polylanar.Yes,style:'destructive',
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

   
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //Update barber's worktime data after pressing in Check icon
  const saveHandler = useCallback(async()=>{
      
    //time variables
     satTimeO= sat.openTimeSat;
     sunTimeO= sun.openTimeSun; 
     monTimeO= mon.openTimeMon; 
     tueTimeO= tue.openTimeTue; 
     wedTimeO= wed.openTimeWed; 
     thuTimeO= thu.openTimeThu; 
     friTimeO= fri.openTimeFri; 

     satTimeC= satClose.closeTimeSat;
     sunTimeC= sunClose.closeTimeSun;
     monTimeC= monClose.closeTimeMon;
     tueTimeC= tueClose.closeTimeTue;
     wedTimeC= wedClose.closeTimeWed;
     thuTimeC= thuClose.closeTimeThu;
     friTimeC= friClose.closeTimeFri;

    if(satTimeO && satTimeC) { 
    //sat
     const satHourO= satTimeO.split(':');
     const satHourOInteger= parseInt(satHourO[0]);
     const satHourC= satTimeC.split(':');
     const satHourCInteger= parseInt(satHourC[0]);
     if(satHourOInteger >=  satHourCInteger){
      Alert.alert(barber && barber[0].lang?polylanfr.Oups:polylanar.Oups,barber && barber[0].lang?polylanfr.SaturdayHours:polylanar.SaturdayHours,[{text:barber && barber[0].lang?polylanfr.OK:polylanar.OK}]);
      return;
     }
    }else if((satTimeO && !satTimeC) || (!satTimeO && satTimeC)){
      Alert.alert(barber && barber[0].lang?polylanfr.Oups:polylanar.Oups,"Veuillez compléter les horaires de la journée du Samedi s'il vous plaît",[{text:barber && barber[0].lang?polylanfr.OK:polylanar.OK}]);
      return;
    }
   
    if(sunTimeO && sunTimeC) { 
     //sun
     const sunHourO= sunTimeO.split(':');
     const sunHourOInteger= parseInt(sunHourO[0]);
     const sunHourC= sunTimeC.split(':');
     const sunHourCInteger= parseInt(sunHourC[0]);
     if(sunHourOInteger >=  sunHourCInteger){
      Alert.alert(barber && barber[0].lang?polylanfr.Oups:polylanar.Oups,barber && barber[0].lang?polylanfr.SundayHours:polylanar.SundayHours,[{text:barber && barber[0].lang?polylanfr.OK:polylanar.OK}]);
      return;
     }
    }else if((sunTimeO && !sunTimeC) || (!sunTimeO && sunTimeC)){
      Alert.alert(barber && barber[0].lang?polylanfr.Oups:polylanar.Oups,"Veuillez compléter les horaires de la journée du Dimanche s'il vous plaît",[{text:barber && barber[0].lang?polylanfr.OK:polylanar.OK}]);
      return;
    }

    if(monTimeO && monTimeC) {
     //mon
     const monHourO= monTimeO.split(':');
     const monHourOInteger= parseInt(monHourO[0]);
     const monHourC= monTimeC.split(':');
     const monHourCInteger= parseInt(monHourC[0]);
     if(monHourOInteger >=  monHourCInteger){
      Alert.alert(barber && barber[0].lang?polylanfr.Oups:polylanar.Oups,barber && barber[0].lang?polylanfr.MondayHours:polylanar.MondayHours,[{text:barber && barber[0].lang?polylanfr.OK:polylanar.OK}]);
      return;
     }
    }else if((monTimeO && !monTimeC) || (!monTimeO && monTimeC)){
      Alert.alert(barber && barber[0].lang?polylanfr.Oups:polylanar.Oups,"Veuillez compléter les horaires de la journée du Lundi s'il vous plaît",[{text:barber && barber[0].lang?polylanfr.OK:polylanar.OK}]);
      return;
    }

    if(tueTimeO && tueTimeC) {   
     //tue
     const tueHourO=tueTimeO.split(':');
     const tueHourOInteger= parseInt(tueHourO[0]);
     const tueHourC=tueTimeC.split(':');
     const tueHourCInteger= parseInt(tueHourC[0]);
     if(tueHourOInteger >=  tueHourCInteger){
      Alert.alert(barber && barber[0].lang?polylanfr.Oups:polylanar.Oups,barber && barber[0].lang?polylanfr.TuesdayHours:polylanar.TuesdayHours,[{text:barber && barber[0].lang?polylanfr.OK:polylanar.OK}]);
      return;
     }
    }else if((tueTimeO && !tueTimeC) || (!tueTimeO && tueTimeC)){
      Alert.alert(barber && barber[0].lang?polylanfr.Oups:polylanar.Oups,"Veuillez compléter les horaires de la journée du Mardi s'il vous plaît",[{text:barber && barber[0].lang?polylanfr.OK:polylanar.OK}]);
      return;
    }

    if(wedTimeO && wedTimeC) {
     //wed
     const wedHourO=wedTimeO.split(':');
     const wedHourOInteger= parseInt(wedHourO[0]);
     const wedHourC=wedTimeC.split(':');
     const wedHourCInteger= parseInt(wedHourC[0]);
     if(wedHourOInteger >=  wedHourCInteger){
      Alert.alert(barber && barber[0].lang?polylanfr.Oups:polylanar.Oups,barber && barber[0].lang?polylanfr.WednesdayHours:polylanar.WednesdayHours,[{text:barber && barber[0].lang?polylanfr.OK:polylanar.OK}]);
      return;
     }
    }else if((wedTimeO && !wedTimeC) || (!wedTimeO && wedTimeC)){
      Alert.alert(barber && barber[0].lang?polylanfr.Oups:polylanar.Oups,"Veuillez compléter les horaires de la journée du Mercredi s'il vous plaît",[{text:barber && barber[0].lang?polylanfr.OK:polylanar.OK}]);
      return;
    }

    if(thuTimeO && thuTimeC) {
     //thu
     const thuHourO=thuTimeO.split(':');
     const thuHourOInteger= parseInt(thuHourO[0]);
     const thuHourC=thuTimeC.split(':');
     const thuHourCInteger= parseInt(thuHourC[0]);
     if(thuHourOInteger >=  thuHourCInteger){
      Alert.alert(barber && barber[0].lang?polylanfr.Oups:polylanar.Oups,barber && barber[0].lang?polylanfr.ThursdayHours:polylanar.ThursdayHours,[{text:barber && barber[0].lang?polylanfr.OK:polylanar.OK}]);
      return;
     }
    }else if((thuTimeO && !thuTimeC) || (!thuTimeO && thuTimeC)){
      Alert.alert(barber && barber[0].lang?polylanfr.Oups:polylanar.Oups,"Veuillez compléter les horaires de la journée du Jeudi s'il vous plaît",[{text:barber && barber[0].lang?polylanfr.OK:polylanar.OK}]);
      return;
    }

    if(friTimeO && friTimeC) {
     //fri
     const friHourO=friTimeO.split(':');
     const friHourOInteger= parseInt(friHourO[0]);
     const friHourC=friTimeC.split(':');
     const friHourCInteger= parseInt(friHourC[0]);
     if(friHourOInteger >=  friHourCInteger){
      Alert.alert(barber && barber[0].lang?polylanfr.Oups:polylanar.Oups,barber && barber[0].lang?polylanfr.FridayHours:polylanar.FridayHours,[{text:barber && barber[0].lang?polylanfr.OK:polylanar.OK}]);
      return;
     }
    }else if((friTimeO && !friTimeC) || (!friTimeO && friTimeC)){
      Alert.alert(barber && barber[0].lang?polylanfr.Oups:polylanar.Oups,"Veuillez compléter les horaires de la journée du Vendredi s'il vous plaît",[{text:barber && barber[0].lang?polylanfr.OK:polylanar.OK}]);
      return;
    }

    try{
      
      setIsUpdating(true);
       
       await dispatch(worktimeActions.updateWorktime(
         switchSat,switchSun,switchMon,switchTue,switchWed,switchThu,switchFri,
         satTimeO,sunTimeO,monTimeO,tueTimeO,wedTimeO,thuTimeO,friTimeO,
         satTimeC,sunTimeC,monTimeC,tueTimeC,wedTimeC,thuTimeC,friTimeC,barber[0].id));

        setIsUpdating(false);   
                  
      Alert.alert(barber && barber[0].lang?polylanfr.Congratulations:polylanar.Congratulations,barber && barber[0].lang?polylanfr.SuccessfulDataSent:polylanar.SuccessfulDataSent,[{text:barber && barber[0].lang?polylanfr.OK:polylanar.OK}]);
  
    }catch(err){
      console.log(err);
      Alert.alert(barber && barber[0].lang?polylanfr.Oups:polylanar.Oups,barber && barber[0].lang?polylanfr.WeakInternet:polylanar.WeakInternet,[{text:barber && barber[0].lang?polylanfr.OK:polylanar.OK}]);
    }
    
  
  },[dispatch,switchSat,switchSun,switchMon,switchTue,switchWed,switchThu,switchFri,sat.openTimeSat,sun.openTimeSun,mon.openTimeMon,tue.openTimeTue,wed.openTimeWed,thu.openTimeThu,fri.openTimeFri,satClose.closeTimeSat,sunClose.closeTimeSun,monClose.closeTimeMon,tueClose.closeTimeTue,wedClose.closeTimeWed,thuClose.closeTimeThu,friClose.closeTimeFri,barber[0].id]);

   useEffect(()=>{
     let isMounted=true;
     props.navigation.setParams({load:isUpdating});
     props.navigation.setParams({save:saveHandler});
     props.navigation.setParams({disponible:isDisponible});
     return ()=>{
      isMounted = false;
    };
   },[saveHandler,isUpdating,isDisponible]);

  

   
   if(error){
      
    return ( <ImageBackground source={{uri:'http://95.111.243.233/assets/tahfifabarber/support.png'}} style={styles.activityIndicatorContainer}>
              <StatusBar hidden />
                <View style={{marginBottom:screen.width /36,alignSelf:'center'}}>
                  <Text style={styles.noServicesText}>{barber[0] && barber[0].lang?polylanfr.WeakInternet:polylanar.WeakInternet}</Text>
                </View>
                <Button
                  theme={{colors: {primary:'#fd6c57'}}} 
                  title={barber[0] && barber[0].lang?polylanfr.Repeat:polylanar.Repeat}
                  titleStyle={styles.labelButton}
                  buttonStyle={styles.buttonStyle}
                  ViewComponent={LinearGradient}
                  onPress={getBarber}
                  linearGradientProps={{
                      colors: ['#fd6d57', '#fd9054'],
                      start: {x: 0, y: 0} ,
                      end:{x: 1, y: 0}
                    }}/>
            </ImageBackground>);
  };

    if(isLoading){
      return <ImageBackground source={{uri:'http://95.111.243.233/assets/tahfifabarber/support.png'}} style={styles.activityIndicatorContainer} >
              <StatusBar hidden />
              <ActivityIndicator size='large' color={Colors.primary} />
             </ImageBackground>
    };

     
    if(barber[0].services.length === 0){
      return (
        <View style={styles.container}> 
         <StatusBar hidden />
        <View style={styles.firstContainer}>
          <View style={styles.coverContainer}>
              <ImageBackground source={{uri:'http://95.111.243.233/assets/tahfifabarber/barberScreen.png'}} style={styles.cover} />
          </View>
          
          <View style={styles.infoContainer}>
             <View style={styles.imageContainer}>
             {barber[0] && barber[0].image ? <Image source={{uri:`http://95.111.243.233/profileImages/barber/${barber[0].image}`}} style={styles.icon} />:barber && barber[0].sex==='Homme'?
               <Image source={{uri:'http://95.111.243.233/assets/tahfifabarber/unknown.jpg'}} style={styles.icon} />:<Image source={{uri:'http://95.111.243.233/assets/tahfifabarber/unknownfemale.jpg'}} style={styles.icon} />}
             </View>
           
             <Text style={styles.bname}>{barber[0] && barber[0].b_name!==null?barber[0].b_name:barber && barber[0].lang?polylanfr.BusinessName:polylanar.BusinessName}</Text>
             <View style={styles.iconsMenuContainer}>
               <TouchableOpacity style={styles.iconContainer} onPress={()=>props.navigation.navigate('EditService')}>
                 <View style={styles.iconFormCircle}>
                         <MaterialIcons title = "service" name ='add-shopping-cart' color='#fff' size={screen.width/15.7} onPress={()=>props.navigation.navigate('EditService')} />
                 </View>
                 <Text style={styles.iconText}>{barber && barber[0].lang?polylanfr.AddSerivce:polylanar.AddSerivce}</Text>
               </TouchableOpacity>
               <TouchableOpacity style={styles.iconContainer} onPress={()=>props.navigation.navigate('BarberWorkplace',{barberID:barberID})}>
                  <View style={styles.iconFormCircle2}>
                          <MaterialIcons title = "home" name ='home' color='#fff' size={screen.width/15.7} onPress={()=>props.navigation.navigate('BarberWorkplace',{barberID:barberID})} />
                  </View>
                  <Text style={styles.iconText}>{barber && barber[0].lang?polylanfr.ComfortZone:polylanar.ComfortZone}</Text>
                </TouchableOpacity>
               <TouchableOpacity style={styles.iconContainer} onPress={()=>props.navigation.navigate('BarberGalery',{barberID:barberID})}>
               <View style={styles.iconFormCircle1}>
                       <MaterialIcons title = "portfolio" name ='linked-camera' color='#fff' size={screen.width/15.7} onPress={()=>props.navigation.navigate('BarberGalery',{barberID:barberID})} />
               </View>
               <Text style={styles.iconText}>{barber && barber[0].lang?polylanfr.AddPortfolio:polylanar.AddPortfolio}</Text>
               </TouchableOpacity>
             </View>
          </View>
          <View style={styles.menu}>
             <TouchableOpacity style={{borderBottomWidth:screen.width/180,borderBottomColor:isServices ?'#fd6c57':'#f9f9f9',paddingBottom:screen.width/120}} onPress={services}>
              <Text style={styles.itemText}>{barber && barber[0].lang?polylanfr.MyServices:polylanar.MyServices}</Text>
             </TouchableOpacity>
             <TouchableOpacity style={{borderBottomWidth:screen.width/180,borderBottomColor:isDisponible?'#fd6c57':'#f9f9f9',paddingBottom:screen.width/120}} onPress={disponibility}>
              <Text style={styles.itemText}>{barber && barber[0].lang?polylanfr.Available:polylanar.Available}</Text>
             </TouchableOpacity>
          </View>
        </View>
        {isServices ? (<View style={styles.noServicesContainer}>
            <View style={{marginBottom:screen.width/36,alignSelf:'center'}}>
              <Text style={styles.noServicesText}>{barber && barber[0].lang?polylanfr.NoServices:polylanar.NoServices}</Text>
            </View>
            <Button
              theme={{colors: {primary:'#fd6c57'}}} 
              title={barber && barber[0].lang?polylanfr.Add:polylanar.Add}
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
          
           <WorkTimeCart
             switchDay={switchSat}
             day={barber[0].lang?barber[0].workingTimes['Sam'].day:'السبت'}
             value={switchSat}
             onValueChange={()=>setSwitchSat(prevValue=>!prevValue)}
             onPress={()=>{ if(switchSat){showDatePicker();setSat({...sat,isOpenSat:true});setId('sat');} }}
             openDay={sat.isOpenSat}
             openTimeDay={sat.openTimeSat}
             onPress2={()=>{if(switchSat){showDatePicker();setSatClose({...satClose,isCloseSat:true});setId('satClose')}}}
             closeDay={satClose.isCloseSat}
             closeTimeDay={satClose.closeTimeSat}
           />
           <WorkTimeCart
             switchDay={switchSun}
             day={barber[0].lang?barber[0].workingTimes['Dim'].day:'الأحد'}
             value={switchSun}
             onValueChange={()=>setSwitchSun(prevValue=>!prevValue)}
             onPress={()=>{ if(switchSun){showDatePicker();setSun({...sun,isOpenSun:true});setId('sun');} }}
             openDay={sun.isOpenSun}
             openTimeDay={sun.openTimeSun}
             onPress2={()=>{if(switchSun){showDatePicker();setSunClose({...sunClose,isCloseSun:true});setId('sunClose')}}}
             closeDay={sunClose.isCloseSun}
             closeTimeDay={sunClose.closeTimeSun}
           />

           <WorkTimeCart
             switchDay={switchMon}
             day={barber[0].lang?barber[0].workingTimes['Lun'].day:'الإثنين'}
             value={switchMon}
             onValueChange={()=>setSwitchMon(prevValue=>!prevValue)}
             onPress={()=>{ if(switchMon){showDatePicker();setMon({...mon,isOpenMon:true});setId('mon');} }}
             openDay={mon.isOpenMon}
             openTimeDay={mon.openTimeMon}
             onPress2={()=>{if(switchMon){showDatePicker();setMonClose({...monClose,isCloseMon:true});setId('monClose')}}}
             closeDay={monClose.isCloseMon}
             closeTimeDay={monClose.closeTimeMon}
           />

            <WorkTimeCart
             switchDay={switchTue}
             day={barber[0].lang?barber[0].workingTimes['Mar'].day:'الثلاثاء'}
             value={switchTue}
             onValueChange={()=>setSwitchTue(prevValue=>!prevValue)}
             onPress={()=>{ if(switchTue){showDatePicker();setTue({...tue,isOpenTue:true});setId('tue');} }}
             openDay={tue.isOpenTue}
             openTimeDay={tue.openTimeTue}
             onPress2={()=>{if(switchTue){showDatePicker();setTueClose({...tueClose,isCloseTue:true});setId('tueClose')}}}
             closeDay={tueClose.isCloseTue}
             closeTimeDay={tueClose.closeTimeTue}
           />

          <WorkTimeCart
             switchDay={switchWed}
             day={barber[0].lang?barber[0].workingTimes['Mer'].day:'الأربعاء'}
             value={switchWed}
             onValueChange={()=>setSwitchWed(prevValue=>!prevValue)}
             onPress={()=>{ if(switchWed){showDatePicker();setWed({...wed,isOpenWed:true});setId('wed');} }}
             openDay={wed.isOpenWed}
             openTimeDay={wed.openTimeWed}
             onPress2={()=>{if(switchWed){showDatePicker();setWedClose({...wedClose,isCloseWed:true});setId('wedClose')}}}
             closeDay={wedClose.isCloseWed}
             closeTimeDay={wedClose.closeTimeWed}
           />

           <WorkTimeCart
             switchDay={switchThu}
             day={barber[0].lang?barber[0].workingTimes['Jeu'].day:'الخميس'}
             value={switchThu}
             onValueChange={()=>setSwitchThu(prevValue=>!prevValue)}
             onPress={()=>{ if(switchThu){showDatePicker();setThu({...thu,isOpenThu:true});setId('thu');} }}
             openDay={thu.isOpenThu}
             openTimeDay={thu.openTimeThu}
             onPress2={()=>{if(switchThu){showDatePicker();setThuClose({...thuClose,isCloseThu:true});setId('thuClose')}}}
             closeDay={thuClose.isCloseThu}
             closeTimeDay={thuClose.closeTimeThu}
           />

           <WorkTimeCart
             switchDay={switchFri}
             day={barber[0].lang?barber[0].workingTimes['Ven'].day:'الجمعة'}
             value={switchFri}
             onValueChange={()=>setSwitchFri(prevValue=>!prevValue)}
             onPress={()=>{ if(switchFri){showDatePicker();setFri({...fri,isOpenFri:true});setId('fri');} }}
             openDay={fri.isOpenFri}
             openTimeDay={fri.openTimeFri}
             onPress2={()=>{if(switchFri){showDatePicker();setFriClose({...friClose,isCloseFri:true});setId('friClose')}}}
             closeDay={friClose.isCloseFri}
             closeTimeDay={friClose.closeTimeFri}
           />
          
          
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
        <StatusBar hidden />
         <View style={styles.firstContainer}>
           <View style={styles.coverContainer}>
               <ImageBackground source={{uri:'http://95.111.243.233/assets/tahfifabarber/barberScreen.png'}} style={styles.cover} />
           </View>
           
           <View style={styles.infoContainer}>
              <View style={styles.imageContainer}>
              {barber[0] && barber[0].image ? <Image source={{uri:`http://95.111.243.233/profileImages/barber/${barber[0].image}`}} style={styles.icon} />:barber && barber[0].sex==='Homme'?
               <Image source={{uri:'http://95.111.243.233/assets/tahfifabarber/unknown.jpg'}} style={styles.icon} />:<Image source={{uri:'http://95.111.243.233/assets/tahfifabarber/unknownfemale.jpg'}} style={styles.icon} />}
              </View>
            
              <Text style={styles.bname}>{barber[0] && barber[0].b_name!==null?barber[0].b_name:barber && barber[0].lang?polylanfr.BusinessName:polylanar.BusinessName}</Text>
              <View style={styles.iconsMenuContainer}>
                <TouchableOpacity style={styles.iconContainer} onPress={()=>props.navigation.navigate('EditService')}>
                  <View style={styles.iconFormCircle}>
                          <MaterialIcons title = "service" name ='add-shopping-cart' color='#fff' size={screen.width/15.7} onPress={()=>props.navigation.navigate('EditService')} />
                  </View>
                  <Text style={styles.iconText}>{barber[0] && barber[0].lang?polylanfr.AddSerivce:polylanar.AddSerivce}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconContainer} onPress={()=>props.navigation.navigate('BarberWorkplace',{barberID:barberID})}>
                  <View style={styles.iconFormCircle2}>
                          <MaterialIcons title = "home" name ='home' color='#fff' size={screen.width/15.7} onPress={()=>props.navigation.navigate('BarberWorkplace',{barberID:barberID})} />
                  </View>
                  <Text style={styles.iconText}>{barber[0] && barber[0].lang?polylanfr.ComfortZone:polylanar.ComfortZone}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconContainer} onPress={()=>props.navigation.navigate('BarberGalery',{barberID:barberID})}>
                <View style={styles.iconFormCircle1}>
                        <MaterialIcons title = "portfolio" name ='linked-camera' color='#fff' size={screen.width/15.7} onPress={()=>props.navigation.navigate('BarberGalery',{barberID:barberID})} />
                </View>
                <Text style={styles.iconText}>{barber[0] && barber[0].lang?polylanfr.AddPortfolio:polylanar.AddPortfolio}</Text>
                </TouchableOpacity>
              </View>
           </View>
           <View style={styles.menu}>
              <TouchableOpacity style={{borderBottomWidth:screen.width/180,borderBottomColor:isServices ?'#fd6c57':'#f9f9f9',paddingBottom:screen.width/120}} onPress={services}>
               <Text style={styles.itemText}>{barber[0] && barber[0].lang?polylanfr.MyServices:polylanar.MyServices}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{borderBottomWidth:screen.width/180,borderBottomColor:isDisponible?'#fd6c57':'#f9f9f9',paddingBottom:screen.width/120}} onPress={disponibility}>
               <Text style={styles.itemText}>{barber[0] && barber[0].lang?polylanfr.Available:polylanar.Available}</Text>
              </TouchableOpacity>
           </View>
           <View>

           </View>
         </View>
        {isServices ?( <ScrollView style={{width:'100%'}} showsVerticalScrollIndicator={false}>
          {barber[0].services.map((service,index)=>
          <ServiceCart
            key={service.serviceId}
            number={index+1}
            source={service.typeOfService==='Tahfifa'?isImage.hair: service.typeOfService==='Barbe'?isImage.beard: service.typeOfService==='Soins'?isImage.care:service.typeOfService==='Mariage'?isImage.wedding:service.typeOfService==='Suppléments'?isImage.supp:service.typeOfService==='Coiffure'?isImage.womanHair:service.typeOfService==='Soins homme'?isImage.manCare:service.typeOfService==='Maquillage'?isImage.makeup:service.typeOfService==='Manucure'?isImage.manucure:service.typeOfService==='Pédicure'?isImage.pedicure:service.typeOfService==='Epilation'?isImage.epilation:undefined}
            name={service.name}
            type={service.typeOfService}
            minute={service.duration}
            price={service.price}
            dzdText={barber[0] && barber[0].lang?polylanfr.DZ:polylanar.DZ}
            onPressUpdate={()=>props.navigation.navigate('EditService',{idService:service.serviceId})}
            onPressDelete={deleteHandler.bind(this,service.serviceId)}
          />)}
         </ScrollView>):
         (<ScrollView style={{width:'100%'}} showsVerticalScrollIndicator={false}>
           <WorkTimeCart
             switchDay={switchSat}
             day={barber[0].lang?barber[0].workingTimes['Sam'].day:'السبت'}
             value={switchSat}
             onValueChange={()=>setSwitchSat(prevValue=>!prevValue)}
             onPress={()=>{ if(switchSat){showDatePicker();setSat({...sat,isOpenSat:true});setId('sat');} }}
             openDay={sat.isOpenSat}
             openTimeDay={sat.openTimeSat}
             onPress2={()=>{if(switchSat){showDatePicker();setSatClose({...satClose,isCloseSat:true});setId('satClose')}}}
             closeDay={satClose.isCloseSat}
             closeTimeDay={satClose.closeTimeSat}
           />
           <WorkTimeCart
             switchDay={switchSun}
             day={barber[0].lang?barber[0].workingTimes['Dim'].day:'الأحد'}
             value={switchSun}
             onValueChange={()=>setSwitchSun(prevValue=>!prevValue)}
             onPress={()=>{ if(switchSun){showDatePicker();setSun({...sun,isOpenSun:true});setId('sun');} }}
             openDay={sun.isOpenSun}
             openTimeDay={sun.openTimeSun}
             onPress2={()=>{if(switchSun){showDatePicker();setSunClose({...sunClose,isCloseSun:true});setId('sunClose')}}}
             closeDay={sunClose.isCloseSun}
             closeTimeDay={sunClose.closeTimeSun}
           />

           <WorkTimeCart
             switchDay={switchMon}
             day={barber[0].lang?barber[0].workingTimes['Lun'].day:'الإثنين'}
             value={switchMon}
             onValueChange={()=>setSwitchMon(prevValue=>!prevValue)}
             onPress={()=>{ if(switchMon){showDatePicker();setMon({...mon,isOpenMon:true});setId('mon');} }}
             openDay={mon.isOpenMon}
             openTimeDay={mon.openTimeMon}
             onPress2={()=>{if(switchMon){showDatePicker();setMonClose({...monClose,isCloseMon:true});setId('monClose')}}}
             closeDay={monClose.isCloseMon}
             closeTimeDay={monClose.closeTimeMon}
           />

            <WorkTimeCart
             switchDay={switchTue}
             day={barber[0].lang?barber[0].workingTimes['Mar'].day:'الثلاثاء'}
             value={switchTue}
             onValueChange={()=>setSwitchTue(prevValue=>!prevValue)}
             onPress={()=>{ if(switchTue){showDatePicker();setTue({...tue,isOpenTue:true});setId('tue');} }}
             openDay={tue.isOpenTue}
             openTimeDay={tue.openTimeTue}
             onPress2={()=>{if(switchTue){showDatePicker();setTueClose({...tueClose,isCloseTue:true});setId('tueClose')}}}
             closeDay={tueClose.isCloseTue}
             closeTimeDay={tueClose.closeTimeTue}
           />

          <WorkTimeCart
             switchDay={switchWed}
             day={barber[0].lang?barber[0].workingTimes['Mer'].day:'الأربعاء'}
             value={switchWed}
             onValueChange={()=>setSwitchWed(prevValue=>!prevValue)}
             onPress={()=>{ if(switchWed){showDatePicker();setWed({...wed,isOpenWed:true});setId('wed');} }}
             openDay={wed.isOpenWed}
             openTimeDay={wed.openTimeWed}
             onPress2={()=>{if(switchWed){showDatePicker();setWedClose({...wedClose,isCloseWed:true});setId('wedClose')}}}
             closeDay={wedClose.isCloseWed}
             closeTimeDay={wedClose.closeTimeWed}
           />

           <WorkTimeCart
             switchDay={switchThu}
             day={barber[0].lang?barber[0].workingTimes['Jeu'].day:'الخميس'}
             value={switchThu}
             onValueChange={()=>setSwitchThu(prevValue=>!prevValue)}
             onPress={()=>{ if(switchThu){showDatePicker();setThu({...thu,isOpenThu:true});setId('thu');} }}
             openDay={thu.isOpenThu}
             openTimeDay={thu.openTimeThu}
             onPress2={()=>{if(switchThu){showDatePicker();setThuClose({...thuClose,isCloseThu:true});setId('thuClose')}}}
             closeDay={thuClose.isCloseThu}
             closeTimeDay={thuClose.closeTimeThu}
           />

           <WorkTimeCart
             switchDay={switchFri}
             day={barber[0].lang?barber[0].workingTimes['Ven'].day:'الجمعة'}
             value={switchFri}
             onValueChange={()=>setSwitchFri(prevValue=>!prevValue)}
             onPress={()=>{ if(switchFri){showDatePicker();setFri({...fri,isOpenFri:true});setId('fri');} }}
             openDay={fri.isOpenFri}
             openTimeDay={fri.openTimeFri}
             onPress2={()=>{if(switchFri){showDatePicker();setFriClose({...friClose,isCloseFri:true});setId('friClose')}}}
             closeDay={friClose.isCloseFri}
             closeTimeDay={friClose.closeTimeFri}
           />

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
  const saveFunction=navData.navigation.getParam('save');
  const load=navData.navigation.getParam('load');
  const disponible=navData.navigation.getParam('disponible')
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
            width:screen.width/2.4,
            height:screen.width/9,
            resizeMode:'contain',
            alignSelf: 'center'}}
          
          />
        ),
        headerTintColor: '#fff',
        headerRight : () =>(load ? <ActivityIndicator color={Colors.primary} style={{marginRight:10}} />:
          <HeaderButtons HeaderButtonComponent = {HeaderButton}> 
            <Item title = {disponible?'Sauvegarder':' '} 
              iconName ={disponible?'md-checkmark':''}
              color='#fff'
              size={screen.width/32}   
              onPress={saveFunction}    
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
    height:'45%',
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
    width:screen.width/4,
    height:screen.width/4,
    borderRadius:screen.width/7.2,
    marginTop:-(screen.width/6.55),
    overflow:'hidden'
  },
  bname:{
    fontFamily:'poppins-bold',
    fontSize:screen.width/21.2,
    color:'#323446',
    paddingTop:screen.width/120
  },
  menu:{
    width:'90%',
    height:'30%',
    flexDirection:'row',
    justifyContent:'space-around',
    alignItems:'flex-end'
  },
  itemContainer:{
    borderBottomWidth:screen.width/180,
    borderBottomColor:'#fd6c57',
    paddingBottom:screen.width/120
  },
  itemText:{
    fontFamily:'poppins',
    color:'grey',
    fontSize:screen.width/30
  },
  iconFormCircle:{
    backgroundColor:'#FD6C57',
    width:screen.width/9,
    height:screen.width/9,
    borderRadius:screen.width/18,
    justifyContent:'center',
    alignItems:'center',
  },
  iconFormCircle1:{
    backgroundColor:'#BA55D3',
    width:screen.width/9,
    height:screen.width/9,
    borderRadius:screen.width/18,
    justifyContent:'center',
    alignItems:'center'
  },
  iconFormCircle2:{
    backgroundColor:'#FE457C',
    width:screen.width/9,
    height:screen.width/9,
    borderRadius:screen.width/18,
    justifyContent:'center',
    alignItems:'center'
  },
  
  iconsMenuContainer:{
    flexDirection:'row',
    paddingVertical:screen.width/72
  },
  iconContainer:{
    marginHorizontal:screen.width/27.7,
    alignItems:'center'
  },
  iconText:{
    fontFamily:'poppins',
    color:'grey',
    paddingTop:screen.width/120,
    fontSize:screen.width/36
  },
  activityIndicatorContainer:{
   flex:1,
   resizeMode:'cover',
   width:'100%',
   height:'100%',
   justifyContent:'center'
 },
 noServicesContainer:{
  width:'100%',
  height:'50%',
  justifyContent:'center'
  
},
noServicesText:{
  fontFamily:'poppins',
  fontSize:screen.width/25.71,
  color:Colors.blue
},
labelButton:{
  color:'#FFF',
  fontFamily:'poppins',
  fontSize:screen.width/22.5,
  textTransform:null,
 },
 buttonStyle:{
  borderColor:'#fd6c57',
  width:'50%',
  borderRadius:screen.width/18,
  height:screen.width/8,
  alignSelf:'center'
 },
 firstRow:{
  marginTop:screen.width/24,
  width:'90%',
  alignSelf:'center',
  justifyContent:'center'
},
question:{
  fontFamily:'poppins',
  color:Colors.blue,
  fontSize:screen.width/30,
  alignSelf:'flex-start'
},
optionsRow:{
   flexDirection:'row',
   width:'90%',
   height:screen.width/7.2,
   backgroundColor:'#f8f8f8',
   alignSelf:'center',
   marginTop:screen.width/18,
   borderRadius:screen.width/3.6,
   justifyContent:'space-between'
},
textOptionsRow:{
  flexDirection:'row',
   width:'85%',
   alignSelf:'center',
   borderRadius:screen.width/3.6,
   justifyContent:'space-between',
   marginBottom:screen.width/36,
   marginTop:screen.width/120
},
buttonView:{
  marginTop:screen.width/36
}
});

export default BarberServiceScreen;