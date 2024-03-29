import {CREATE_BARBER,SET_BARBERS,SET_BARBER,UPDATE_BARBER_PASSWORD,UPDATE_BARBER,DELETE_BARBER,UPDATE_BARBER_PHONE,UPDATE_BARBER_LANG,UPDATE_BARBER_WORKPLACE,UPDATE_BARBER_ADDRESS} from '../actions/barberActions';
import Barber from '../../models/barber';

const initialState={
    barbers:[],
    barber:[]
};

const barbersReducer=(state=initialState,action)=>{
   //console.log(action.type);
   switch(action.type){
       case CREATE_BARBER:
         const newBarber= new Barber(action.barberData.id,action.barberData.phone,action.barberData.password,
                                   action.barberData.sex,null,null,null,null,null,null,action.barberData.wilaya,
                                   action.barberData.region,null,null,null,2.5,true,"Barber","cli",[],{});
         return{
           ...state,
           barbers: state.barbers.concat(newBarber)
         };

      case SET_BARBERS:
      return{
        ...state,
        barbers:action.allBarbers
      };

      case SET_BARBER:
      return{
        ...state,
        barber:action.barberData
      }; 

      case UPDATE_BARBER:
         
        const barberindex= state.barber.findIndex(barber => barber.id === action.id);
        
        const updatedBarberData= new Barber(
          action.id,
          state.barber[barberindex].phone,
          state.barber[barberindex].password,
          state.barber[barberindex].sex,
          action.barberData.name,
          action.barberData.surname,
          action.barberData.b_name,
          action.barberData.age,
          action.barberData.email,
          action.barberData.address,
          action.barberData.wilaya,
          action.barberData.region,
          state.barber[barberindex].image,
          state.barber[barberindex].long,
          state.barber[barberindex].lat,
          state.barber[barberindex].mark,
          state.barber[barberindex].lang,
          state.barber[barberindex].type,
          state.barber[barberindex].workplace,
          state.barber[barberindex].services,
          state.barber[barberindex].workingTimes
        );
        const updatedBarbersData=[...state.barber];
        updatedBarbersData[barberindex]= updatedBarberData;
        return{
          ...state,
          barber:updatedBarbersData
        };

      case DELETE_BARBER:
        return{
          ...state,
          barbers:state.barbers.filter(barber=>barber.id != action.id),
          barber:state.barber.filter(barber=>barber.id != action.id)
        };  

      case UPDATE_BARBER_PASSWORD:
         
        const barberIndex = state.barber.findIndex(barber => barber.id === action.id);
        
        const updatedBarber = new Barber(
          action.id,
          state.barber[barberIndex].phone,
          action.barberData.password,
          state.barber[barberIndex].sex,
          state.barber[barberIndex].name,
          state.barber[barberIndex].surname,
          state.barber[barberIndex].b_name,
          state.barber[barberIndex].age,
          state.barber[barberIndex].email,
          state.barber[barberIndex].address,
          state.barber[barberIndex].wilaya,
          state.barber[barberIndex].region,
          state.barber[barberIndex].image,
          state.barber[barberIndex].long,
          state.barber[barberIndex].lat,
          state.barber[barberIndex].mark,
          state.barber[barberIndex].lang,
          state.barber[barberIndex].type,
          state.barber[barberIndex].workplace,
          state.barber[barberIndex].services,
          state.barber[barberIndex].workingTimes
        );   

        const updatedBarbers=[...state.barber];
        updatedBarbers[barberIndex]=updatedBarber;
        return{
          ...state,
          barber:updatedBarbers
        };

        case UPDATE_BARBER_LANG:
         
        const barberIndexLang = state.barber.findIndex(barber => barber.id === action.id);
        
        const updatedBarberLang = new Barber(
          action.id,
          state.barber[barberIndexLang].phone,
          state.barber[barberIndexLang].password,
          state.barber[barberIndexLang].sex,
          state.barber[barberIndexLang].name,
          state.barber[barberIndexLang].surname,
          state.barber[barberIndexLang].b_name,
          state.barber[barberIndexLang].age,
          state.barber[barberIndexLang].email,
          state.barber[barberIndexLang].address,
          state.barber[barberIndexLang].wilaya,
          state.barber[barberIndexLang].region,
          state.barber[barberIndexLang].image,
          state.barber[barberIndexLang].long,
          state.barber[barberIndexLang].lat,
          state.barber[barberIndexLang].mark,
          action.barberData.lang,
          state.barber[barberIndexLang].type,
          state.barber[barberIndexLang].workplace,
          state.barber[barberIndexLang].services,
          state.barber[barberIndexLang].workingTimes
        );   

        const updatedBarbersLang=[...state.barber];
        updatedBarbersLang[barberIndexLang]=updatedBarberLang;
        return{
          ...state,
          barber:updatedBarbersLang
        };


       
        case UPDATE_BARBER_PHONE:
          const indexBarber = state.barber.findIndex(barber => barber.id === action.barberid);
       
          const updatedBarberPhone = new Barber(
            action.barberData.id,
            action.barberData.phone,
            state.barber[indexBarber].password,
            state.barber[indexBarber].sex,
            state.barber[indexBarber].name,
            state.barber[indexBarber].surname,
            state.barber[indexBarber].b_name,
            state.barber[indexBarber].age,
            state.barber[indexBarber].email,
            state.barber[indexBarber].address,
            state.barber[indexBarber].wilaya,
            state.barber[indexBarber].region,
            state.barber[indexBarber].image,
            state.barber[indexBarber].long,
            state.barber[indexBarber].lat,
            state.barber[indexBarber].mark,
            state.barber[indexBarber].lang,
            state.barber[indexBarber].type,
            state.barber[indexBarber].workplace,
            state.barber[indexBarber].services,
            state.barber[indexBarber].workingTimes
          );   

          const updatedThisBarber=[...state.barber];
          updatedThisBarber[indexBarber]=updatedBarberPhone;
          return{
            ...state,
            barber:updatedThisBarber
          };

          case UPDATE_BARBER_WORKPLACE:
          
          const indexBarberFind = state.barber.findIndex(barber => barber.id === action.id);
      
          const updatedBarberWorkplace = new Barber(
            action.id,
            state.barber[indexBarberFind].phone,
            state.barber[indexBarberFind].password,
            state.barber[indexBarberFind].sex,
            state.barber[indexBarberFind].name,
            state.barber[indexBarberFind].surname,
            state.barber[indexBarberFind].b_name,
            state.barber[indexBarberFind].age,
            state.barber[indexBarberFind].email,
            state.barber[indexBarberFind].address,
            state.barber[indexBarberFind].wilaya,
            state.barber[indexBarberFind].region,
            state.barber[indexBarberFind].image,
            state.barber[indexBarberFind].long,
            state.barber[indexBarberFind].lat,
            state.barber[indexBarberFind].mark,
            state.barber[indexBarberFind].lang,
            state.barber[indexBarberFind].type,
            action.barberData.workplace,
            state.barber[indexBarberFind].services,
            state.barber[indexBarberFind].workingTimes,
            
          );   

          const updatedCurrentBarber=[...state.barber];
          updatedCurrentBarber[indexBarberFind]=updatedBarberWorkplace;
          return{
            state,
            barber:updatedCurrentBarber
          };

          case UPDATE_BARBER_ADDRESS:
          
          const indexBarberSearch = state.barber.findIndex(barber => barber.id === action.id);
      
          const updatedBarberAddress = new Barber(
            action.id,
            state.barber[indexBarberSearch].phone,
            state.barber[indexBarberSearch].password,
            state.barber[indexBarberSearch].sex,
            state.barber[indexBarberSearch].name,
            state.barber[indexBarberSearch].surname,
            state.barber[indexBarberSearch].b_name,
            state.barber[indexBarberSearch].age,
            state.barber[indexBarberSearch].email,
            action.barberData.address,
            state.barber[indexBarberSearch].wilaya,
            state.barber[indexBarberSearch].region,
            state.barber[indexBarberSearch].image,
            state.barber[indexBarberSearch].long,
            state.barber[indexBarberSearch].lat,
            state.barber[indexBarberSearch].mark,
            state.barber[indexBarberSearch].lang,
            state.barber[indexBarberSearch].type,
            state.barber[indexBarberSearch].workplace,
            state.barber[indexBarberSearch].services,
            state.barber[indexBarberSearch].workingTimes,
            
          );   

          const updatedOneBarber=[...state.barber];
          updatedOneBarber[indexBarberSearch]=updatedBarberAddress;
          return{
            state,
            barber:updatedOneBarber
          };

          
        
       
       default: 
        return state;
   }



};

export default barbersReducer;