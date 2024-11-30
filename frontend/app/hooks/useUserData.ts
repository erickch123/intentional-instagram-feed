import { useState, useEffect } from 'react';

export interface Category {
  id: string;
  name: string;
}

interface Following {
  username: string;
  full_name: string;
  categories: Category[];
  description: string;
}

interface User {
  _id: string;
  name: string;
  username: string;
  followings: Following[];
  categories: Category[];
}

const apiurl = "http://localhost:5000";

export const useUserData = (username: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${apiurl}/users/${username}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
          } 
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [username]);

  return { user, loading, error, setUser };
};
