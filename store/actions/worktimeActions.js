export const CREATE_WORKTIME= "CREATE_WORKTIME";
export const UPDATE_WORKTIME = "UPDATE_WORKTIME";

export const createWorktime=(barber_id)=>{
  
    return async () =>{
        const worktimeData={barber_id};
         console.log(barber_id);
        try{
            const response= await fetch('http://173.212.234.137:3000/worktime/addWorktime',{
                method : "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body : JSON.stringify(worktimeData)
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

export const updateWorktime= (isworkingSat,isworkingSun,isworkingMon,isworkingTue,isworkingWed,isworkingThu,isworkingFri,debutSat,debutSun,debutMon,debutTue,debutWed,debutThu,debutFri,finishSat,finishSun,finishMon,finishTue,finishWed,finishThu,finishFri,barber_id) => {

    const worktimeObject={isworkingSat,isworkingSun,isworkingMon,isworkingTue,isworkingWed,isworkingThu,isworkingFri,debutSat,debutSun,debutMon,debutTue,debutWed,debutThu,debutFri,finishSat,finishSun,finishMon,finishTue,finishWed,finishThu,finishFri};
      console.log(isworkingSat,isworkingSun,isworkingMon,isworkingTue,isworkingWed,isworkingThu,isworkingFri,debutSat,debutSun,debutMon,debutTue,debutWed,debutThu,debutFri,finishSat,finishSun,finishMon,finishTue,finishWed,finishThu,finishFri)
     
    return async () => {

         try{
           
           const response = await fetch(`http://173.212.234.137:3000/worktime/updateWorktime/${barber_id}`,{
              method:'PATCH',
              headers: {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify(worktimeObject)
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