import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { Picker } from '@react-native-picker/picker';
import Icon from "react-native-vector-icons/Ionicons";
import { StackParamList } from "./LibraryNav";
import { StackNavigationProp } from "@react-navigation/stack";
import AsyncStorage from '@react-native-async-storage/async-storage';

const updateBookData = async (updatedBook: any) => {
  try {
    const storedData = await AsyncStorage.getItem('libraryBooks');
    let books = storedData ? JSON.parse(storedData) : [];
    const bookIndex = books.findIndex((book: any) => book.id === updatedBook.id);
    
    if (bookIndex !== -1) {
      books[bookIndex] = updatedBook;
      await AsyncStorage.setItem('libraryBooks', JSON.stringify(books));
    }
  } catch (error) {
    console.error("Failed to update data in AsyncStorage", error);
  }
};

const deleteBookData = async (bookId: string) => {
  try {
    const storedData = await AsyncStorage.getItem('libraryBooks');
    let books = storedData ? JSON.parse(storedData) : [];
    books = books.filter((book: any) => book.id !== bookId);
    await AsyncStorage.setItem('libraryBooks', JSON.stringify(books));
  } catch (error) {
    console.error("Failed to delete data from AsyncStorage", error);
  }
};

type EditBookModalNavigationProp = StackNavigationProp<StackParamList>;
type EditBookModalRouteProp = RouteProp<StackParamList, "EditBookModal">;

const EditBookModal: React.FC = () => {
  const route = useRoute<EditBookModalRouteProp>();
  const navigation = useNavigation<EditBookModalNavigationProp>();
  const { book } = route.params;

  const [loading, setLoading] = useState(true);
  const NoCoverImage = require("../assets/NoCover.jpg");

  const [status, setStatus] = useState(book.status || "To be Read (TBR)");
  const [format, setFormat] = useState(book.format || "Digital");
  const [rating, setRating] = useState(book.rating || 0);
  const [review, setReview] = useState(book.review || "");
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const descriptionRef = useRef<Text>(null);

  const handleRatingPress = (star: number) => {
    setRating(star);
  };

  const handleDescriptionLayout = (event: any) => {
    if (event && event.nativeEvent && event.nativeEvent.lines) {
      const { lines } = event.nativeEvent;
      if (lines && lines.length > 5) {
        setIsTruncated(true);
      }
    }
  };

  const handleUpdateBook = async () => {
    const updatedBook = {
      ...book,
      status,
      format,
      rating,
      review,
    };
    await updateBookData(updatedBook);
    Alert.alert("Success", "Book updated.");
    navigation.goBack();
  };

  const confirmDeleteBook = () => {
    Alert.alert(
      "Confirm Book Removal",
      "Are you sure you want to remove this book from your library?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: handleDeleteBook },
      ],
      { cancelable: false }
    );
  };

  const handleDeleteBook = async () => {
    await deleteBookData(book.id);
    Alert.alert("Success", "Book removed from library.");
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back" size={24} color="white" />
        <Text style={styles.headerTitle}>Back</Text>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.mainContainer}>
          <View style={styles.coverImageContainer}>
            {loading && <ActivityIndicator size="small" color="#0000ff" />}
            {book.volumeInfo.imageLinks?.thumbnail ? (
              <Image
                source={{ uri: book.volumeInfo.imageLinks.thumbnail }}
                style={styles.coverImage}
                onLoad={() => setLoading(false)}
                onError={() => setLoading(false)}
              />
            ) : (
              <Image
                source={NoCoverImage}
                style={styles.coverImage}
                onLoad={() => setLoading(false)}
                onError={() => setLoading(false)}
              />
            )}
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.title}>{book.volumeInfo.title}</Text>
            {book.volumeInfo.authors && (
              <Text style={styles.author}>
                By {book.volumeInfo.authors.join(", ")}
              </Text>
            )}
            <View style={styles.descriptionContainer}>
              <Text
                ref={descriptionRef}
                style={styles.description}
                numberOfLines={showFullDescription ? undefined : 6}
                onLayout={handleDescriptionLayout}
              >
                {book.volumeInfo.description}
              </Text>
              {isTruncated && (
                <TouchableOpacity
                  style={styles.seeMoreButton}
                  onPress={() => setShowFullDescription(!showFullDescription)}
                >
                  <Text style={styles.seeMoreText}>
                    {showFullDescription ? "See less" : "See more"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Status</Text>
          <Picker
            selectedValue={status}
            onValueChange={(itemValue) => setStatus(itemValue)}
            style={styles.picker}
            dropdownIconColor={'#fff'}
            itemStyle={styles.picker}
          >
            <Picker.Item label="To be Read (TBR)" value="TBR" />
            <Picker.Item label="Currently Reading" value="CurrentlyReading" />
            <Picker.Item label="Finished" value="Finished" />
          </Picker>
        </View>

        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Format</Text>
          <Picker
            selectedValue={format}
            onValueChange={(itemValue) => setFormat(itemValue)}
            style={styles.picker}
            dropdownIconColor={'#fff'}
            itemStyle={styles.picker}
          >
            <Picker.Item label="Digital" value="Digital" />
            <Picker.Item label="Hardcover" value="Hardcover" />
            <Picker.Item label="Paperback" value="Paperback" />
          </Picker>
        </View>

        <View style={styles.ratingContainer}>
          <Text style={styles.pickerLabel}>Rating</Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => handleRatingPress(star)}
              >
                <Icon
                  name={star <= rating ? "star" : "star-outline"}
                  size={24}
                  color="#D4AF37"
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Review */}
        <View style={styles.reviewContainer}>
          <Text style={styles.pickerLabel}>Review</Text>
          <TextInput
            style={styles.textArea}
            value={review}
            onChangeText={setReview}
            placeholder="Write your review"
            placeholderTextColor="lightgrey"
            multiline
            maxLength={150}
          />
          <Text style={styles.reviewCounter}>
            {review.length}/150
          </Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.updateButton}
            onPress={handleUpdateBook}
          >
            <Text style={styles.buttonText}>Update Book</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={confirmDeleteBook}
          >
            <Text style={styles.buttonText}>Remove Book</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    padding: 16,
    backgroundColor: "#0D1117",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginLeft: 10,
  },
  content: {
    padding: 16,
  },
  mainContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  coverImageContainer: {
    flex: 1,
    marginRight: 16,
  },
  coverImage: {
    width: "100%",
    height: 180,
    resizeMode: "cover"
  },
  infoContainer: {
    flex: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  author: {
    fontSize: 16,
    fontStyle: "italic",
    color: "lightgrey",
    marginBottom: 12,
  },
  descriptionContainer: {
    marginTop: 8,
  },
  description: {
    fontSize: 14,
    color: "lightgrey",
  },
  seeMoreButton: {
    marginTop: 4,
  },
  seeMoreText: {
    fontSize: 14,
    color: "#1D9BF0",
  },
  pickerContainer: {
    marginBottom: 16,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  picker: {
    backgroundColor: "#161B22",
    color: "white",
  },
  ratingContainer: {
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: "row",
  },
  reviewContainer: {
    marginBottom: 16,
  },
  textArea: {
    backgroundColor: "#161B22",
    color: "#fff",
    padding: 12,
    borderRadius: 8,
    textAlignVertical: "top",
    height: 100,
  },
  reviewCounter: {
    color: "#A1A1A1",
    textAlign: "right",
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  updateButton: {
    flex: 1,
    backgroundColor: "#089083",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 8,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#F85149",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});


export default EditBookModal;
