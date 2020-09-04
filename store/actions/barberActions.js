export const CREATE_BARBER= "CREATE_BARBER";
export const SET_BARBERS= "SET_BARBERS";
export const SET_BARBER= "SET_BARBER";
export const UPDATE_BARBER_PASSWORD ="UPDATE_BARBER_PASSWORD";
export const UPDATE_BARBER_PHONE = "UPDATE_BARBER_PHONE";
export const UPDATE_BARBER = "UPDATE_BARBER";
export const DELETE_BARBER = "DELETE_BARBER";
export const UPDATE_BARBER_LANG = "UPDATE_BARBER_LANG";

export const createBarber=(id,phone,password,sex,wilaya,region)=>{
  
    return async dispatch =>{
        const barberData={id,phone,password,sex,wilaya,region};

        try{

            const response= await fetch('http://173.212.234.137:3000/barber/addBarber',{

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

           const response= await fetch('http://173.212.234.137:3000/barber');

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

            const response= await fetch(`http://173.212.234.137:3000/barber/${id}`);

            if(!response.ok){
             throw new Error('Oups! Une erreur est survenue.');
             }
 
            const resData= await response.json();
            
            const barbersIDS = [];
            resData.forEach(e => {
                if(barbersIDS.indexOf(e.barberid)<0) {
                    barbersIDS.push(e.barberid);
                }
            });
              
            let allBarbers = [];
            
            barbersIDS.forEach( id => {
             
            let same = resData.filter(e=>e.barberid === id);
            
           
            let barber = {
                    id : same[0].barberid,
                    phone : same[0].phone,
                    password : same[0].password,
                    sex : same[0].sex,
                    name : same[0].barberName,
                    surname : same[0].surname,
                    b_name : same[0].b_name,
                    age:same[0].age,
                    email :same[0].email,
                    address : same[0].address,
                    image : same[0].image,
                    mark : same[0].mark,
                    wilaya : same[0].wilaya,
                    region : same[0].region,
                    lang : same[0].lang,
                    type : same[0].type,
                    services:[],
                    workingTimes:{}
                }
                const servicesIDS=[];
                same.forEach((e)=>{
                    
                    const workingTime={
                    
                        workingTimeID:e.workingTimeID,
                        day:e.day,
                        debut:e.debut,
                        finish:e.finish,
                        isworking:e.isworking,
                        theBarberID:e.barber_id
                    
                };
                    barber.workingTimes[e.day]=workingTime;
                    
                   
                    
                    if(e.id!==null && e.name!==null && e.price!==null && e.duration!==null && e.barber_id!==null && e.durationHours!==0 && e.durationMinutes!==0){
                       
                        const hours = (e.duration / 60);
                        const durationHours = Math.floor(hours);
                        const minutes = (hours - durationHours) * 60;
                        const durationMinutes = Math.round(minutes);
                       
                        const service = {
                            serviceId:e.id,
                            name : e.name,
                            price : e.price,
                            duration : e.duration,
                            barberID:e.barber_id,
                            durationHour:durationHours,
                            durationMinute:durationMinutes
                    }

                    

                    if(!servicesIDS.includes(e.id)){
                        barber.services.push(service);
                        servicesIDS.push(e.id);
                        console.log(servicesIDS);
                    }

                    
                    
                    
                    }else{
                        return;
                    }


                    
                    
                });
                allBarbers.push(barber);
                });
                
            dispatch({type:SET_BARBER,barberData:allBarbers});
      
       }catch(err){
           console.log(err);
           throw err;
       }

    };

};

export const updateBarberPassword= (id,password) => {

    return async dispatch => {

         try{

           const response = await fetch(`http://173.212.234.137:3000/barber/updatePassword/${id}`,{

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


export const updateBarberLang= (id,lang) => {

    return async dispatch => {
           console.log(id,lang);
         try{

           const response = await fetch(`http://173.212.234.137:3000/barber/updateLang/${id}`,{

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

export const updateBarberPhone= (id,phone,barberid) => {

    return async dispatch => {

         try{

           const response = await fetch(`http://173.212.234.137:3000/barber/updatePhone/${barberid}`,{

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



export const updateBarber= (id,name,surname,b_name,age,email,address,wilaya,region,image) => {

    return async dispatch => {

         try{
           /*const data = new FormData();
           const body= {id:'123'};

            data.append('avatar', {
            name: image.fileName,
            type: image.type,
            uri:
                Platform.OS === 'android' ? image.uri : image.uri.replace('file://', ''),
            });
        
            Object.keys(body).forEach((key) => {
            data.append(key, body[key]);
            });
           const uri= image.uri;*/
           const response = await fetch(`http://173.212.234.137:3000/barber/updateBarber/${id}`,{

              method:'PATCH',
              headers: {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({name,surname,b_name,age,email,address,wilaya,region,image})
           });
           
           if(!response.ok){
               throw new Error('Oups! Une erreur est survenue.');
           }
           //console.log(data);
           //console.log(uri);
           dispatch({type:UPDATE_BARBER,id,barberData:{name,surname,b_name,age,email,address,wilaya,region,image}});
           
         }catch(err){
             console.log(err);
             throw err;
         }
    };

};

export const deleteBarber = id => {

    return async dispatch => {
    
        try{

            const response = await fetch(`http://173.212.234.137:3000/barber/deleteBarber/${id}`,{

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
