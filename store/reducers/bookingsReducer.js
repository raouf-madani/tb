import { ADD_BOOKING, GET_BOOKING ,CANCEL_BOOKING,EXPIRED_BOOKING } from "../actions/bookingsActions";


const initialState = {
    bookings :[],
  
};


const bookingReducer=(state=initialState,action)=>{
        switch(action.type) {
         case ADD_BOOKING : 
         
         const temp = [];
         temp.push(action.booking);
         return {...state , bookings : [...state.bookings,...temp]};

         case GET_BOOKING : 
         return {...state ,bookings : action.bookings};
        
         case CANCEL_BOOKING :
            
            const bookingIndex = state.bookings.findIndex(
                book => book.date === action.bookingDate && book.clientId === action.clientId
              );
              const booking = {
                amount: state.bookings[bookingIndex].amount,
                barberId : state.bookings[bookingIndex].barberId ,
                bookingDate: state.bookings[bookingIndex].bookingDate,
                bookingDuration: state.bookings[bookingIndex].bookingDuration,
                clientId : state.bookings[bookingIndex].clientId ,
                date: state.bookings[bookingIndex].date,
                end: state.bookings[bookingIndex].end,
                services:state.bookings[bookingIndex].services,
                start: state.bookings[bookingIndex].start,
                status: "annulée",
        
            };
            const updatedBookings = [...state.bookings];
            updatedBookings[bookingIndex] = booking;
            return {
                ...state ,
                bookings : updatedBookings
             };


            default : return state ;
        }



}





export default bookingReducer;