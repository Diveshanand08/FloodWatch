import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface WeatherData {
  location: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  rainfall: number;
  description: string;
  icon: string;
  pressure: number;
  visibility: number;
  clouds: number;
  timestamp: string;
  forecast: ForecastItem[];
  fallback?: boolean;
  error?: string;
}

export interface ForecastItem {
  time: string;
  temperature: number;
  rainfall: number;
  description: string;
  icon: string;
}

interface LocationParams {
  lat?: number;
  lon?: number;
  location?: string;
}

export const useWeatherData = (params?: LocationParams) => {
  return useQuery({
    queryKey: ['weather', params?.lat, params?.lon, params?.location],

    queryFn: async (): Promise<WeatherData> => {
      const queryParams = new URLSearchParams();

      if (params?.lat) queryParams.set('lat', params.lat.toString());
      if (params?.lon) queryParams.set('lon', params.lon.toString());
      if (params?.location) queryParams.set('location', params.location);

      const queryString = queryParams.toString();

      const { data, error } = await supabase.functions.invoke(
        queryString ? `weather?${queryString}` : 'weather',
        {
          method: 'GET',
          headers: {
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY, // ✅ REQUIRED
          },
        }
      );

      if (error) throw new Error(error.message);
      return data as WeatherData;
    },

    refetchInterval: 5 * 60 * 1000,
    staleTime: 0,
  });
};
