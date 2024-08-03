import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LandingPage from "./LandingPage";
import SearchLandingPage from "./SearchLandingPage";
import ResultsPage from "./ResultsPage"; // Import ResultsPage

const BlankPage = () => null;

export type StackParamList = {
  LandingPage: undefined;
  SearchLandingPage: undefined;
  ResultsPage: { query: string }; // Define the params for ResultsPage
  BookModal: undefined;
  ScannerModal: undefined;
};

const Stack = createStackNavigator<StackParamList>();

const HomeNav: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="LandingPage">
      <Stack.Screen
        name="LandingPage"
        component={LandingPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SearchLandingPage"
        component={SearchLandingPage}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ResultsPage"
        component={ResultsPage}
        options={{
          presentation: "transparentModal",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="BookModal"
        component={BlankPage}
        options={{
          presentation: "modal",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ScannerModal"
        component={BlankPage}
        options={{
          presentation: "modal",
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default HomeNav;
