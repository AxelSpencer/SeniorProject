import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SettingsPage from "./SettingsPage";
import ProfilePage from "./ProfilePage";

const BlankPage = () => null;

export type StackParamList = {
  ProfilePage: undefined;
  SettingsPage: undefined;
};

const Stack = createStackNavigator<StackParamList>();

const YouNav: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="ProfilePage">
      <Stack.Screen
        name="ProfilePage"
        component={ProfilePage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SettingsPage"
        component={SettingsPage}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default YouNav;
