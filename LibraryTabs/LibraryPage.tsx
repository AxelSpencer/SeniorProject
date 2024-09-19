import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackParamList } from "./LibraryNav";

type LibraryPageNavigationProp = StackNavigationProp<StackParamList>;

const LibraryPage: React.FC = () => {
  const [libraryBooks, setLibraryBooks] = useState<any[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation<LibraryPageNavigationProp>();
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchLibraryBooks = async () => {
      try {
        const storedData = await AsyncStorage.getItem("libraryBooks");
        const books = storedData ? JSON.parse(storedData) : [];
        books.sort(
          (a: any, b: any) =>
            new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
        );
        setLibraryBooks(books);
        setFilteredBooks(books);
      } catch (error) {
        console.error("Failed to fetch library books", error);
      }
    };

    if (isFocused) {
      fetchLibraryBooks();
    }
  }, [isFocused]);

  // Handle search filtering
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredBooks(libraryBooks);
    } else {
      const filtered = libraryBooks.filter((book) =>
        book.volumeInfo.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredBooks(filtered);
    }
  };

  const handleBookPress = (book: any) => {
    navigation.navigate("EditBookModal", { book });
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => handleBookPress(item)}>
      <View style={styles.bookContainer}>
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
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {item.volumeInfo.title}
          </Text>
          {item.volumeInfo.authors.length > 0 && (
            <Text style={styles.author}>
              {item.volumeInfo.authors.join(", ")}
            </Text>
          )}
          <Text style={styles.status}>
            <Text style={styles.bold}>Status:</Text> {item.status}
          </Text>
          <Text style={styles.format}>
            <Text style={styles.bold}>Format:</Text> {item.format}
          </Text>
          {item.volumeInfo.categories && (
            <View style={styles.genresContainer}>
              {item.volumeInfo.categories.map(
                (genre: string, index: number) => (
                  <View key={index} style={styles.genreBubble}>
                    <Text style={styles.genreText}>{genre}</Text>
                  </View>
                )
              )}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search library..."
        placeholderTextColor="#888"
        value={searchQuery}
        onChangeText={handleSearch}
      />
      {filteredBooks.length > 0 ? (
        <FlatList
          data={filteredBooks}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      ) : (
        <Text style={styles.noResultsText}>No books in your library.</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D1117",
    padding: 16,
  },
  searchBar: {
    height: 40,
    backgroundColor: "#24292F",
    borderRadius: 8,
    paddingHorizontal: 16,
    color: "white",
    marginBottom: 16,
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
  status: {
    fontSize: 14,
    marginBottom: 8,
    color: "white",
  },
  format: {
    fontSize: 14,
    marginBottom: 8,
    color: "white",
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
    marginBottom: 4,
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
  bold: {
    fontWeight: "bold",
  },
});

export default LibraryPage;
