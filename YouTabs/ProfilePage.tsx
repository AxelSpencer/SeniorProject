import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
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
  const [reviews, setReviews] = useState<any[]>([]);

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
      }

      const storedBooks = await AsyncStorage.getItem("libraryBooks");
      if (storedBooks) {
        const books = JSON.parse(storedBooks);
        const finishedBooks = books.filter(
          (book: any) => book.status === "Finished"
        );
        setBooksRead(finishedBooks.length);
        setPagesRead(
          finishedBooks.reduce(
            (total: number, book: any) =>
              total + book.volumeInfo.pageCount || 0,
            0
          )
        );

        const bookReviews = books
          .filter((book: any) => book.review || book.rating)
          .map((book: any) => ({
            title: book.volumeInfo.title,
            review: book.review,
            rating: book.rating,
            image:
              book.volumeInfo.imageLinks?.thumbnail ||
              require("../assets/NoCover.jpg"),
            dateAdded: book.dateAdded,
          }))
          .sort(
            (a: any, b: any) =>
              new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
          );

        setReviews(bookReviews);
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

  const renderReview = ({ item }: { item: any }) => (
    <View style={styles.reviewContainer}>
      <Image source={{ uri: item.image }} style={styles.reviewImage} />
      <View style={styles.reviewContent}>
        <Text style={styles.reviewTitle}>{item.title}</Text>
        {item.review && <Text style={styles.reviewText}>{item.review}</Text>}

        {item.rating ? (
          <View style={styles.ratingContainer}>
            {Array.from({ length: 5 }, (_, index) => (
              <Icon
                key={index}
                name={index < item.rating ? "star" : "star-outline"}
                size={20}
                color="#D4AF37"
              />
            ))}
          </View>
        ) : (
          <Icon
            style={styles.noRatingText}
            name={"star-outline"}
            size={20}
            color="#D4AF37"
          />
        )}
      </View>
    </View>
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
        <Text style={styles.bio}>{bio || "No bio"}</Text>
      </View>

      {reviews.length > 0 ? (
        <View style={styles.reviewsContainer}>
          <Text style={styles.reviewsHeader}>Your Reviews</Text>
          <View style={styles.divider} />
          <FlatList
            data={reviews}
            keyExtractor={(item) => item.title}
            renderItem={renderReview}
          />
        </View>
      ) : (
        <Text style={styles.noReviewsText}>No Reviews</Text>
      )}
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
  reviewsContainer: {
    marginTop: 20,
  },
  reviewsHeader: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  divider: {
    borderBottomColor: "#D3D3D3",
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  reviewContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  reviewImage: {
    width: 50,
    height: 75,
    marginRight: 10,
    borderRadius: 5,
  },
  reviewContent: {
    flex: 1,
  },
  reviewTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  reviewText: {
    color: "#D3D3D3",
    fontSize: 14,
  },
  ratingContainer: {
    flexDirection: "row",
    marginTop: 5,
  },
  noReviewsText: {
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
  noRatingText: {
    color: "#D3D3D3",
    marginTop: 5,
  },
});

export default ProfilePage;
