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
import BarberBookingsDetailScreen from '../screens/barber/barberBooking/barberBookingsDetailScreen';
import BarberSupportScreen from '../screens/barber/barberProfile/barberSupportScreen';
import BarberProfileScreen from '../screens/barber/barberProfile/barberProfileScreen';
import BarberGaleryScreen from '../screens/barber/barberProfile/barberGaleryScreen';
import BarberHomeScreen from '../screens/home/barberHomeScreen';


//Main Stack Navigator
const BarberNavigation = createStackNavigator({
   Barber : BarberHomeScreen,
   BarberService : BarberServiceScreen,
   EditService: EditServiceScreen,
   BarberBookings: BarberBookingsScreen,
   BarberBookingsDetail: BarberBookingsDetailScreen,
   BarberSupport: BarberSupportScreen,
   BarberProfile: BarberProfileScreen,
   BarberGalery: BarberGaleryScreen,
},
);

const AuthNavigation = createStackNavigator({
   Login: LoginScreen,
   SignupBarber:SignupBarberScreen,
  });

  const MainNavigation = createSwitchNavigator({
   Startup:StartupScreen,
   Auth: AuthNavigation,
   Main: BarberNavigation
 }) 


export default createAppContainer(MainNavigation);
