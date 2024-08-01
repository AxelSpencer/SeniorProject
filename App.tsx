import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Logo from './assets/PrimaryLogo.png'
import BookList from "./home"

export type StackParamList = {
  YouNav: undefined;
  HomeNav: undefined;
  LibraryNav: undefined;
};

const Tab = createBottomTabNavigator<StackParamList>();

const BlankPage = () => {
  return (
    <View style={{ flex: 1, backgroundColor: "#0D1117" }}></View>
  );
};

const CustomHeader = () => (
  <View style={styles.headerContainer}>
    <Image source={Logo} style={styles.Img} />
    <Text style={styles.headerTitle}>Bookshelf</Text>
  </View>
);

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#0D1117" />
      <Tab.Navigator
        initialRouteName="HomeNav"
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: "white",
          tabBarInactiveTintColor: "grey",
          tabBarStyle: { backgroundColor: "#24292F" },
          tabBarIcon: ({ focused }) => {
            let iconName: "person" | "person-outline" | "home" | "home-outline" | "library" | "library-outline" = "person-outline";

            if (route.name === "YouNav") {
              iconName = focused ? "person" : "person-outline";
            } else if (route.name === "HomeNav") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "LibraryNav") {
              iconName = focused ? "library" : "library-outline";
            }

            return <Ionicons name={iconName} size={24} color={focused ? "white" : "grey"} />;
          },
        })}
      >
        <Tab.Screen
          name="YouNav"
          component={BlankPage}
          options={{
            title: "You",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#0D1117" },
            headerTintColor: "white",
            headerTitleStyle: {fontSize: 25, fontWeight: 'bold'}
          }}
        />
        <Tab.Screen
          name="HomeNav"
          component={BookList}
          options={{
            headerTitle: () => <CustomHeader />,
            title: "Home",
            headerTitleAlign: "left",
            headerStyle: { backgroundColor: "#0D1117" },
            headerTintColor: "white",
            headerTitleStyle: {fontSize: 32, fontWeight: 'bold'}
          }}
        />
        <Tab.Screen
          name="LibraryNav"
          component={BlankPage}
          options={{
            title: "Library",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#0D1117" },
            headerTintColor: "white",
            headerTitleStyle: {fontSize: 25, fontWeight: 'bold'}
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  Img: {
    width: 40,
    height: 40,
    marginRight: 8,
  },
  headerTitle: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold'
  },
});

export default App;
