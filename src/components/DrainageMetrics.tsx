import { Droplets, Activity, Gauge, TrendingDown } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const DrainageMetrics = () => {
  const metrics = [
    { 
      label: 'Overall Drain Capacity', 
      value: 68, 
      unit: '%',
      status: 'Moderate Load',
      color: 'primary',
    },
    { 
      label: 'Storm Drain Flow Rate', 
      value: 2450, 
      unit: 'L/s',
      status: 'Above Normal',
      color: 'warning',
    },
    { 
      label: 'Pump Stations Active', 
      value: 18, 
      unit: '/24',
      status: '6 on Standby',
      color: 'success',
    },
    { 
      label: 'Blocked Drains Reported', 
      value: 12, 
      unit: '',
      status: 'Teams Dispatched',
      color: 'destructive',
    },
  ];

  const zoneCapacities = [
    { zone: 'North Delhi', capacity: 72, trend: 'stable' },
    { zone: 'South Delhi', capacity: 58, trend: 'decreasing' },
    { zone: 'East Delhi', capacity: 81, trend: 'stable' },
    { zone: 'West Delhi', capacity: 45, trend: 'critical' },
    { zone: 'Central Delhi', capacity: 34, trend: 'critical' },
    { zone: 'New Delhi', capacity: 67, trend: 'decreasing' },
  ];

  const getCapacityColor = (capacity: number) => {
    if (capacity > 70) return 'bg-success';
    if (capacity > 40) return 'bg-warning';
    return 'bg-destructive';
  };

  return (
    <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '700ms' }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Drainage Infrastructure</h2>
            <p className="text-sm text-muted-foreground">Real-time capacity monitoring</p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {metrics.map((metric, index) => (
          <div 
            key={metric.label}
            className="p-4 rounded-xl bg-secondary/30 border border-border/50"
          >
            <p className="text-xs text-muted-foreground mb-1">{metric.label}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-foreground">{metric.value}</span>
              <span className="text-sm text-muted-foreground">{metric.unit}</span>
            </div>
            <p className={`text-xs mt-1 text-${metric.color}`}>{metric.status}</p>
          </div>
        ))}
      </div>

      {/* Zone-wise Capacity */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-4">Zone-wise Drain Capacity</h3>
        <div className="space-y-3">
          {zoneCapacities.map((zone) => (
            <div key={zone.zone} className="flex items-center gap-3">
              <span className="text-sm text-foreground w-28 flex-shrink-0">{zone.zone}</span>
              <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${getCapacityColor(zone.capacity)}`}
                  style={{ width: `${zone.capacity}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground w-10 text-right">{zone.capacity}%</span>
              {zone.trend === 'critical' && (
                <TrendingDown className="w-4 h-4 text-destructive flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DrainageMetrics;
