import React, { useState, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useDiscoveryData } from '@/hooks/useDiscoveryData';

interface Experience {
  id: string;
  author: string;
  content: string;
  timestamp: number;
  lastUpdated: string;
}

const ExperienceGrid = () => {
  const { data: discordData, isLoading, error } = useDiscoveryData();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Experience;
    direction: 'asc' | 'desc';
  } | null>(null);

  const handleSort = (key: keyof Experience) => {
    setSortConfig(current => ({
      key,
      direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Transform Discord data into Experience format
  const experiences: Experience[] = useMemo(() => {
    if (!discordData) return [];
    
    return discordData.map((item, index) => {
      // You'll need to implement proper parsing logic here based on your Discord message format
      return {
        id: index.toString(),
        author: 'Parse from content', // Parse from item.content
        content: 'Parse from content', // Parse from item.content
        timestamp: 0, // Parse from item.content
        lastUpdated: item.timestamp
      };
    });
  }, [discordData]);

  const sortedData = useMemo(() => {
    let filtered = [...experiences];
    
    if (searchTerm) {
      filtered = filtered.filter(item =>
        Object.values(item).some(value =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (sortConfig) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [experiences, searchTerm, sortConfig]);

  if (isLoading) {
    return <div className="container mx-auto p-4">Loading discovery data...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">Error loading discovery data: {error.message}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search Discovery..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input pl-10"
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-muted">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-secondary">

              <th 
                className="grid-header cursor-pointer"
                onClick={() => handleSort('author')}
              >
                author
              </th>
              <th 
                className="grid-header cursor-pointer"
                onClick={() => handleSort('content')}
              >
                content
              </th>
              <th 
                className="grid-header cursor-pointer text-right"
                onClick={() => handleSort('timestamp')}
              >
                timestamp
              </th>
              <th 
                className="grid-header cursor-pointer"
                onClick={() => handleSort('lastUpdated')}
              >
                Last Updated
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((experience) => (
              <tr key={experience.id} className="hover:bg-muted/50 transition-colors">
                <td className="grid-cell">{experience.author}</td>
                <td className="grid-cell">{experience.content}</td>
                <td className="grid-cell text-right font-mono">{experience.timestamp.toLocaleString()}</td>
                <td className="grid-cell font-mono">{experience.lastUpdated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExperienceGrid;