import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useFetchPopularBooks } from "../useFetch";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackParamList } from "./HomeNav";
import AsyncStorage from "@react-native-async-storage/async-storage";

type LandingPageNavigationProp = StackNavigationProp<StackParamList>;

const LandingPage: React.FC = () => {
  const { data, loading, error } = useFetchPopularBooks();
  const navigation = useNavigation<LandingPageNavigationProp>();
  const [libraryBooks, setLibraryBooks] = useState<any[]>([]);

  useEffect(() => {
    const fetchLibraryBooks = async () => {
      try {
        const storedData = await AsyncStorage.getItem("libraryBooks");
        if (storedData) {
          setLibraryBooks(JSON.parse(storedData));
        }
      } catch (error) {
        console.error("Failed to load library books", error);
      }
    };

    fetchLibraryBooks();
  }, []);

  if (loading) return <ActivityIndicator size="large" color="white" />;
  if (error) {
    Alert.alert("Error", error);
    return null;
  }

  const isBookInLibrary = (bookId: string) => {
    return libraryBooks.some((book) => book.id === bookId);
  };

  const renderRating = (rating: number | undefined) => {
    if (rating === undefined) {
      return <Icon name="star-outline" size={20} color="#6c757d" />;
    }

    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <View style={styles.ratingContainer}>
        {[...Array(fullStars)].map((_, index) => (
          <Icon key={`full-${index}`} name="star" size={20} color="#D4AF37" />
        ))}
        {halfStar && <Icon name="star-half" size={20} color="#D4AF37" />}
        {[...Array(emptyStars)].map((_, index) => (
          <Icon
            key={`empty-${index}`}
            name="star-outline"
            size={20}
            color="#D4AF37"
          />
        ))}
      </View>
    );
  };

  const handleBookPress = (book: any) => {
    navigation.navigate("BookModal", { book });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../assets/PrimaryLogo.png")}
          style={styles.logo}
        />
        <Text style={styles.headerTitle}>Bookshelf</Text>
        <View style={styles.iconContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("BarcodeScanner")}
          >
            <Icon name="scan" size={24} color="white" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("SearchPage")}>
            <Icon name="search" size={24} color="white" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>
      {data && data.items && data.items.length > 0 ? (
        <FlatList
          data={data.items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleBookPress(item)}
              style={styles.bookContainer}
            >
              {isBookInLibrary(item.id) && (
                <View style={styles.libraryIndicator}>
                  <Icon name="library" size={24} color="white" />
                </View>
              )}
              {item.volumeInfo.imageLinks?.thumbnail ? (
                <Image
                  source={{ uri: item.volumeInfo.imageLinks.thumbnail }}
                  style={styles.coverImage}
                />
              ) : (
                <Image
                  source={require("../assets/NoCover.jpg")}
                  style={styles.coverImage}
                />
              )}
              <View style={styles.bookInfo}>
                <Text
                  style={styles.title}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.volumeInfo.title}
                </Text>
                {item.volumeInfo.authors.length > 0 && (
                  <Text style={styles.author}>
                    {item.volumeInfo.authors.join(", ")}
                  </Text>
                )}
                <View style={styles.ratingWrapper}>
                  {renderRating(item.volumeInfo.averageRating)}
                </View>
                {item.volumeInfo.categories && (
                  <View style={styles.genresContainer}>
                    {item.volumeInfo.categories.map((genre, index) => (
                      <View key={index} style={styles.genreBubble}>
                        <Text style={styles.genreText}>{genre}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={styles.noResultsText}>No books found.</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D1117",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#0D1117",
  },
  logo: {
    width: 40,
    height: 40,
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: "white",
    flex: 1,
    textAlign: "left",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginHorizontal: 10,
  },
  bookContainer: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#181C24",
    padding: 8,
    borderRadius: 8,
    position: "relative",
  },
  libraryIndicator: {
    position: "absolute",
    bottom: 8,
    right: 8,
    zIndex: 1,
  },
  coverImage: {
    width: 100,
    height: 130,
    margin: 8,
  },
  bookInfo: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: "white",
  },
  author: {
    fontSize: 14,
    marginBottom: 8,
    color: "white",
  },
  ratingWrapper: {
    flexDirection: "row",
    marginTop: 20,
  },
  ratingContainer: {
    flexDirection: "row",
  },
  genresContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  genreBubble: {
    backgroundColor: "#089083",
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 8,
  },
  genreText: {
    color: "white",
    fontSize: 14,
  },
  noResultsText: {
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
});

export default LandingPage;
