import { useEffect, useState } from "react";
import axios from "axios";

interface VolumeInfo {
  imageLinks: any;
  averageRating: number | undefined;
  categories: string[] | undefined;
  title: string;
  authors: string[];
  publishedDate: string;
  description: string;
  thumbnail: string;
  industryIdentifiers: {
    type: string;
    identifier: string;
  }[];
  publisher: string;
  pageCount: number;
}

interface BookData {
  items?: { // items is optional
    id: string;
    volumeInfo: VolumeInfo;
  }[];
}

const apiKey = "AIzaSyBLGgXlCtA5nKZ7NuWlhxqmXUgampHB7hc";

const subjects = [
  "biography",
  "music",
  "comics",
  "computers",
  "philosophy",
  "cooking",
  "political",
  "psychology",
  "religion",
  "fiction",
  "language",
  "self-help",
  "history",
  "humor",
  "juvenile",
];

const getRandomSubject = () => {
  return subjects[Math.floor(Math.random() * subjects.length)];
};

export const useFetchBooks = (bookName: string) => {
  const [data, setData] = useState<BookData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get<BookData>(
          `https://www.googleapis.com/books/v1/volumes?q=${bookName}&key=${apiKey}`
        );
        setData(response.data);
      } catch (error) {
        setError("An error occurred while fetching book data.");
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
      let retries = 0;
      const maxRetries = 5; // Maximum number of retries

      while (retries < maxRetries) {
        try {
          const subject = getRandomSubject();
          console.log(subject);
          const response = await axios.get<BookData>(
            `https://www.googleapis.com/books/v1/volumes?q=subject:${subject}&orderBy=relevance&key=${apiKey}`
          );

          // Check if response.data and response.data.items are defined
          if (response.data && response.data.items && response.data.items.length > 0 && response.data.items.length >= 5) {
            setData(response.data);
            break; // Exit loop if data meets criteria
          } else {
            retries += 1; // Increment retry count if data doesn't meet criteria
          }
        } catch (error) {
          setError("An error occurred while fetching popular books.");
          retries += 1; // Increment retry count on error
        }
      }

      if (retries >= maxRetries) {
        setError("Failed to fetch popular books after multiple attempts.");
      }

      setLoading(false);
    };

    fetchPopularBooks();
  }, []);

  return { data, loading, error };
};
