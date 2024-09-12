import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackParamList } from "./HomeNav";

type SearchPageNavigationProp = StackNavigationProp<StackParamList>;

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState("");
  const [previousSearches, setPreviousSearches] = useState<string[]>([]);
  const navigation = useNavigation<SearchPageNavigationProp>();
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    loadPreviousSearches();
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
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
    const lowerCaseSearch = search.toLowerCase();
    try {
      const updatedSearches = [
        lowerCaseSearch,
        ...previousSearches.filter((s) => s !== lowerCaseSearch),
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
    const lowerCaseSearchToClear = searchToClear.toLowerCase();
    try {
      const updatedSearches = previousSearches.filter(
        (search) => search !== lowerCaseSearchToClear
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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inner}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={navigation.goBack}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <TextInput
            ref={inputRef}
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
                style={styles.searchItemButton}
                onPress={() => handleSelectSearch(item)}
              >
                <View style={styles.iconContainer}>
                  <Ionicons
                    name="sync"
                    size={30}
                    color="white"
                    style={styles.icon}
                  />
                  <Text style={styles.searchItem}>{item}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteIcon}
                onPress={() => clearIndividualSearch(item)}
              >
                <Ionicons name="close" size={30} color="white" />
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.noSearchesText}>No previous searches</Text>
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D1117",
  },
  inner: {
    flex: 1,
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
  searchItemButton: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  searchItem: {
    color: "white",
    marginLeft: 10,
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
  deleteIcon: {
    marginLeft: 10,
  },
  icon: {
    marginRight: 10,
  },
});

export default SearchPage;
