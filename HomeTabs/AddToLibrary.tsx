import React, { useState, useRef } from "react";
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
} from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/Ionicons";
import { StackParamList } from "./HomeNav";
import { StackNavigationProp } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

const storeBookData = async (bookData: any) => {
  try {
    const storedData = await AsyncStorage.getItem("libraryBooks");
    let books = storedData ? JSON.parse(storedData) : [];
    books.push(bookData);
    await AsyncStorage.setItem("libraryBooks", JSON.stringify(books));
  } catch (error) {
    console.error("Failed to save data to AsyncStorage", error);
  }
};

type AddToLibraryModalNavigationProp = StackNavigationProp<StackParamList>;
type AddToLibraryModalRouteProp = RouteProp<
  StackParamList,
  "AddToLibraryModal"
>;

const AddToLibraryModal: React.FC = () => {
  const route = useRoute<AddToLibraryModalRouteProp>();
  const navigation = useNavigation<AddToLibraryModalNavigationProp>();
  const { book } = route.params;
  const { title, authors, description, imageLinks } = book.volumeInfo;

  const [loading, setLoading] = useState(true);
  const NoCoverImage = require("../assets/NoCover.jpg");

  const [status, setStatus] = useState("TBR");
  const [format, setFormat] = useState("Digital");
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
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

  const handleAddToLibrary = async () => {
    const bookData = {
      ...book,
      status: status || "TBR",
      format,
      rating,
      review,
      dateAdded: new Date().toISOString(),
    };
    await storeBookData(bookData);
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
            {imageLinks?.thumbnail ? (
              <Image
                source={{ uri: imageLinks.thumbnail }}
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
            <Text style={styles.title}>{title}</Text>
            {authors && (
              <Text style={styles.author}>By {authors.join(", ")}</Text>
            )}
            <View style={styles.descriptionContainer}>
              <Text
                ref={descriptionRef}
                style={styles.description}
                numberOfLines={showFullDescription ? undefined : 6}
                onLayout={handleDescriptionLayout}
              >
                {description}
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
          <View style={styles.picker}>
            <Picker
              selectedValue={status}
              onValueChange={(itemValue) => setStatus(itemValue)}
              style={styles.pickerStyle}
              dropdownIconColor={"#fff"}
              itemStyle={styles.pickerStyle}
            >
              <Picker.Item label="To be Read (TBR)" value="TBR" />
              <Picker.Item label="Currently Reading" value="CurrentlyReading" />
              <Picker.Item label="Finished" value="Finished" />
            </Picker>
          </View>
        </View>
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Format</Text>
          <View style={styles.picker}>
            <Picker
              selectedValue={format}
              onValueChange={(itemValue) => setFormat(itemValue)}
              style={styles.pickerStyle}
              dropdownIconColor={"#fff"}
              itemStyle={styles.pickerStyle}
            >
              <Picker.Item label="Digital" value="Digital" />
              <Picker.Item label="Hardcover" value="Hardcover" />
              <Picker.Item label="Paperback" value="Paperback" />
            </Picker>
          </View>
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
          <Text style={styles.reviewCounter}>{review.length}/150</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddToLibrary}>
          <Text style={styles.addButtonText}>Add to Library</Text>
        </TouchableOpacity>
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
    width: 120,
    height: 180,
    backgroundColor: "#444",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginRight: 16,
  },
  coverImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  author: {
    fontSize: 16,
    fontStyle: "italic",
    color: "lightgrey",
    marginBottom: 8,
  },
  descriptionContainer: {
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: "lightgrey",
  },
  seeMoreButton: {
    marginTop: 8,
  },
  seeMoreText: {
    fontSize: 14,
    color: "#0D6EFD",
  },
  info: {
    fontSize: 14,
    color: "lightgrey",
    marginBottom: 8,
  },
  bold: {
    fontWeight: "bold",
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
    borderRadius: 8,
  },
  pickerStyle: {
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
    padding: 10,
    borderRadius: 8,
    height: 100,
    textAlignVertical: "top",
  },
  reviewCounter: {
    color: "lightgrey",
    textAlign: "right",
    marginTop: 4,
  },
  addButton: {
    backgroundColor: "#089083",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 16,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});

export default AddToLibraryModal;
