import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AuthLoadingScreen from './MainTabs/AuthLoadingScreen'; // New screen
import LoginScreen from "./MainTabs/LoginScreen";
import MainNav from "./MainTabs/MainNav";
import { NavigationContainer } from "@react-navigation/native";

export type StackParamList = {
  AuthLoadingScreen: undefined;
  MainNav: undefined;
  LoginScreen: undefined;
};

const Stack = createStackNavigator<StackParamList>();

const App: React.FC = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="AuthLoadingScreen">
      <Stack.Screen
        name="AuthLoadingScreen"
        component={AuthLoadingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="LoginScreen" 
        component={LoginScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="MainNav" 
        component={MainNav} 
        options={{ headerShown: false }} 
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default App;
