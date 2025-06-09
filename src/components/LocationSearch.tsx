
import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from './ui/command';

interface LocationSearchProps {
  onLocationSelect: (lat: number, lng: number, placeName: string) => void;
}

interface SearchResult {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  importance: number;
}

const LocationSearch: React.FC<LocationSearchProps> = ({ onLocationSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();

  const searchLocation = async (query: string) => {
    // Don't search if we're in the middle of selecting a location
    if (isSelecting) return;
    
    // Require at least 2 characters for search (reduced from 3)
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);
    try {
      // Enhanced search with multiple queries for comprehensive results
      const searchQueries = [
        // Primary search with the exact query
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=12&countrycodes=th&addressdetails=1&accept-language=th,en&namedetails=1&extratags=1&dedupe=1`,
        
        // Search with administrative areas (provinces, districts, cities)
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=8&countrycodes=th&addressdetails=1&accept-language=th,en&namedetails=1&extratags=1&featuretype=city,state,county&dedupe=1`,
        
        // Search with tourism and landmark places
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=8&countrycodes=th&addressdetails=1&accept-language=th,en&namedetails=1&extratags=1&featuretype=settlement&dedupe=1`
      ];

      // Execute all search queries concurrently
      const responses = await Promise.all(
        searchQueries.map(url => fetch(url).then(res => res.json()))
      );

      // Combine and deduplicate results
      const allResults: SearchResult[] = [];
      const seenPlaceIds = new Set<string>();

      responses.forEach(data => {
        data.forEach((result: SearchResult) => {
          if (!seenPlaceIds.has(result.place_id) && result.display_name && result.lat && result.lon) {
            seenPlaceIds.add(result.place_id);
            allResults.push(result);
          }
        });
      });

      // Enhanced filtering and sorting
      const filteredResults = allResults
        .filter((result: SearchResult) => {
          // Filter out very low importance results unless they match closely
          const queryLower = query.toLowerCase();
          const nameLower = result.display_name.toLowerCase();
          
          // Always include if name starts with the query
          if (nameLower.includes(queryLower)) {
            return true;
          }
          
          // Include high importance results
          return result.importance > 0.1;
        })
        .sort((a, b) => {
          const queryLower = query.toLowerCase();
          
          // Prioritize exact matches at the beginning
          const aStartsWith = a.display_name.toLowerCase().startsWith(queryLower);
          const bStartsWith = b.display_name.toLowerCase().startsWith(queryLower);
          
          if (aStartsWith && !bStartsWith) return -1;
          if (!aStartsWith && bStartsWith) return 1;
          
          // Then prioritize by importance
          return (b.importance || 0) - (a.importance || 0);
        })
        .slice(0, 15); // Limit to top 15 results

      setSuggestions(filteredResults);
      setShowSuggestions(filteredResults.length > 0);
      
      console.log(`Found ${filteredResults.length} location suggestions for: "${query}"`);
    } catch (error) {
      console.error('Error searching location:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Reduced debounce delay for faster response
    debounceTimeoutRef.current = setTimeout(() => {
      searchLocation(searchQuery);
    }, 300);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchQuery, isSelecting]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Reset selecting state when user starts typing again
    if (isSelecting) {
      setIsSelecting(false);
    }
    
    setSearchQuery(value);
    
    // Show loading state immediately if we have 2+ characters
    if (value.length >= 2) {
      setIsLoading(true);
    }
  };

  const handleLocationSelect = (suggestion: SearchResult) => {
    const lat = parseFloat(suggestion.lat);
    const lng = parseFloat(suggestion.lon);
    
    // Set selection state to prevent further searches
    setIsSelecting(true);
    
    // Clear the search query and hide suggestions immediately
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    setIsLoading(false);
    
    onLocationSelect(lat, lng, suggestion.display_name);
    
    console.log(`Selected location: ${suggestion.display_name} (${lat}, ${lng})`);
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0 && searchQuery.length >= 2 && !isSelecting) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow for click events
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  const getLocationTypeIcon = (suggestion: SearchResult) => {
    const type = suggestion.type?.toLowerCase() || '';
    const displayName = suggestion.display_name?.toLowerCase() || '';
    
    // Determine icon based on location type
    if (type.includes('city') || type.includes('town') || type.includes('village') || 
        displayName.includes('จังหวัด') || displayName.includes('เมือง') || displayName.includes('อำเภอ')) {
      return '🏙️';
    } else if (type.includes('tourism') || displayName.includes('วัด') || displayName.includes('อุทยาน')) {
      return '🏛️';
    } else {
      return '📍';
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="ค้นหาสถานที่ในประเทศไทย..."
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          className="pl-10 pr-4 bg-white border-gray-300 focus:border-medical-blue focus:ring-medical-blue"
        />
      </div>

      {/* Show minimum character requirement hint */}
      {searchQuery.length > 0 && searchQuery.length < 2 && !isSelecting && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-3 text-center">
          <span className="text-sm text-gray-500">
            พิมพ์อย่างน้อย 2 ตัวอักษรเพื่อค้นหาสถานที่
          </span>
        </div>
      )}

      {/* Loading state */}
      {isLoading && searchQuery.length >= 2 && !isSelecting && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-medical-blue"></div>
            <span className="text-sm text-gray-500">กำลังค้นหาสถานที่...</span>
          </div>
        </div>
      )}

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && !isLoading && !isSelecting && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-80 overflow-auto">
          <div className="p-2 border-b border-gray-100">
            <span className="text-xs text-gray-500">
              พบ {suggestions.length} สถานที่ที่เกี่ยวข้อง
            </span>
          </div>
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.place_id}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-start gap-3 border-b border-gray-100 last:border-b-0 transition-colors"
              onClick={() => handleLocationSelect(suggestion)}
            >
              <span className="text-lg flex-shrink-0 mt-0.5">
                {getLocationTypeIcon(suggestion)}
              </span>
              <div className="flex-1 min-w-0">
                <span className="text-sm text-gray-900 line-clamp-2 leading-relaxed">
                  {suggestion.display_name}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No results message */}
      {showSuggestions && suggestions.length === 0 && !isLoading && searchQuery.length >= 2 && !isSelecting && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">ไม่พบสถานที่ที่ตรงกับ "{searchQuery}"</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            ลองค้นหาด้วยคำอื่นหรือตรวจสอบการสะกดอีกครั้ง
          </p>
        </div>
      )}
    </div>
  );
};

export default LocationSearch;