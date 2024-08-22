import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

const BlankPage = () => null;

export type StackParamList = {
  YouPage: undefined;
  SettingsPage: undefined;
};

const Stack = createStackNavigator<StackParamList>();

const YouNav: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="YouPage">
      <Stack.Screen
        name="YouPage"
        component={BlankPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SettingsPage"
        component={BlankPage}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default YouNav;
