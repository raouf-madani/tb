export const SET_FEEDBACKS= "SET_FEEDBACKS";



export const setFeedbacks= barber_id => {
    return async dispatch=>{
        try{

            const response= await fetch(`http://173.212.234.137:3000/feedback/${barber_id}`);

            if(!response.ok){
             throw new Error('Oups! Une erreur est survenue.');
             }
 
            const resData= await response.json();
            
           
            dispatch({type:SET_FEEDBACKS,feedbackData:resData});
      
       }catch(err){
           console.log(err);
           throw err;
       }

    };

};
