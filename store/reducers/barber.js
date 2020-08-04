import {CREATE_BARBER,SET_BARBERS,SET_BARBER,UPDATE_BARBER_PASSWORD,UPDATE_BARBER,DELETE_BARBER,UPDATE_BARBER_PHONE} from '../actions/barberActions';
import Barber from '../../models/barber';

const initialState={
    barbers:[],
    barber:[]
};

const barbersReducer=(state=initialState,action)=>{
   console.log(action.type);
   switch(action.type){
       case CREATE_BARBER:
         const newBarber= new Barber(action.barberData.id,action.barberData.phone,action.barberData.password,
                                   action.barberData.sex,null,null,null,null,null,null,action.barberData.wilaya,
                                   action.barberData.region,null,null,null,null,true,'Barber');
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
          action.barberData.image,
          state.barber[barberindex].long,
          state.barber[barberindex].lat,
          state.barber[barberindex].mark,
          state.barber[barberindex].lang,
          state.barber[barberindex].type
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
        );   

        const updatedBarbers=[...state.barber];
        updatedBarbers[barberIndex]=updatedBarber;
        return{
          ...state,
          barber:updatedBarbers
        };

       
        case UPDATE_BARBER_PHONE:
          const indexBarber = state.barber.findIndex(barber => barber.id === action.barberid);
          console.log('barberIndex '+indexBarber);
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
          );   

          const updatedThisBarber=[...state.barber];
          updatedThisBarber[indexBarber]=updatedBarberPhone;
          return{
            ...state,
            barber:updatedThisBarber
          };
        
       
       default: 
        return state;
   }



};

export default barbersReducer;