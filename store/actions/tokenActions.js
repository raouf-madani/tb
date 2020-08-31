export const GET_TOKENS = "GET_TOKENS"; 
export const ADD_TOKEN = "ADD_TOKEN";

export const getTokens = (barberID)=>{

    return async (dispatch) =>{
        try {

            const arr = await fetch(`http://173.212.234.137:3000/barber/barbertokens/${barberID}`);
            const resData = await arr.json ();
 

            dispatch({type : GET_TOKENS , tokens : resData});
            
          
        }
        
        catch (error) {
            throw error ;
            // console.log("There is an Error");
        }

                
            };


        };



        export const addtoken = (token)=>{
            return async (dispatch) =>{
                try {
                   

                    const response = await fetch(`http://173.212.234.137:3000/barber/addtoken`,
                     {
                        method : "POST",
                        headers: {
                           'Content-Type': 'application/json'
                         },
                       body : JSON.stringify(token)
                       }
                    
                    );
         
                    if (!response.ok) {
                        throw new Error('Something went wrong!');
                      }
                else{
                  
                    dispatch({type : ADD_TOKEN , token});
                
                }
                   
                 
                }
                
                catch (error) {
                    throw error ;
                    // console.log("There is an Error");
                }
        
                        
                    };
        
        
                };