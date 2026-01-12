import { MapPin, AlertTriangle, Clock, ArrowRight, History } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Zone {
  rank: number;
  name: string;
  risk: 'critical' | 'high' | 'moderate';
  probability: number;
  timeToFlood: string;
  historicalIncidents: number;
  drainCapacity: number;
}

const zones: Zone[] = [
  { rank: 1, name: 'Chandni Chowk', risk: 'critical', probability: 95, timeToFlood: '8 min', historicalIncidents: 47, drainCapacity: 12 },
  { rank: 2, name: 'Nehru Place', risk: 'critical', probability: 92, timeToFlood: '10 min', historicalIncidents: 38, drainCapacity: 18 },
  { rank: 3, name: 'Karol Bagh', risk: 'critical', probability: 89, timeToFlood: '15 min', historicalIncidents: 42, drainCapacity: 22 },
  { rank: 4, name: 'ITO', risk: 'high', probability: 82, timeToFlood: '18 min', historicalIncidents: 35, drainCapacity: 28 },
  { rank: 5, name: 'Rajouri Garden', risk: 'high', probability: 78, timeToFlood: '20 min', historicalIncidents: 31, drainCapacity: 32 },
  { rank: 6, name: 'Lajpat Nagar', risk: 'high', probability: 75, timeToFlood: '22 min', historicalIncidents: 28, drainCapacity: 35 },
  { rank: 7, name: 'Pitampura', risk: 'high', probability: 72, timeToFlood: '25 min', historicalIncidents: 24, drainCapacity: 38 },
  { rank: 8, name: 'Shahdara', risk: 'high', probability: 70, timeToFlood: '28 min', historicalIncidents: 29, drainCapacity: 40 },
];

const getRankStyle = (rank: number) => {
  if (rank === 1) return 'bg-destructive text-destructive-foreground';
  if (rank === 2) return 'bg-destructive/80 text-destructive-foreground';
  if (rank === 3) return 'bg-warning text-warning-foreground';
  return 'bg-secondary text-secondary-foreground';
};

const HighRiskZones = () => {
  return (
    <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '600ms' }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-destructive/20">
            <AlertTriangle className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Priority Response List</h2>
            <p className="text-sm text-muted-foreground">High-risk zones ranked by severity</p>
          </div>
        </div>
        <Button variant="outline" size="sm">
          View All
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50">
              <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground">Rank</th>
              <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground">Zone</th>
              <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground">Risk</th>
              <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground">ETA</th>
              <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground hidden md:table-cell">
                <span className="flex items-center gap-1">
                  <History className="w-3 h-3" />
                  History
                </span>
              </th>
              <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground hidden lg:table-cell">Drain %</th>
            </tr>
          </thead>
          <tbody>
            {zones.map((zone, index) => (
              <tr 
                key={zone.name} 
                className="border-b border-border/30 hover:bg-secondary/20 transition-colors cursor-pointer"
                style={{ animationDelay: `${(index + 7) * 50}ms` }}
              >
                <td className="py-3 px-2">
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${getRankStyle(zone.rank)}`}>
                    {zone.rank}
                  </span>
                </td>
                <td className="py-3 px-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">{zone.name}</span>
                  </div>
                </td>
                <td className="py-3 px-2">
                  <Badge variant={zone.risk}>{zone.probability}%</Badge>
                </td>
                <td className="py-3 px-2">
                  <span className="flex items-center gap-1 text-sm text-muted-foreground font-mono">
                    <Clock className="w-3 h-3" />
                    {zone.timeToFlood}
                  </span>
                </td>
                <td className="py-3 px-2 hidden md:table-cell">
                  <span className="text-sm text-muted-foreground">{zone.historicalIncidents} incidents</span>
                </td>
                <td className="py-3 px-2 hidden lg:table-cell">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 rounded-full bg-secondary overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${zone.drainCapacity < 25 ? 'bg-destructive' : zone.drainCapacity < 50 ? 'bg-warning' : 'bg-success'}`}
                        style={{ width: `${zone.drainCapacity}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{zone.drainCapacity}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HighRiskZones;
