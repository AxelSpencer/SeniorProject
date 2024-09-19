import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LibraryPage from "./LibraryPage";
import EditBookModal from "./EditBookModal";

const BlankPage = () => null;

export type StackParamList = {
  LibraryPage: undefined;
  EditBookModal: { book: any };
};

const Stack = createStackNavigator<StackParamList>();

const LibraryNav: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="LibraryPage">
      <Stack.Screen
        name="LibraryPage"
        component={LibraryPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditBookModal"
        component={EditBookModal}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default LibraryNav;
