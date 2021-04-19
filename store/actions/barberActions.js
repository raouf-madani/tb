export const CREATE_BARBER= "CREATE_BARBER";
export const SET_BARBERS= "SET_BARBERS";
export const SET_BARBER= "SET_BARBER";
export const UPDATE_BARBER_PASSWORD ="UPDATE_BARBER_PASSWORD";
export const UPDATE_BARBER_PHONE = "UPDATE_BARBER_PHONE";
export const UPDATE_BARBER = "UPDATE_BARBER";
export const DELETE_BARBER = "DELETE_BARBER";
export const UPDATE_BARBER_LANG = "UPDATE_BARBER_LANG";
export const UPDATE_BARBER_WORKPLACE = "UPDATE_BARBER_WORKPLACE";

export const createBarber=(id,phone,password,sex,wilaya,region,workplace)=>{
  
    return async dispatch =>{
        const barberData={id,phone,password,sex,wilaya,region,workplace};

        try{

            const response= await fetch('http://95.111.243.233:3000/barber/addBarber',{

                method : "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body : JSON.stringify(barberData)
            } 
            );
            if(!response.ok){
                throw new Error('Oups! Une erreur est survenue.');
            }
            
            dispatch({type:CREATE_BARBER,barberData});
            
        }catch(err){
            console.log(err);
            throw err;
        } 

    }
      

};

export const setBarbers= ()=>{

    return async dispatch =>{

      try{

           const response= await fetch('http://95.111.243.233:3000/barber');

           if(!response.ok){
            throw new Error('Oups! Une erreur est survenue.');
            }

           const resData= await response.json();
           
           dispatch({type:SET_BARBERS,allBarbers:resData});
           
      }catch(err){
          console.log(err);
          throw err;
      }

    };

};

export const setBarber= id => {
    return async dispatch=>{
        try{
          
            const response= await fetch(`http://95.111.243.233:3000/barber/${id}`);

            if(!response.ok){
             throw new Error('Oups! Une erreur est survenue.');
             }
 
            const resData= await response.json();
           
                
            dispatch({type:SET_BARBER,barberData:resData});
           
       }catch(err){
           console.log(err);
           throw err;
       }

    };

};

export const updateBarberPassword= (id,password) => {

    return async dispatch => {

         try{

           const response = await fetch(`http://95.111.243.233:3000/barber/updatePassword/${id}`,{

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
             throw err;
         }
    };

};

export const updateBarberWorkplace= (id,workplace) => {

    return async dispatch => {

         try{

           const response = await fetch(`http://95.111.243.233:3000/barber/updateWorkplace/${id}`,{

              method:'PATCH',
              headers: {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({workplace})
           });
           if(!response.ok){
               throw new Error('Oups! Une erreur est survenue.');
           }
          
       dispatch({type:UPDATE_BARBER_WORKPLACE,id,barberData:{workplace}});
           
         }catch(err){
            console.log('finisssssssssssssssssssssssssssssssssssssssss');
             console.log(err);
             throw err;
         }
    };

};

export const updateBarberLang= (id,lang) => {

    return async dispatch => {
           
         try{

           const response = await fetch(`http://95.111.243.233:3000/barber/updateLang/${id}`,{

              method:'PATCH',
              headers: {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({lang})
           });
           if(!response.ok){
               throw new Error('Oups! Une erreur est survenue in ur fetch.');
           }
           
           dispatch({type:UPDATE_BARBER_LANG,id,barberData:{lang}});
          
         }catch(err){
             console.log(err);
             throw err;
         }
    };

};

export const updateBarberImage= (id,imgsource,image) => {

    return async () => {

        const barberImageData={imgsource,image};
           console.log(imgsource,image);
         try{

           const response = await fetch(`http://95.111.243.233:3000/barber/profileimage/${id}`,{

              method:'PATCH',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body : JSON.stringify(barberImageData)
        } 
        );
        if(!response.ok){
            throw new Error('Oups! Une erreur est survenue.');
        }

          
          
         }catch(err){
             console.log(err);
             throw err;
         }
    };

};

export const updateBarberPhone= (id,phone,barberid) => {

    return async dispatch => {

         try{

           const response = await fetch(`http://95.111.243.233:3000/barber/updatePhone/${barberid}`,{

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
             throw err;
         }
    };

};



export const updateBarber= (id,name,surname,b_name,age,email,address,wilaya,region) => {

    return async dispatch => {

         try{
           
           const response = await fetch(`http://95.111.243.233:3000/barber/updateBarber/${id}`,{

              method:'PATCH',
              headers: {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({name,surname,b_name,age,email,address,wilaya,region})
           });
           
           if(!response.ok){
               throw new Error('Oups! Une erreur est survenue.');
           }
          
           dispatch({type:UPDATE_BARBER,id,barberData:{name,surname,b_name,age,email,address,wilaya,region}});
           
         }catch(err){
             console.log(err);
             throw err;
         }
    };

};

export const deleteBarber = id => {

    return async dispatch => {
    
        try{

            const response = await fetch(`http://95.111.243.233:3000/barber/deleteBarber/${id}`,{

               method:'DELETE'});

            if(!response.ok){
                throw new Error('Oups! Une erreur est survenue.');
            }
            
            dispatch({type:DELETE_BARBER,id});
            
          }catch(err){
              console.log(err);
              throw err;
          }
 
    };
};
