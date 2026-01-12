import { Cloud, Droplets, Wind, Thermometer, ArrowUp, ArrowDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const RainfallMonitor = () => {
  const currentRainfall = 42;
  const thresholds = {
    low: 15,
    moderate: 30,
    high: 45,
    critical: 60,
  };

  const getIntensityLevel = (value: number) => {
    if (value >= thresholds.critical) return { label: 'Extreme', variant: 'critical' as const };
    if (value >= thresholds.high) return { label: 'Heavy', variant: 'high' as const };
    if (value >= thresholds.moderate) return { label: 'Moderate', variant: 'moderate' as const };
    return { label: 'Light', variant: 'low' as const };
  };

  const intensity = getIntensityLevel(currentRainfall);

  const hourlyData = [
    { hour: '12:00', value: 28 },
    { hour: '13:00', value: 35 },
    { hour: '14:00', value: 42 },
    { hour: '15:00', value: 38 },
    { hour: '16:00', value: 45 },
    { hour: 'Now', value: 42 },
  ];

  const maxValue = Math.max(...hourlyData.map(d => d.value));

  return (
    <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '500ms' }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <Cloud className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Rainfall Monitor</h2>
            <p className="text-sm text-muted-foreground">Real-time precipitation tracking</p>
          </div>
        </div>
        <Badge variant={intensity.variant}>{intensity.label}</Badge>
      </div>

      {/* Current Reading */}
      <div className="text-center mb-6 p-6 rounded-xl bg-secondary/30 border border-border/50">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Droplets className="w-8 h-8 text-primary" />
          <span className="text-5xl font-bold text-foreground font-mono">{currentRainfall}</span>
          <span className="text-xl text-muted-foreground">mm/hr</span>
        </div>
        <div className="flex items-center justify-center gap-2 text-sm">
          <ArrowUp className="w-4 h-4 text-destructive" />
          <span className="text-muted-foreground">+7mm from last hour</span>
        </div>
      </div>

      {/* Threshold Indicators */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span>Intensity Scale</span>
          <span>{currentRainfall}/{thresholds.critical} mm/hr</span>
        </div>
        <div className="relative h-3 rounded-full overflow-hidden bg-secondary">
          <div 
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-success via-warning to-destructive rounded-full transition-all duration-500"
            style={{ width: `${Math.min((currentRainfall / thresholds.critical) * 100, 100)}%` }}
          />
          {/* Threshold markers */}
          <div className="absolute inset-0 flex">
            <div className="w-1/4 border-r border-background/50" />
            <div className="w-1/4 border-r border-background/50" />
            <div className="w-1/4 border-r border-background/50" />
            <div className="w-1/4" />
          </div>
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
          <span>Light</span>
          <span>Moderate</span>
          <span>Heavy</span>
          <span>Extreme</span>
        </div>
      </div>

      {/* Hourly Chart */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Last 6 Hours</h3>
        <div className="flex items-end justify-between gap-2 h-24">
          {hourlyData.map((data, index) => (
            <div key={data.hour} className="flex-1 flex flex-col items-center gap-1">
              <div 
                className={`w-full rounded-t transition-all duration-500 ${
                  data.hour === 'Now' ? 'bg-primary' : 'bg-primary/40'
                }`}
                style={{ 
                  height: `${(data.value / maxValue) * 100}%`,
                  animationDelay: `${index * 100}ms`
                }}
              />
              <span className="text-[10px] text-muted-foreground">{data.hour}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-lg bg-secondary/30 text-center">
          <Wind className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
          <p className="text-lg font-semibold text-foreground">24</p>
          <p className="text-[10px] text-muted-foreground">km/h Wind</p>
        </div>
        <div className="p-3 rounded-lg bg-secondary/30 text-center">
          <Thermometer className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
          <p className="text-lg font-semibold text-foreground">28°C</p>
          <p className="text-[10px] text-muted-foreground">Temperature</p>
        </div>
        <div className="p-3 rounded-lg bg-secondary/30 text-center">
          <Droplets className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
          <p className="text-lg font-semibold text-foreground">89%</p>
          <p className="text-[10px] text-muted-foreground">Humidity</p>
        </div>
      </div>
    </div>
  );
};

export default RainfallMonitor;
