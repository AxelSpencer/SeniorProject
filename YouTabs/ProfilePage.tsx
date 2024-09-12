import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/Ionicons";
import { StackParamList } from "./YouNav";

type ProfilePageNavigationProp = StackNavigationProp<StackParamList>;

const ProfilePage: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [bio, setBio] = useState("");
  const [booksRead, setBooksRead] = useState(0);
  const [pagesRead, setPagesRead] = useState(0);

  const navigation = useNavigation<ProfilePageNavigationProp>();

  const loadUserData = useCallback(async () => {
    try {
      const user = await AsyncStorage.getItem("user");
      if (user) {
        const userData = JSON.parse(user);
        setFirstName(userData.firstName || "");
        setLastName(userData.lastName || "");
        setProfilePic(userData.profilePic || null);
        setBio(userData.bio || "");
        setBooksRead(userData.booksRead || 0);
        setPagesRead(userData.pagesRead || 0);
      }
    } catch (error) {
      console.error("Error loading user data", error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadUserData();
    }, [loadUserData])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.settingsIcon}
          onPress={() => navigation.navigate("SettingsPage")}
        >
          <Icon name="settings-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.profileRow}>
        <View style={styles.profilePicContainer}>
          {profilePic ? (
            <Image source={{ uri: profilePic }} style={styles.profilePic} />
          ) : (
            <Icon name="person-circle-outline" size={100} color="#089083" />
          )}
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statsItem}>
            <Text style={styles.statsLabel}>Books Read</Text>
            <Text style={styles.statsValue}>{booksRead}</Text>
          </View>
          <View style={styles.statsItem}>
            <Text style={styles.statsLabel}>Pages Read</Text>
            <Text style={styles.statsValue}>{pagesRead}</Text>
          </View>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.name}>{`${firstName} ${lastName}`}</Text>
        <Text style={styles.bio}>{bio}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#0D1117",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 20,
  },
  settingsIcon: {
    padding: 8,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  profilePicContainer: {
    alignItems: "center",
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "60%",
  },
  statsItem: {
    alignItems: "center",
  },
  statsLabel: {
    color: "#D3D3D3",
    fontSize: 16,
  },
  statsValue: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  infoContainer: {
    alignItems: "flex-start",
    width: "100%",
    paddingHorizontal: 16,
    marginTop: 20,
  },
  name: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  bio: {
    color: "#D3D3D3",
    fontSize: 16,
  },
});

export default ProfilePage;
