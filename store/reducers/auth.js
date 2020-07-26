import {AUTHENTICATE,LOGOUT} from '../actions/authActions';

const initialState={
    token:null,
    userID:null
};

const authReducer =(state=initialState,action) =>{
  
    switch(action.type){
        case AUTHENTICATE:
            return{
                token:action.token,
                userID:action.userID
            };
        case LOGOUT:
            return initialState;

         default :
          return state;

    }

};

export default authReducer;