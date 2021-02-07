import moment from "moment";


export const GET_BOOKING = "GET_BOOKING"; 
export const CANCEL_BOOKING = "CANCEL_BOOKING";
export const EXPIRED_BOOKING = "EXPIRED_BOOKING";







export const getBarberBookings = (barberId)=>{

  return async (dispatch) =>{
      try {
     

      const arr = await fetch(`http://95.111.243.233:3000/barberBookings/${barberId}`);

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
            address : same[0].address,
            amount : same[0].amount,
            barberId : same[0].barberId,
            bookingDate : same[0].bookingDate,
            bookingDuration : same[0].bookingDuration,
            clientId : same[0].clientId,
            date : same[0].date,
            end : same[0].end,
            id : same[0].id,
            region : same[0].region,
            services:[],
            start :same[0].start ,
            status : same[0].status,
            wilaya : same[0].wilaya
           
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





export const changeBookingState = (id,type)=> {

 
    return async (dispatch) =>{
        try {
            const response = await fetch(

                `http://95.111.243.233:3000/bookings/changebooking`,

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

// export const expiredbookings = (clientId)=> {

//   return async (dispatch) =>{
// try {
 

//   const response = await fetch(

//       `http://95.111.243.233:3000/bookings/expiredbookings`,

//       {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//       body : JSON.stringify({clientId : clientId})
//       }
      
      
//     );

//     if (!response.ok) {
//       throw new Error('Something went wrong!');
//     }

// //     const resData = await response.json;

// //  if(expired.length > 0 )
// // {


// // dispatch({type:EXPIRED_BOOKING,expiredBookings:expired})
// // }
   

// } catch (error) {
//   throw error ;

          
// }

// }

// }

///////////////////////////////////////////////////////////////////////////////////////////////
//Expired Bookings with GET

//Expired Bookings 

export const expiredbookings = (barberId,tokens)=> {

  return async (dispatch) =>{
try {
 

  const arr = await fetch(`http://95.111.243.233:3000/barber/getbookings/expired/${barberId}`);
  const resData = await arr.json ();

              if(resData.length > 0) {
                const allMessages = [];

                tokens.map(e=>{
                
                allMessages.push(
                  {
                    to: e.expoToken,
                    sound: 'default',
                    title: 'Expirée',
                    body: 'Vous avez une réservation qui a expirée !',
                    data: { data: 'goes here' ,title: 'Vous avez une réservation qui a expirée !u',
                    body: 'Vous avez une réservation qui a expirée !',},
                  }
                
                )
                
                })
              
                allMessages.map(async (e)=>{
                  await fetch('https://exp.host/--/api/v2/push/send', {
                    method: 'POST',
                    headers: {
                      Accept: 'application/json',
                      'Accept-encoding': 'gzip, deflate',
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(e),
                  });
                
                
                })
                
              }

    // if (!response.ok) {
    //   throw new Error('Something went wrong!');
    // }
    // else {
     
    

    // }

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