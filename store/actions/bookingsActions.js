import moment from "moment";


export const GET_BOOKING = "GET_BOOKING"; 
export const CANCEL_BOOKING = "CANCEL_BOOKING";
export const EXPIRED_BOOKING = "EXPIRED_BOOKING";







export const getBarberBookings = (barberId)=>{

  return async (dispatch) =>{
      try {
     

      const arr = await fetch(`http://173.212.234.137:3000/barberBookings/${barberId}`);

      const resData = await arr.json ();
      
const bookingsIds = [];
const clientbookings = [];


resData.forEach(e => {
      if(bookingsIds.indexOf(e.id)<0) {
        bookingsIds.push(e.id);
      }
});

let allBookings = [];

bookingsIds.forEach( id => {

let same = resData.filter(e=>e.id === id);

    let booking = {
            amount : same[0].amount,
            barberId : same[0].barberId,
            bookingDate : same[0].bookingDate,
            bookingDuration : same[0].bookingDuration,
            clientId : same[0].clientId,
            date : same[0].date,
            end : same[0].end,
            id : same[0].id,
            services:[],
            start :same[0].start ,
            status : same[0].status,
           
    }
    same.forEach(e=>{
          const service = {
                name : e.name,
                price : e.price,
                serviceDuration : e.serviceDuration
          }

        booking.services.push(service);
    });
      allBookings.push(booking);
      });



 dispatch({type:GET_BOOKING,bookings:allBookings})
  } catch (error) {
    throw error ;
          
  
  }
 

} }





export const cancelBooking = (id,type)=> {

 
    return async (dispatch) =>{
        try {
            const response = await fetch(

                `http://173.212.234.137:3000/bookings/changebooking`,

                {
                  method: 'PATCH',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                body : JSON.stringify({id,type})
                }
                
                
              );
           
              if (!response.ok) {
                throw new Error('Something went wrong!');
              }
  

    } catch (error) {
      throw error ;
            
    
    }
   
  
  }
  
  
  
  }

///////////////////////////////////////////////////////////////////////////////////////////////
//Expired Bookings 

export const expiredbookings = (clientId)=> {

  return async (dispatch) =>{
try {
 

  const response = await fetch(

      `http://173.212.234.137:3000/bookings/expiredbookings`,

      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
      body : JSON.stringify({clientId : clientId})
      }
      
      
    );

    if (!response.ok) {
      throw new Error('Something went wrong!');
    }

//     const resData = await response.json;

//  if(expired.length > 0 )
// {


// dispatch({type:EXPIRED_BOOKING,expiredBookings:expired})
// }
   

} catch (error) {
  throw error ;

          
}

}

}