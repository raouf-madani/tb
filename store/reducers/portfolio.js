import {SET_PORTFOLIO,CREATE_PORTFOLIO,UPDATE_PORTFOLIO,DELETE_PORTFOLIO} from '../actions/portfolioActions';


const initialState={
    portfolio:[]
};

const portfolioReducer=(state=initialState,action)=>{
   console.log(action.type);
   switch(action.type){
      
     
      case SET_PORTFOLIO:
      return{
        ...state,
        portfolio:action.portfolioData
      }; 

       
       default: 
        return state;
   }



};

export default portfolioReducer;