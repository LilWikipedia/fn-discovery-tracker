
import axios from 'axios';
import { JSDOM } from 'jsdom';
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
        const response = await axios.get('https://fortnite.gg/discover');
        const html = response.data;
        const dom = new JSDOM(html);
        const document = dom.window.document;

        const experiences: Experience[] = [];
        const islandElements = document.querySelectorAll('a[href^="/island?code="]');

        islandElements.forEach((element, index) => {
          const islandcode = element.getAttribute('href')?.split('=')[1] || '';
          const islandtitle = element.querySelector('.island-title')?.textContent?.trim() || '';
          const playersElement = element.querySelector('.players');
          const playersText = playersElement?.textContent?.trim() || '0';
          const players = parseInt(playersText.replace(/,/g, ''), 10);
          const lastUpdated = new Date().toISOString();

          experiences.push({
            id: String(index),
            islandcode,
            islandtitle,
            players: isNaN(players) ? 0 : players,
            lastUpdated
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
