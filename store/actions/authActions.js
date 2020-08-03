export const AUTHENTICATE = "AUTHENTICATE";
export const LOGOUT ="LOGOUT";
export const UPDATE_USER_PHONE_FRB="UPDATE_USER_PHONE_FRB";
export const DELETE_USER_FRB="DELETE_USER_FRB";

export const authenticate = (token,userID,expiryTime)=>{

    return{
        type:AUTHENTICATE,
        token:token,
        userID:userID
    };

};

export const logout=()=>{
    return{
        type:LOGOUT
    };
};


export const updateUserPhoneFRB= (phoneNumber,uid) => {

    return async () => {

         try{
           const response = await fetch(`http://192.168.1.5:3000/phoneUpdate/${uid}`,{
              method:'PATCH',
              headers: {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({phoneNumber})
           });
           if(!response.ok){
               throw new Error('Oups! Une erreur est survenue Firebase.');
           }
           
           
           
         }catch(err){
             console.log(err);
         }
    };

};

export const deleteUser = uid => {

    return async () => {
    
        try{
            const response = await fetch(`http://192.168.1.5:3000/userDelete/${uid}`,{
               method:'DELETE'});

            if(!response.ok){
                throw new Error('Oups! Une erreur est survenue.');
            }

            
          }catch(err){
              console.log(err);
          }
 
    };
};