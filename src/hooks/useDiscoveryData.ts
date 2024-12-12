// src/hooks/useDiscoveryData.ts
import { DiscoveryData } from '@/types/types';
import { useQuery } from '@tanstack/react-query';

export const useDiscoveryData = () => {
  return useQuery({
    queryKey: ['discovery-data'],
    queryFn: async () => {
      // Assuming you'll create an API endpoint that serves the exported JSON
      const response = await fetch('/api/discovery-data');
      if (!response.ok) {
        throw new Error('Failed to fetch discovery data');
      }
      const data: DiscoveryData[] = await response.json();
      return data;
    },
    // Refresh every 5 minutes
    refetchInterval: 30 * 60 * 1000,
  });
};
