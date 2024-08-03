import React from "react";
import { View, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import HomeTab from "./HomeTabs/HomeNav";

export type StackParamList = {
  YouNav: undefined;
  HomeNav: undefined;
  LibraryNav: undefined;
};

const Tab = createBottomTabNavigator<StackParamList>();

const BlankPage = () => <View style={styles.blankPage} />;

const App: React.FC = () => (
  <NavigationContainer>
    <StatusBar barStyle="light-content" backgroundColor="#0D1117" />
    <Tab.Navigator
      initialRouteName="HomeNav"
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "grey",
        tabBarStyle: { backgroundColor: "#24292F" },
        tabBarIcon: ({ focused }) => {
          let iconName:
            | "person"
            | "person-outline"
            | "home"
            | "home-outline"
            | "library"
            | "library-outline" = "person-outline";

          if (route.name === "YouNav") {
            iconName = focused ? "person" : "person-outline";
          } else if (route.name === "HomeNav") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "LibraryNav") {
            iconName = focused ? "library" : "library-outline";
          }

          return (
            <Ionicons
              name={iconName}
              size={24}
              color={focused ? "white" : "grey"}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="YouNav"
        component={BlankPage}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="HomeNav"
        component={HomeTab}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="LibraryNav"
        component={BlankPage}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  </NavigationContainer>
);

const styles = StyleSheet.create({
  blankPage: {
    flex: 1,
    backgroundColor: "#0D1117",
  },
});

export default App;
