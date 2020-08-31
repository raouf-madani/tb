export const AUTHENTICATE = "AUTHENTICATE";
export const LOGOUT ="LOGOUT";
import Firebase from "../../helpers/Firebaseconfig";
import {AsyncStorage} from 'react-native';

export const authenticate = (token,userID,expiryTime)=>{

    return{
        type:AUTHENTICATE,
        token:token,
        userID:userID,
        expiryTime,
        
    };

};

export const logout=()=>{
    return{
        type:LOGOUT
    };
};

const saveDataToStorage = (expiresIn,refreshToken) => {

    AsyncStorage.setItem('userTokenData',
                          JSON.stringify({
                            expiresIn:expiresIn	,
                          refreshToken:refreshToken
                         }) 
                         );
          };

export const refreshTokenStepOne = (token)=>{
   
    return async ()=>{
        try{
            const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${Firebase.apiKey}`,{


              method:'POST',
              headers: {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({token,returnSecureToken:true})
           });
           if(!response.ok){
               throw new Error('Oups! Une erreur est survenue refeshtoken.');
           }
           const resData = await response.json();
           
           saveDataToStorage(resData.expiresIn,resData.refreshToken);
           
        }catch(err){
            
        }
    }
}

/*export const refreshTokenStepTwo = (refresh_token)=>{

    return async ()=>{
        try{
            const response = await fetch(`https://securetoken.googleapis.com/v1/token?key=${Firebase.apiKey}`,{


              method:'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body : JSON.stringify({grant_type:'refresh_token',refresh_token})
           });
           if(!response.ok){
               throw new Error('Oups! Une erreur est survenue Firebase.');
           }


        }catch(err){
            throw err;
        }
    }
}
*/

export const updateUserPhoneFRB= (phoneNumber,uid) => {

    return async () => {

         try{



           const response = await fetch(`http://173.212.234.137:3000/phoneUpdate/${uid}`,{


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
             throw err;
         }
    };

};

export const deleteUser = uid => {

    return async () => {
    
        try{



            const response = await fetch(`http://173.212.234.137:3000/userDelete/${uid}`,{

               method:'DELETE'});

            if(!response.ok){
                throw new Error('Oups! Une erreur est survenue.');
            }

            
          }catch(err){
              console.log(err);
              throw err;
          }
 
    };
};

