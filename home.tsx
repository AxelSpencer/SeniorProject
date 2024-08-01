import React from 'react';
import { View, Text, Image, ActivityIndicator, Alert, FlatList, StyleSheet } from 'react-native';
import { useFetchPopularBooks } from './useFetch'; // Adjust the import path as needed
import Icon from 'react-native-vector-icons/Ionicons'; // Use Ionicons for star icons

const BookList: React.FC = () => {
    const { data, loading, error } = useFetchPopularBooks();

    if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
    if (error) {
        Alert.alert('Error', error);
        return null;
    }

    const renderRating = (rating: number | undefined) => {
        if (rating === undefined) {
            // Render a "No Rating" icon
            return (
                <Icon name="star-outline" size={20} color="#6c757d" />
            );
        }

        // Number of stars to show
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
                    <Icon key={`empty-${index}`} name="star-outline" size={20} color="#D4AF37" />
                ))}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {data && data.items.length > 0 ? (
                <FlatList
                    data={data.items}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.bookContainer}>
                            {item.volumeInfo.imageLinks?.thumbnail && (
                                <Image
                                    source={{ uri: item.volumeInfo.imageLinks.thumbnail }}
                                    style={styles.coverImage}
                                />
                            )}
                            <View style={styles.bookInfo}>
                                <Text style={styles.title}>{item.volumeInfo.title}</Text>
                                {item.volumeInfo.authors.length > 0 && (
                                    <Text style={styles.author}>{item.volumeInfo.authors.join(', ')}</Text>
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
                        </View>
                    )}
                />
            ) : (
                <Text>No books found.</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#0D1117"
    },
    bookContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        backgroundColor: "#181C24",
        padding: 8,
        borderRadius: 8,
    },
    coverImage: {
        width: 100,
        height: 150,
        margin: 8,
    },
    bookInfo: {
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        color: "white"
    },
    author: {
        fontSize: 14,
        marginBottom: 8,
        color: "white"
    },
    ratingWrapper: {
        flexDirection: 'row',
        marginTop: 40,
    },
    ratingContainer: {
        flexDirection: 'row',
    },
    genresContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
    },
    genreBubble: {
        backgroundColor: '#089083',
        borderRadius: 12,
        paddingVertical: 4,
        paddingHorizontal: 8,
        marginRight: 8,
    },
    genreText: {
        color: 'white',
        fontSize: 14,
    },
});

export default BookList;
