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
                                   action.barberData.region,null,null,null,1,false,'Barber');
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
         
        const barberindex= state.barber.findIndex(barber => barber.barber_id === action.id);
        
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
          action.barberData.long,
          action.barberData.lat,
          state.barber[barberindex].mark,
          action.barberData.lang,
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
         
        const barberIndex = state.barbers.findIndex(barber => barber.barber_id === action.id);
        const updatedBarber = new Barber(
          action.id,
          state.barbers[barberIndex].phone,
          action.barberData.password,
          state.barbers[barberIndex].sex,
          state.barbers[barberIndex].name,
          state.barbers[barberIndex].surname,
          state.barbers[barberIndex].b_name,
          state.barbers[barberIndex].age,
          state.barbers[barberIndex].email,
          state.barbers[barberIndex].address,
          state.barbers[barberIndex].wilaya,
          state.barbers[barberIndex].region,
          state.barbers[barberIndex].image,
          state.barbers[barberIndex].long,
          state.barbers[barberIndex].lat,
          state.barber[barberindex].mark,
          state.barbers[barberIndex].lang,
          state.barbers[barberIndex].type,
        );   

        const updatedBarbers=[...state.barbers];
        updatedBarbers[barberIndex]=updatedBarber;
        return{
          ...state,
          barbers:updatedBarbers
        };

        case UPDATE_BARBER_PHONE:
          const indexBarber = state.barbers.findIndex(barber => barber.barber_id === action.barberid);
         
          const updatedBarberPhone = new Barber(
            action.barberData.id,
            action.barberData.phone,
            state.barbers[indexBarber].password,
            state.barbers[indexBarber].sex,
            state.barbers[indexBarber].name,
            state.barbers[indexBarber].surname,
            state.barbers[indexBarber].b_name,
            state.barbers[indexBarber].age,
            state.barbers[indexBarber].email,
            state.barbers[indexBarber].address,
            state.barbers[indexBarber].wilaya,
            state.barbers[indexBarber].region,
            state.barbers[indexBarber].image,
            state.barbers[indexBarber].long,
            state.barbers[indexBarber].lat,
            state.barber[barberindex].mark,
            state.barbers[indexBarber].lang,
            state.barbers[indexBarber].type,
          );   

          const updatedAllBarbers=[...state.barbers];
          updatedAllBarbers[indexBarber]=updatedBarberPhone;
          return{
            ...state,
            barbers:updatedAllBarbers
          };
        
       
       default: 
        return state;
   }



};

export default barbersReducer;