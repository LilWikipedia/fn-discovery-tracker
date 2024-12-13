// src/hooks/useDiscoveryData.ts
import { DiscoveryData } from '@/types/types';
import { useQuery } from '@tanstack/react-query';

export const useDiscoveryData = () => {
  return useQuery({
    queryKey: ['discovery-data'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3001/api/discovery-data');
      if (!response.ok) {
        throw new Error('Failed to fetch discovery data');
      }
      const data: DiscoveryData[] = await response.json();
      return data;
    },
    refetchInterval: 30 * 60 * 1000, // 30 minutes
    retry: 3,
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
  });
};