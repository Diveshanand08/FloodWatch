import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WeatherResponse {
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
}

interface ForecastItem {
  time: string;
  temperature: number;
  rainfall: number;
  description: string;
  icon: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('OPENWEATHERMAP_API_KEY');
    
    if (!apiKey) {
      throw new Error('OpenWeatherMap API key not configured');
    }

    const url = new URL(req.url);
    const lat = url.searchParams.get('lat') || '28.6139'; // Delhi default
    const lon = url.searchParams.get('lon') || '77.2090';
    const location = url.searchParams.get('location') || 'Delhi';

    // Fetch current weather
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const currentRes = await fetch(currentWeatherUrl);
    
    if (!currentRes.ok) {
      const errorText = await currentRes.text();
      throw new Error(`Weather API error: ${currentRes.status} - ${errorText}`);
    }
    
    const currentData = await currentRes.json();

    // Fetch 5-day forecast (3-hour intervals)
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&cnt=8`;
    const forecastRes = await fetch(forecastUrl);
    
    if (!forecastRes.ok) {
      const errorText = await forecastRes.text();
      throw new Error(`Forecast API error: ${forecastRes.status} - ${errorText}`);
    }
    
    const forecastData = await forecastRes.json();

    // Calculate rainfall (from rain volume if available)
    const rainfall = currentData.rain?.['1h'] || currentData.rain?.['3h'] || 0;

    // Format forecast
    const forecast: ForecastItem[] = forecastData.list.map((item: any) => ({
      time: new Date(item.dt * 1000).toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }),
      temperature: Math.round(item.main.temp),
      rainfall: item.rain?.['3h'] || 0,
      description: item.weather[0].description,
      icon: item.weather[0].icon,
    }));

    const response: WeatherResponse = {
      location: location,
      temperature: Math.round(currentData.main.temp),
      humidity: currentData.main.humidity,
      windSpeed: Math.round(currentData.wind.speed * 3.6), // Convert m/s to km/h
      rainfall: rainfall,
      description: currentData.weather[0].description,
      icon: currentData.weather[0].icon,
      pressure: currentData.main.pressure,
      visibility: Math.round((currentData.visibility || 10000) / 1000), // Convert to km
      clouds: currentData.clouds.all,
      timestamp: new Date().toISOString(),
      forecast,
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Weather API error:', errorMessage);
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        // Return simulated data as fallback
        fallback: true,
        location: 'Delhi',
        temperature: 28,
        humidity: 89,
        windSpeed: 24,
        rainfall: 42,
        description: 'moderate rain',
        icon: '10d',
        pressure: 1008,
        visibility: 5,
        clouds: 75,
        timestamp: new Date().toISOString(),
        forecast: [
          { time: '3:00 PM', temperature: 28, rainfall: 15, description: 'light rain', icon: '10d' },
          { time: '6:00 PM', temperature: 26, rainfall: 25, description: 'moderate rain', icon: '10n' },
          { time: '9:00 PM', temperature: 24, rainfall: 35, description: 'heavy rain', icon: '10n' },
          { time: '12:00 AM', temperature: 23, rainfall: 20, description: 'moderate rain', icon: '10n' },
        ],
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
