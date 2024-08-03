import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const SearchLandingPage: React.FC = () => {
  const [query, setQuery] = useState("");
  const [previousSearches, setPreviousSearches] = useState<string[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    loadPreviousSearches();
  }, []);

  const loadPreviousSearches = async () => {
    try {
      const searches = await AsyncStorage.getItem("previousSearches");
      if (searches) {
        setPreviousSearches(JSON.parse(searches));
      }
    } catch (error) {
      console.error("Failed to load previous searches:", error);
    }
  };

  const saveSearch = async (search: string) => {
    try {
      const updatedSearches = [
        search,
        ...previousSearches.filter((s) => s !== search),
      ];
      await AsyncStorage.setItem(
        "previousSearches",
        JSON.stringify(updatedSearches)
      );
      setPreviousSearches(updatedSearches);
    } catch (error) {
      console.error("Failed to save search:", error);
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      saveSearch(query.trim());
      navigation.navigate("ResultsPage", { query: query.trim() });
    }
  };

  const handleClearSearch = () => {
    setQuery("");
  };

  const handleSelectSearch = (search: string) => {
    setQuery(search);
    navigation.navigate("ResultsPage", { query: search });
  };

  const clearIndividualSearch = async (searchToClear: string) => {
    try {
      const updatedSearches = previousSearches.filter(
        (search) => search !== searchToClear
      );
      await AsyncStorage.setItem(
        "previousSearches",
        JSON.stringify(updatedSearches)
      );
      setPreviousSearches(updatedSearches);
    } catch (error) {
      console.error("Failed to clear search:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={navigation.goBack}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Search..."
          placeholderTextColor="#888"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
        />
        {query ? (
          <TouchableOpacity onPress={handleClearSearch}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleSearch}>
            <Ionicons name="search" size={24} color="white" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={previousSearches}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.searchItemContainer}>
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => handleSelectSearch(item)}
            >
              <Ionicons
                name="sync"
                size={30}
                color="white"
                style={styles.icon}
              />
              <Text style={styles.searchItem}>{item}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => clearIndividualSearch(item)}>
              <Ionicons name="close" size={30} color="white" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.noSearchesText}>No previous searches</Text>
        }
      />
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
  searchItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
  },
  searchItem: {
    color: "white",
  },
  noSearchesText: {
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 10,
  },
});

export default SearchLandingPage;
