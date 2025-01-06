import axios from 'axios';
import * as cheerio from 'cheerio';
import { useEffect, useState } from 'react';

interface Experience {
  id: string;
  islandcode: string;
  islandtitle: string;
  players: number;
  lastUpdated: string;
}

interface FetchDiscoveryResult {
  data: Experience[] | null;
  isLoading: boolean;
  error: Error | null;
}

export function useFetchDiscovery(): FetchDiscoveryResult {
  const [data, setData] = useState<Experience[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/discover');
        const html = response.data;
        const $ = cheerio.load(html); // Load HTML with Cheerio

        const experiences: Experience[] = [];
        $('a[href^="/island?code="]').each((index, element) => {
          const islandcode = $(element).attr('href')?.split('=')[1] || '';
          const islandtitle = $(element).find('.island-title').text().trim() || '';
          const playersText = $(element).find('.players').text().trim() || '0';
          const players = parseInt(playersText.replace(/,/g, ''), 10);
          const lastUpdated = new Date().toISOString();

          experiences.push({
            id: String(index),
            islandcode,
            islandtitle,
            players: isNaN(players) ? 0 : players,
            lastUpdated,
          });
        });

        setData(experiences);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch discovery data'));
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading, error };
}
