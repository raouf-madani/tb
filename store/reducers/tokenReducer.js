const { GET_TOKENS, ADD_TOKEN } = require("../actions/tokenActions");


const initialState = {
 
    barberTokens : [],
   

};

const tokenReducer = (state = initialState,action)=>{
    switch(action.type){
     
           case GET_TOKENS :
            const tokens = action.tokens;

            return {
             ...state ,
             barberTokens : tokens ,
            };

            case ADD_TOKEN :
                let temp = [];
                temp.push(action.token);
               
                return {
                    ...state , 
                    barberTokens : [...state.barberTokens,...temp]
                };

       default : return state ;
    
    }

    };


export default tokenReducer;