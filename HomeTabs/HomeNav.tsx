import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LandingPage from "./LandingPage";
import SearchPage from "./SearchPage";
import ResultsPage from "./ResultsPage";
import BookModal from "./BookModal";
import ScannerScreen from "./BarcodeScanner";

const BlankPage = () => null;

export type StackParamList = {
  LandingPage: undefined;
  SearchPage: undefined;
  ResultsPage: { query: string };
  BookModal: { book: any };
  ScannerModal: undefined;
  BarcodeScanner: undefined;
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
        name="SearchPage"
        component={SearchPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ResultsPage"
        component={ResultsPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BookModal"
        component={BookModal}
        options={{ presentation: "transparentModal", headerShown: false }}
      />
      <Stack.Screen
        name="BarcodeScanner"
        component={ScannerScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default HomeNav;
