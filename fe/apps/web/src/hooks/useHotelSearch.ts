import { HotelRequest, HotelsResponse, Property } from '@/types/hotels.type';
import { useState, useCallback } from 'react';

interface UseHotelSearchReturn {
  hotels: Property[];
  loading: boolean;
  error: string | null;
  searchHotels: (request: Partial<HotelRequest>) => Promise<void>;
  nextPageToken?: string;
  loadMore: () => Promise<void>;
}

export function useHotelSearch(): UseHotelSearchReturn {
  const [hotels, setHotels] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>();
  const [lastRequest, setLastRequest] = useState<Partial<HotelRequest> | null>(null);

  const searchHotels = useCallback(async (request: Partial<HotelRequest>) => {
    setLoading(true);
    setError(null);
    setLastRequest(request);
    
    try {
      const response = await fetch('/api/hotels/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Search failed');
      }
      
      const data: HotelsResponse = await response.json();
      
      setHotels(data.properties || []);
      setNextPageToken(data.serpapi_pagination?.next_page_token || undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (!nextPageToken || !lastRequest || loading) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/hotels/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...lastRequest,
          next_page_token: nextPageToken,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Load more failed');
      }
      
      const data: HotelsResponse = await response.json();
      
      setHotels(prev => [...prev, ...(data.properties || [])]);
      setNextPageToken(data.serpapi_pagination?.next_page_token || undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [nextPageToken, lastRequest, loading]);

  return {
    hotels,
    loading,
    error,
    searchHotels,
    nextPageToken,
    loadMore,
  };
}