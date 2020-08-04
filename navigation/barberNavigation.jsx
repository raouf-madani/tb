import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer,createSwitchNavigator} from 'react-navigation';
import {Platform,StyleSheet} from 'react-native';
import Colors from '../constants/Colors';

import StartupScreen from '../screens/startupScreen';
import LoginScreen from '../screens/loginScreen';
import SignupBarberScreen from '../screens/barber/signupBarberScreen';
import BarberServiceScreen from '../screens/barber/barberBooking/barberServiceScreen';
import EditServiceScreen from '../screens/barber/barberBooking/editServiceScreen';
import BarberBookingsScreen from '../screens/barber/barberBooking/barberBookingsScreen';
import AllBookingsScreen from '../screens/barber/barberBooking/allBookingsScreen';
import BarberBookingsDetailScreen from '../screens/barber/barberBooking/barberBookingsDetailScreen';
import BookingDetail from '../screens/barber/barberBooking/bookingDetail';
import BarberParametersScreen from '../screens/barber/barberProfile/barberParametersScreen';
import BarberProfileScreen from '../screens/barber/barberProfile/barberProfileScreen';
import BarberGaleryScreen from '../screens/barber/barberProfile/barberGaleryScreen';
import BarberHomeScreen from '../screens/home/barberHomeScreen';
import ForgotPasswordScreen from '../screens/forgotPasswordScreen';
import BarberSupportScreen  from '../screens/barber/barberProfile/barberSupportScreen';



//Main Stack Navigator
const BarberNavigation = createStackNavigator({
   Barber : BarberHomeScreen,
   BarberSupport:BarberSupportScreen,
   BarberService : BarberServiceScreen,
   EditService:EditServiceScreen,
   BarberBookings: BarberBookingsScreen,
   BarberBookingsDetail: BarberBookingsDetailScreen,
   AllBookingsScreen : AllBookingsScreen,
   BookingDetail : BookingDetail ,
   BarberParameters: BarberParametersScreen,
   BarberProfile: BarberProfileScreen,
   BarberGalery: BarberGaleryScreen,
   
   
},
);



const AuthNavigation = createStackNavigator({
   Login: LoginScreen,
   SignupBarber:SignupBarberScreen,
   ForgotPassword:ForgotPasswordScreen
  });

  const MainNavigation = createSwitchNavigator({
   Startup:StartupScreen,
   Auth: AuthNavigation,
   Main: BarberNavigation
 }) 


export default createAppContainer(MainNavigation);
