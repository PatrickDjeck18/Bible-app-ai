import { useState, useMemo } from 'react';
import { Prayer } from '@/lib/types';

interface UsePrayerFiltersProps {
  prayers: Prayer[];
}

interface UsePrayerFiltersResult {
  selectedStatus: string;
  selectedCategory: string;
  selectedPriority: string;
  searchQuery: string;
  filteredPrayers: Prayer[];
  setSelectedStatus: (status: string) => void;
  setSelectedCategory: (category: string) => void;
  setSelectedPriority: (priority: string) => void;
  setSearchQuery: (query: string) => void;
}

const usePrayerFilters = ({ prayers }: UsePrayerFiltersProps): UsePrayerFiltersResult => {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPrayers = useMemo(() => {
    let filtered = prayers;

    // Apply status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(p => p.status === selectedStatus);
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Apply priority filter
    if (selectedPriority !== 'all') {
      filtered = filtered.filter(p => p.priority === selectedPriority);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [prayers, selectedStatus, selectedCategory, selectedPriority, searchQuery]);

  return {
    selectedStatus,
    selectedCategory,
    selectedPriority,
    searchQuery,
    filteredPrayers,
    setSelectedStatus,
    setSelectedCategory,
    setSelectedPriority,
    setSearchQuery,
  };
};

export default usePrayerFilters;