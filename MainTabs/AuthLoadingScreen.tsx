import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { StackParamList } from "../App";
import { StackNavigationProp } from "@react-navigation/stack";

type AuthNavigationProp = StackNavigationProp<StackParamList>;

const AuthLoadingScreen: React.FC = () => {
  const [isReady, setIsReady] = useState(false);
  const navigation = useNavigation<AuthNavigationProp>();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const user = await AsyncStorage.getItem("user");
        if (user) {
          navigation.navigate("MainNav");
        } else {
          navigation.navigate("LoginScreen");
        }
      } catch (error) {
        console.error("Error checking login status", error);
        navigation.navigate("LoginScreen");
      } finally {
        setIsReady(true);
      }
    };

    checkLoginStatus();
  }, [navigation]);

  if (!isReady) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

export default AuthLoadingScreen;
