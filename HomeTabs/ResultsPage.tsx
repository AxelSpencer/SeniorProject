import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { StackParamList } from "./HomeNav";
import { useFetchBooks } from "../useFetch";
import Icon from "react-native-vector-icons/Ionicons";
import { StackNavigationProp } from "@react-navigation/stack";

type ResultsPageNavigationProp = StackNavigationProp<StackParamList>;
type ResultsPageRouteProp = RouteProp<StackParamList, "ResultsPage">;

const ResultsPage: React.FC = () => {
  const route = useRoute<ResultsPageRouteProp>();
  const { query } = route.params;
  const navigation = useNavigation<ResultsPageNavigationProp>();
  const [searchQuery, setSearchQuery] = useState(query);

  const { data, loading, error } = useFetchBooks(searchQuery);

  const handleSearch = () => {
    navigation.navigate("ResultsPage", { query: searchQuery });
  };

  if (loading) return <ActivityIndicator size="large" color="white" />;
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error fetching results: {error}</Text>
      </View>
    );
  }

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
        <TouchableOpacity onPress={() => navigation.navigate("LandingPage")}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <TextInput
          onPress={() => navigation.goBack()}
          style={styles.input}
          placeholder="Search..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity onPress={handleSearch}>
          <Icon name="search" size={24} color="white" />
        </TouchableOpacity>
      </View>
      {data && data.items.length > 0 ? (
        <FlatList
          data={data.items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleBookPress(item)}
              style={styles.bookContainer}
            >
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
                  style={styles.bookTitle}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.volumeInfo.title}
                </Text>
                {item.volumeInfo.authors && (
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
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#0D1117",
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "#888",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginHorizontal: 8,
    color: "white",
  },
  bookContainer: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#181C24",
    padding: 8,
    borderRadius: 8,
  },
  coverImage: {
    width: 100,
    height: 130,
    margin: 8,
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
});

export default ResultsPage;
