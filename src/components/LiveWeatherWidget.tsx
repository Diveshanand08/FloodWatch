import { Cloud, Droplets, Wind, Eye, Gauge, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useWeatherData } from '@/hooks/useWeatherData';
import { deriveMCDMetrics } from "@/utils/deriveMCDMetrics";
import { FloodContext } from "@/hooks/useFloodContext";

const getWeatherIcon = (iconCode: string) =>
  `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

const getIntensityLevel = (rainfall: number) => {
  if (rainfall >= 60) return { label: 'Extreme', variant: 'critical' as const };
  if (rainfall >= 45) return { label: 'Heavy', variant: 'high' as const };
  if (rainfall >= 30) return { label: 'Moderate', variant: 'moderate' as const };
  if (rainfall > 0) return { label: 'Light', variant: 'low' as const };
  return { label: 'None', variant: 'default' as const };
};

const LiveWeatherWidget = () => {
  const { data, isLoading, error, refetch, isFetching } = useWeatherData();

  /* ---------- LOADING ---------- */
  if (isLoading) {
    return (
      <div className="glass-card p-6">
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  /* ---------- ERROR ---------- */
  if (error || !data) {
    return (
      <div className="glass-card p-6 text-center">
        <h2 className="text-lg font-semibold">Live Weather</h2>
        <p className="text-warning mt-2">
          Live weather unavailable
        </p>
        <Button className="mt-4" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  /* ---------- REAL DATA ONLY ---------- */
  const intensity = getIntensityLevel(data.rainfall);
  const mcdMetrics = deriveMCDMetrics(data.rainfall);

  return (
    <FloodContext.Provider
      value={{
        rainfall: data.rainfall,
        drainCapacityUsed: mcdMetrics.drainCapacityUsed,
        riskLevel: mcdMetrics.riskLevel,
        pumpLoad: mcdMetrics.pumpLoad,
      }}
    >
      <div className="glass-card p-6">
        {/* Header */}
        <div className="flex justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold">Live Weather</h2>
            <p className="text-sm text-muted-foreground">
              {data.location} • Real-time
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={intensity.variant}>{intensity.label}</Badge>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RefreshCw className={isFetching ? "animate-spin" : ""} />
            </Button>
          </div>
        </div>

        {/* Main Weather */}
        <div className="text-center mb-6">
          <img
            src={getWeatherIcon(data.icon)}
            alt={data.description}
            className="mx-auto w-16"
          />
          <h1 className="text-4xl font-bold">{data.temperature}°C</h1>
          <p className="capitalize text-muted-foreground">
            {data.description}
          </p>

          {data.rainfall > 0 && (
            <p className="mt-2 text-primary font-semibold">
              {data.rainfall} mm/hr rainfall
            </p>
          )}
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-secondary/20 text-center">
            <Wind className="mx-auto mb-1 w-4 h-4 text-muted-foreground" />
            <p className="text-sm font-semibold">{data.windSpeed}</p>
            <p className="text-xs text-muted-foreground">km/h Wind</p>
          </div>

          <div className="p-4 rounded-xl bg-secondary/20 text-center">
            <Droplets className="mx-auto mb-1 w-4 h-4 text-muted-foreground" />
            <p className="text-sm font-semibold">{data.humidity}%</p>
            <p className="text-xs text-muted-foreground">Humidity</p>
          </div>

          <div className="p-4 rounded-xl bg-secondary/20 text-center">
            <Gauge className="mx-auto mb-1 w-4 h-4 text-muted-foreground" />
            <p className="text-sm font-semibold">{data.pressure}</p>
            <p className="text-xs text-muted-foreground">hPa Pressure</p>
          </div>

          <div className="p-4 rounded-xl bg-secondary/20 text-center">
            <Eye className="mx-auto mb-1 w-4 h-4 text-muted-foreground" />
            <p className="text-sm font-semibold">{data.visibility} km</p>
            <p className="text-xs text-muted-foreground">Visibility</p>
          </div>
        </div>

        {/* Forecast */}
        {data.forecast?.length > 0 && (
          <>
            <h3 className="text-sm font-semibold mt-6 mb-3">
              Upcoming Hours
            </h3>

            <div className="flex gap-3 overflow-x-auto pb-2">
              {data.forecast.map((item, i) => (
                <div
                  key={i}
                  className="min-w-[90px] bg-secondary/20 rounded-xl p-3 text-center"
                >
                  <p className="text-xs text-muted-foreground">
                    {item.time}
                  </p>

                  <img
                    src={getWeatherIcon(item.icon)}
                    alt={item.description}
                    className="w-6 mx-auto my-1"
                  />

                  <p className="font-semibold">{item.temperature}°</p>
                </div>
              ))}
            </div>
          </>
        )}

        <p className="text-xs text-muted-foreground text-center mt-5">
          Last updated:{" "}
          {new Date(data.timestamp).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </p>
      </div>
    </FloodContext.Provider>
  );
};

export default LiveWeatherWidget;
