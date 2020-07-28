export const CREATE_BARBER= "CREATE_BARBER";
export const SET_BARBERS= "SET_BARBERS";
export const SET_BARBER= "SET_BARBER";
export const UPDATE_BARBER_PASSWORD ="UPDATE_BARBER_PASSWORD";
export const UPDATE_BARBER_PHONE = "UPDATE_BARBER_PHONE";
export const UPDATE_BARBER = "UPDATE_BARBER";
export const DELETE_BARBER = "DELETE_BARBER";


export const createBarber=(id,phone,password,sex,wilaya,region)=>{
  
    return async dispatch =>{
        const barberData={id,phone,password,sex,wilaya,region};

        try{
            const response= await fetch('http://192.168.1.34:3000/barber/addBarber',{
                method : "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body : JSON.stringify(barberData)
            } 
            );
            if(!response.ok){
                throw new Error('Oups! Une erreur est survenue haha.');
            }
            console.log('debutAction');
            dispatch({type:CREATE_BARBER,barberData});
            console.log('endAction');
        }catch(err){
            console.log(err);
        } 

    }
      

};

export const setBarbers= ()=>{

    return async dispatch =>{

      try{
           const response= await fetch('http://192.168.1.34:3000/barber');
           if(!response.ok){
            throw new Error('Oups! Une erreur est survenue.');
            }

           const resData= await response.json();
           
           dispatch({type:SET_BARBERS,allBarbers:resData});
           
      }catch(err){
          console.log(err);
      }

    };

};

export const setBarber= id => {
    return async dispatch=>{
        try{
            const response= await fetch(`http://192.168.1.34:3000/barber/${id}`);
            if(!response.ok){
             throw new Error('Oups! Une erreur est survenue.');
             }
 
            const resData= await response.json();
        
            dispatch({type:SET_BARBER,barberData:resData});
      
       }catch(err){
           console.log(err);
       }

    };

};

export const updateBarberPassword= (id,password) => {

    return async dispatch => {

         try{
           const response = await fetch(`http://192.168.1.34:3000/barber/updatePassword/${id}`,{
              method:'PATCH',
              headers: {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({password})
           });
           if(!response.ok){
               throw new Error('Oups! Une erreur est survenue in ur fetch.');
           }
           
           dispatch({type:UPDATE_BARBER_PASSWORD,id,barberData:{password}});
          
         }catch(err){
             console.log(err);
         }
    };

};

export const updateBarberPhone= (id,phone,barberid) => {

    return async dispatch => {

         try{
           const response = await fetch(`http://192.168.1.34:3000/barber/updatePhone/${barberid}`,{
              method:'PATCH',
              headers: {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({id,phone})
           });
           if(!response.ok){
               throw new Error('Oups! Une erreur est survenue.');
           }
           
           dispatch({type:UPDATE_BARBER_PHONE,barberid,barberData:{id,phone}});
           
         }catch(err){
             console.log(err);
         }
    };

};


export const updateBarber= (id,name,surname,b_name,age,email,address,wilaya,region,image,lang) => {

    return async dispatch => {

         try{
           const response = await fetch(`http://192.168.1.34:3000/barber/updateBarber/${id}`,{
              method:'PATCH',
              headers: {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({name,surname,b_name,age,email,address,wilaya,region,image,lang})
           });
           if(!response.ok){
               throw new Error('Oups! Une erreur est survenue.');
           }
           
           dispatch({type:UPDATE_BARBER,id,barberData:{name,surname,b_name,age,email,address,wilaya,region,image,lang}});
           
         }catch(err){
             console.log(err);
         }
    };

};

export const deleteBarber = id => {

    return async dispatch => {
    
        try{
            const response = await fetch(`http://192.168.1.34:3000/barber/deleteBarber/${id}`,{
               method:'DELETE'});

            if(!response.ok){
                throw new Error('Oups! Une erreur est survenue.');
            }
            
            dispatch({type:DELETE_BARBER,id});
            
          }catch(err){
              console.log(err);
          }
 
    };
};
