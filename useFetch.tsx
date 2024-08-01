import { useEffect, useState } from 'react';
import axios from 'axios';
import React from 'react';

interface VolumeInfo {
    title: string;
    authors: string[];
    publishedDate: string;
    description: string;
    thumbnail: string;
}

interface BookData {
    items: {
        id: string;
        volumeInfo: VolumeInfo;
    }[];
}

const apiKey = 'AIzaSyBLGgXlCtA5nKZ7NuWlhxqmXUgampHB7hc';

export const useFetchBooks = (bookName: string) => {
    const [data, setData] = useState<BookData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | undefined>(undefined);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get<BookData>(`https://www.googleapis.com/books/v1/volumes?q=${bookName}&key=${apiKey}`);
                setData(response.data);
            } catch (error) {
                setError('An error occurred while fetching book data.');
            } finally {
                setLoading(false);
            }
        };

        if (bookName) {
            fetchBooks();
        }
    }, [bookName]);

    return { data, loading, error };
};

export const useFetchPopularBooks = () => {
    const [data, setData] = useState<BookData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | undefined>(undefined);

    useEffect(() => {
        const fetchPopularBooks = async () => {
            try {
                // Example query to fetch popular books in a specific category
                const response = await axios.get<BookData>(`https://www.googleapis.com/books/v1/volumes?q=subject:fiction&orderBy=relevance&key=${apiKey}`);
                setData(response.data);
            } catch (error) {
                setError('An error occurred while fetching popular books.');
            } finally {
                setLoading(false);
            }
        };

        fetchPopularBooks();
    }, []);

    return { data, loading, error };
};