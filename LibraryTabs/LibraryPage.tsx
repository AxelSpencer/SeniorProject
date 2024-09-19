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
import { StackParamList } from "./LibraryNav";
import { StackNavigationProp } from "@react-navigation/stack";
import { Picker } from "@react-native-picker/picker";
import { FontAwesome } from "@expo/vector-icons"; // Import for icons

type LibraryPageNavigationProp = StackNavigationProp<StackParamList>;

const LibraryPage: React.FC = () => {
  const [libraryBooks, setLibraryBooks] = useState<any[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("dateAdded");
  const [filterOption, setFilterOption] = useState("All");
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

  // Handle sorting
  const handleSort = (option: string) => {
    setSortOption(option);
    let sortedBooks = [...filteredBooks];
    if (option === "dateAdded") {
      sortedBooks.sort(
        (a, b) =>
          new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
      );
    } else {
      sortedBooks.sort(
        (a, b) =>
          new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
      );
    }
    setFilteredBooks(sortedBooks);
  };

  // Handle filtering by status
  const handleFilter = (option: string) => {
    setFilterOption(option);
    if (option === "All") {
      setFilteredBooks(libraryBooks);
    } else {
      const filtered = libraryBooks.filter((book) => book.status === option);
      setFilteredBooks(filtered);
    }
  };

  const handleBookPress = (book: any) => {
    navigation.navigate("EditBookModal", { book });
  };

  const renderItem = ({ item }: { item: any }) => {
    const getStatusBubble = (status: string) => {
      switch (status) {
        case "Finished":
          return { label: "FND", color: "green" };
        case "CurrentlyReading":
          return { label: "CR", color: "gold" };
        case "TBR":
          return { label: "TBR", color: "red" };
        default:
          return { label: "", color: "gray" };
      }
    };
  
    const { label, color } = getStatusBubble(item.status);
  
    return (
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
            <View style={[styles.statusBubble, { backgroundColor: color }]}>
              <Text style={styles.statusText}>{label}</Text>
            </View>
            {item.volumeInfo.categories && (
              <View style={styles.genresContainer}>
                {item.volumeInfo.categories.map((genre: string, index: number) => (
                  <View key={index} style={styles.genreBubble}>
                    <Text style={styles.genreText}>{genre}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.pageTitle}>Your Library</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search library..."
        placeholderTextColor="#888"
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <View style={styles.iconContainer}>
        <View style={styles.iconWrapper}>
          <FontAwesome
            name="filter"
            size={24}
            color="white"
            onPress={() => handleFilter(filterOption)}
          />
        </View>

        <Picker
          selectedValue={filterOption}
          style={styles.picker}
          onValueChange={(itemValue: string) => handleFilter(itemValue)}
          dropdownIconColor={'#fff'}
        itemStyle={styles.picker}
        >
          <Picker.Item label="All" value="All" />
          <Picker.Item label="Currently Reading" value="CurrentlyReading" />
          <Picker.Item label="Finished" value="Finished" />
          <Picker.Item label="To be Read" value="TBR" />
        </Picker>

        <View style={styles.iconWrapper}>
          <FontAwesome
            name="sort"
            size={24}
            color="white"
            onPress={() => handleSort(sortOption)}
          />
        </View>

        <Picker
          selectedValue={sortOption}
          style={styles.picker}
          onValueChange={(itemValue: string) => handleSort(itemValue)}
          dropdownIconColor={'#fff'}
        itemStyle={styles.picker}
        >
          <Picker.Item label="Newest" value="dateAdded" />
          <Picker.Item label="Oldest" value="oldest" />
        </Picker>
      </View>

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
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 16,
    textAlign: "center",
  },
  searchBar: {
    height: 40,
    backgroundColor: "#24292F",
    borderRadius: 8,
    paddingHorizontal: 16,
    color: "white",
    marginBottom: 16,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  iconWrapper: {
    marginRight: 12,
  },
  picker: {
    color: "white",
    width: 160,
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
  statusBubble: {
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: "flex-start",
  },
  statusText: {
    color: "white",
    fontSize: 14,
  },
});

export default LibraryPage;
