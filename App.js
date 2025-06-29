import React from 'react';
// 

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LanguageProvider } from './src/context/LanguageContext';
import LoginScreen from './src/components/LoginScreen';
import SignUpScreen from './src/components/SignUpScreen';
import QueueTypesPage from './src/components/QueueTypesPage';
import VerificationPage from './src/components/VerificationPage';
import OpeningHoursPage from './src/components/OpeningHoursPage';
import ProfilePage from './src/components/ProfilePage';
import MyQueuesPage from './src/components/MyQueuesPage';
import RequiredDocumentsPage from './src/components/RequiredDocumentsPage';
import UploadDocumentsPage from './src/components/UploadDocumentsPage'; // Ensure this is correctly imported
import MyDocumentsPage from './src/components/MyDocumentsPage';
import MyAccountPage from './src/components/MyAccountPage';
 import HomePage from './src/components/HomePage';
import resetPassword from './src/components/resetPassword';
import BranchesPage from './src/components/BranchesPage';
import AppointmentsPage from './src/components/AppointmentsPage';
import BusinessOptionsPage from './src/components/BusinessOptionsPage';
console.log("🚀 App.js loaded");


const Stack = createStackNavigator();

const App = () => {
  console.log("🔄 App component rendered");

  return (
    <LanguageProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
         <Stack.Screen name="Login" component={LoginScreen} />
         <Stack.Screen name="SignUp" component={SignUpScreen} />
         <Stack.Screen name="HomePage" component={HomePage} />
         <Stack.Screen name="BranchesPage" component={BranchesPage} />
         <Stack.Screen name="AppointmentsPage" component={AppointmentsPage} />
         <Stack.Screen name="BusinessOptionsPage" component={BusinessOptionsPage} />
         <Stack.Screen name="QueueTypesPage" component={QueueTypesPage} />
         <Stack.Screen name="VerificationPage" component={VerificationPage} />
         <Stack.Screen name="resetPassword" component={resetPassword} />
         <Stack.Screen name="OpeningHoursPage" component={OpeningHoursPage} />
         <Stack.Screen name="ProfilePage" component={ProfilePage} />
         <Stack.Screen name="MyQueuesPage" component={MyQueuesPage} />
         <Stack.Screen name="RequiredDocumentsPage" component={RequiredDocumentsPage} />
         <Stack.Screen name="UploadDocumentsPage" component={UploadDocumentsPage} />
         <Stack.Screen name="MyDocumentsPage" component={MyDocumentsPage} />
         <Stack.Screen name="MyAccountPage" component={MyAccountPage} />

         
        </Stack.Navigator>
      </NavigationContainer>
    </LanguageProvider>
  );
};

export default App;





