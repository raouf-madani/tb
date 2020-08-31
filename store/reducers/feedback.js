import {SET_FEEDBACKS} from '../actions/feedbackActions';


const initialState={
    feedbacks:[]
};

const feedbacksReducer=(state=initialState,action)=>{
   console.log(action.type);
   switch(action.type){
      
     
      case SET_FEEDBACKS:
      return{
        ...state,
        feedbacks:action.feedbackData
      }; 

       
       default: 
        return state;
   }



};

export default feedbacksReducer;