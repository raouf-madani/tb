export const CREATE_SERVICE = "CREATE_SERVICE";
export const UPDATE_SERVICE = "UPDATE_SERVICE";
export const DELETE_SERVICE = "DELETE_SERVICE";

export const createService=(name,price,duration,barber_id,typeOfService)=>{
  
    return async () =>{
        const serviceData={name,price,duration,barber_id,typeOfService};
       
        try{
            const response= await fetch('http://173.212.234.137:3000/service/addService',{
                method : "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body : JSON.stringify(serviceData)
            } 
            );
            if(!response.ok){
                throw new Error('Oups! Une erreur est survenue haha.');
            }
           
        }catch(err){
            console.log(err);
            throw err;
        } 

    };

};

export const updateService= (id,name,price,duration,typeOfService) => {

    return async () => {

         try{
           
           const response = await fetch(`http://173.212.234.137:3000/service/updateService/${id}`,{
              method:'PATCH',
              headers: {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({name,price,duration,typeOfService})
           });
           
           if(!response.ok){
               throw new Error('Oups! Une erreur est survenue.');
           }
           
          
           
         }catch(err){
             console.log(err);
             throw err;
         }
    };

};

export const deleteService = id => {

    return async () => {
    
        try{
            const response = await fetch(`http://173.212.234.137:3000/service/deleteService/${id}`,{
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