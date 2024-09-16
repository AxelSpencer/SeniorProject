import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar, Image, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import LibraryNav from "../LibraryTabs/LibraryNav";
import HomeNav from "../HomeTabs/HomeNav";
import YouNav from "../YouTabs/YouNav";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type StackParamList = {
  YouNav: undefined;
  HomeNav: undefined;
  LibraryNav: undefined;
};

const Tab = createBottomTabNavigator<StackParamList>();

const MainNav: React.FC = () => {
  const [profilePic, setProfilePic] = useState<string | null>(null);

  useEffect(() => {
    const loadProfilePic = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        if (user) {
          const userData = JSON.parse(user);
          setProfilePic(userData.profilePic || null);
        }
      } catch (error) {
        console.error('Error loading profile picture', error);
      }
    };

    loadProfilePic();
  }, []);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0D1117" />
      <Tab.Navigator
        initialRouteName="HomeNav"
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: "white",
          tabBarInactiveTintColor: "grey",
          tabBarStyle: { backgroundColor: "#24292F" },
          tabBarIcon: ({ focused }) => {
            if (route.name === "YouNav") {
              return (
                <View
                >
                  {profilePic ? (
                    <Image
                      source={{ uri: profilePic }}
                      style={{ width: 24,
                        height: 24,
                        borderRadius: 12,
                        borderWidth: focused ? 1 : 0,
                        borderColor: "white",
                        overflow: "hidden",
                        justifyContent: "center",
                        alignItems: "center", }}
                    />
                  ) : (
                    <Ionicons
                      name={focused ? "person" : "person-outline"}
                      size={24}
                      color={focused ? "white" : "grey"}
                    />
                  )}
                </View>
              );
            } else if (route.name === "HomeNav") {
              return (
                <Ionicons
                  name={focused ? "home" : "home-outline"}
                  size={24}
                  color={focused ? "white" : "grey"}
                />
              );
            } else if (route.name === "LibraryNav") {
              return (
                <Ionicons
                  name={focused ? "library" : "library-outline"}
                  size={24}
                  color={focused ? "white" : "grey"}
                />
              );
            }
            return null;
          },
        })}
      >
        <Tab.Screen
          name="YouNav"
          component={YouNav}
          options={{ headerShown: false, tabBarLabel: "You" }}
        />
        <Tab.Screen
          name="HomeNav"
          component={HomeNav}
          options={{ headerShown: false, tabBarLabel: "Home" }}
        />
        <Tab.Screen
          name="LibraryNav"
          component={LibraryNav}
          options={{ headerShown: false, tabBarLabel: "Library" }}
        />
      </Tab.Navigator>
    </>
  );
};

export default MainNav;
