import React, { useState, useEffect } from "react";
import {
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  Image,
  ImageBackground,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackParamList } from "../App";

type LoginScreenNavigationProp = StackNavigationProp<StackParamList>;

const LoginScreen: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigation = useNavigation<LoginScreenNavigationProp>();

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const user = await AsyncStorage.getItem("user");
        if (user) {
          navigation.navigate("MainNav");
        }
      } catch (error) {
        console.error("Error checking login status", error);
      }
    };

    checkLoggedIn();
  }, [navigation]);

  const handleLogin = async () => {
    if (!firstName || !lastName || !password || !confirmPassword || !email) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    try {
      await AsyncStorage.setItem(
        "user",
        JSON.stringify({ firstName, lastName, email })
      );
      navigation.navigate("MainNav");
    } catch (error) {
      console.error("Error saving data", error);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/CreateUserBackground.png")}
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Welcome to Bookshelf!</Text>

        <Image
          source={require("../assets/PrimaryLogo.png")}
          style={styles.icon}
        />

        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
          placeholderTextColor="#D3D3D3"
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
          placeholderTextColor="#D3D3D3"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholderTextColor="#D3D3D3"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#D3D3D3"
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholderTextColor="#D3D3D3"
        />
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    alignItems: "center",
    padding: 16,
  },
  icon: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
  },
  input: {
    width: "90%",
    height: 50,
    borderColor: "#24292F",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: "#24292F",
    color: "#fff",
  },
  button: {
    backgroundColor: "#089083",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    paddingHorizontal: 20,
  },
});

export default LoginScreen;
