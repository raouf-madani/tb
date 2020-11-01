import React from "react";
import {HeaderButton} from "react-navigation-header-buttons";
import {Ionicons} from "@expo/vector-icons";

import Colors from "../constants/Colors";
import { Platform,Dimensions } from "react-native";

//responsivity (Dimensions get method)
const screen = Dimensions.get('window');

const CustomHeaderButton = props =>{

     return <HeaderButton 
     {...props} 
     IconComponent = {Ionicons}
     iconSize={40}
     
     />

};


export default CustomHeaderButton;

