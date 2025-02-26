
import React from 'react';
import HomePage from './src/components/HomePage';
import resetPassword from './src/components/resetPassword';
import BranchesPage from './src/components/BranchesPage'; // Adjust path
import AppointmentsPage from './src/components/AppointmentsPage'; // Adjust path
import BusinessOptionsPage from './src/components/BusinessOptionsPage'; // Adjust pathimport React from 'react';
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



const Stack = createStackNavigator();

const App = () => {
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
         
         
         
        </Stack.Navigator>
      </NavigationContainer>
    </LanguageProvider>
  );
};

export default App;

