import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

const BlankPage = () => null;

export type StackParamList = {
  LibraryPage: undefined;
  UserLibraryPage: undefined;
};

const Stack = createStackNavigator<StackParamList>();

const LibraryNav: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="UserLibraryPage">
      <Stack.Screen
        name="LibraryPage"
        component={BlankPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UserLibraryPage"
        component={BlankPage}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default LibraryNav;
