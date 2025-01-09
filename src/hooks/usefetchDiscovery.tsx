import { useState, useEffect } from 'react';


interface Experience {
  
  islandtitle: string;
  players: number;
  
}

export const FetchDiscovery = () => {
  const [data, setData] = useState<Experience[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchDiscoveryData = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/discovery'); // Backend API URL
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiscoveryData();
  }, []);

  return { data, isLoading, error };
};
