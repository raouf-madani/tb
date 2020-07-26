import React, {useReducer,useEffect} from 'react';
import { StyleSheet, Text, View,Dimensions } from 'react-native';
import { Input } from 'react-native-elements';
import Colors from "../constants/Colors";

//responsivity (Dimensions get method)
const screen = Dimensions.get('window');

const INPUT_UPDATE = 'INPUT_UPDATE';
const INPUT_BLUR = 'INPUT_BLUR';
const inputReducer = (state,action)=>{
     switch(action.type){
         case INPUT_UPDATE:
             return{
                 ...state,
                 value:action.value,
                 isValid:action.isValid
             };

        case INPUT_BLUR:
            return{
                ...state,
                touched:true
            };

         default:
             return state;
     }
};

const CustomInput = props =>{


    const [inputState,dispatchInputState] = useReducer(inputReducer,
        {
            value:props.initialValue ? props.initialValue : '',
            isValid:props.initiallyValid,
            touched:false
        });

    //forward the value and the information whether it's valid or not to the parent
    const {onInputChange,id} = props;
    useEffect(()=>{
        if(inputState.touched){
        onInputChange(id,inputState.value,inputState.isValid);
        }
    },[inputState,onInputChange,id]);

        const inputChangeHandler= text=>{
            const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            const phoneRegex = /(^([5-7]){1}[0-9]{8}$)/;
            let isValid = true;
            if (props.required && text.trim().length === 0) {
            isValid = false;
            }
            if (props.email && !emailRegex.test(text.toLowerCase())) {
            isValid = false;
            }
            if(props.phone && !phoneRegex.test(text)){
            isValid = false;
            }
            if (props.min != null && +text < props.min) {
            isValid = false;
            }
            if (props.max != null && +text > props.max) {
            isValid = false;
            }
            if (props.minLength != null && text.length < props.minLength) {
            isValid = false;
            }
            if (props.maxLength != null && text.length > props.maxLength) {
                isValid = false;
            }

            dispatchInputState({type:INPUT_UPDATE,value:text,isValid:isValid})
        }

        const lostFocusHandler = ()=>{

            dispatchInputState({type:INPUT_BLUR});
        }

    return(
        <View style={{width:'100%',borderWidth:1, borderRadius:25,backgroundColor:'#d3d3d3',borderColor:!inputState.isValid?Colors.primary:'#d3d3d3',marginVertical:3,height:45,}}>
            <Input
                {...props}
                value={inputState.value}
                onChangeText={inputChangeHandler}
                onBlur={lostFocusHandler}
                placeholder={props.placeholder}
                inputContainerStyle={styles.input}
                placeholderTextColor={props.placeholderTextColor}
                inputStyle={{fontSize:15,color:Colors.blue}}
                errorMessage={props.errorMessage}
            />
        </View>
     );    
};


const styles= StyleSheet.create({
    
    input:{
        borderBottomWidth:0,
        paddingHorizontal:10,
      },
});

export default CustomInput;