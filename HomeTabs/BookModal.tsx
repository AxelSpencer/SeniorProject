import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  LayoutChangeEvent,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";
import { StackParamList } from "./HomeNav";
import Icon from "react-native-vector-icons/Ionicons";

const NoCoverImage = require("../assets/NoCover.jpg");

type BookModalRouteProp = RouteProp<StackParamList, "BookModal">;

const BookModal: React.FC = () => {
  const route = useRoute<BookModalRouteProp>();
  const navigation = useNavigation();

  const { book } = route.params;
  const {
    title,
    authors,
    categories,
    description,
    publishedDate,
    averageRating,
    imageLinks,
    industryIdentifiers,
    publisher,
    pageCount,
  } = book.volumeInfo;

  const [loading, setLoading] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const descriptionRef = useRef<Text>(null);

  const handleDescriptionLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    // Assuming 5 lines of text approximately equals 80 units of height
    // Adjust this value based on your text styling and font size
    const truncatedHeight = 80; 

    if (height > truncatedHeight) {
      setIsTruncated(true);
    } else {
      setIsTruncated(false);
    }
  };

  const renderRating = (rating: number | undefined) => {
    if (rating === undefined) {
      return "Rating: Not available";
    }

    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingText}>
          <Text style={styles.bold}>Rating:</Text> {rating}
          {[...Array(fullStars)].map((_, index) => (
            <Icon key={`full-${index}`} name="star" size={14} color="#D4AF37" />
          ))}
          {halfStar && <Icon name="star-half" size={14} color="#D4AF37" />}
          {[...Array(emptyStars)].map((_, index) => (
            <Icon
              key={`empty-${index}`}
              name="star-outline"
              size={14}
              color="#D4AF37"
            />
          ))}
        </Text>
      </View>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString(undefined, options);
  };

  const getISBNs = (identifiers: { type: string; identifier: string }[]) => {
    const isbn13 = identifiers.find((id) => id.type === "ISBN_13")?.identifier;
    const isbn10 = identifiers.find((id) => id.type === "ISBN_10")?.identifier;
    return { isbn13, isbn10 };
  };

  const { isbn13, isbn10 } = getISBNs(industryIdentifiers || []);

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
        <Text style={styles.title}>{title}</Text>
        {authors && <Text style={styles.author}>{authors.join(", ")}</Text>}
        <View style={styles.separator} />
        <View style={styles.descriptionContainer}>
          <Text
            ref={descriptionRef}
            style={styles.description}
            numberOfLines={showFullDescription ? undefined : 5}
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
        <View style={styles.separator} />
        <Text style={styles.info}>
          <Text style={styles.bold}>Published:</Text>{" "}
          {formatDate(publishedDate)}
        </Text>
        <Text style={styles.info}>
          <Text style={styles.bold}>Publisher:</Text> {publisher}
        </Text>
        <Text style={styles.info}>
          <Text style={styles.bold}>Page Count:</Text> {pageCount}
        </Text>
        {isbn13 && (
          <Text style={styles.info}>
            <Text style={styles.bold}>ISBN-13:</Text> {isbn13}
          </Text>
        )}
        {isbn10 && (
          <Text style={styles.info}>
            <Text style={styles.bold}>ISBN-10:</Text> {isbn10}
          </Text>
        )}
        {categories && (
          <Text style={styles.info}>
            <Text style={styles.bold}>Categories:</Text> {categories.join(", ")}
          </Text>
        )}
        <Text style={styles.ratingWrapper}>{renderRating(averageRating)}</Text>
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
  coverImageContainer: {
    width: 150,
    height: 200,
    alignSelf: "center",
    marginBottom: 16,
    position: "relative",
  },
  coverImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
    textAlign: "center",
  },
  author: {
    fontSize: 18,
    color: "white",
    marginBottom: 8,
    textAlign: "center",
  },
  descriptionContainer: {
    marginVertical: 8,
  },
  description: {
    fontSize: 16,
    color: "white",
    textAlign: "justify",
  },
  seeMoreButton: {
    marginTop: 8,
    alignItems: "flex-end",
  },
  seeMoreText: {
    fontSize: 16,
    color: "lightgrey",
  },
  info: {
    fontSize: 14,
    color: "white",
    marginTop: 8,
    textAlign: "left",
  },
  ratingWrapper: {
    marginTop: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 14,
    color: "white",
  },
  bold: {
    fontWeight: "bold",
  },
  separator: {
    height: 1,
    backgroundColor: "white",
    marginVertical: 8,
  },
});

export default BookModal;
