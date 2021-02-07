export const CREATE_PORTFOLIO = "CREATE_PORTFOLIO";
export const UPDATE_PORTFOLIO = "UPDATE_PORTFOLIO";
export const DELETE_PORTFOLIO = "DELETE_PORTFOLIO";
export const SET_PORTFOLIO = "SET_PORTFOLIO";

export const createPortfolio=(barber_id)=>{
  
    return async () =>{
        const portfolioData={barber_id};
         
        try{
            const response= await fetch('http://95.111.243.233:3000/portfolio',{
                method : "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body : JSON.stringify(portfolioData)
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

export const updatePortfolio=(imgsource,model,barber_id,id)=>{
  
    return async () =>{
        const portfolioData={imgsource,model};
       
        try{
            const response= await fetch(`http://95.111.243.233:3000/portfolio/${barber_id}/${id}`,{
                method : "POST",
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body : JSON.stringify(portfolioData)
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

export const setPortfolio= barber_id => {
    return async dispatch=>{
        try{

            const response= await fetch(`http://95.111.243.233:3000/portfolio/${barber_id}`);

            if(!response.ok){
             throw new Error('Oups! Une erreur est survenue.');
             }
 
            const resData= await response.json();
           
            /*const lastResult=[]; 
            resData.forEach(picture => {
                
                if(picture.model===null) {
                   
                   resData.filter(picture=>picture);
                }else{
                    lastResult.push(picture);
                }
            });*/
           
            dispatch({type:SET_PORTFOLIO,portfolioData:resData});
      
       }catch(err){
           console.log(err);
           throw err;
       }

    };

};