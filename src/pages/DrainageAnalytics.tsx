import { Helmet } from 'react-helmet-async';
import Layout from '@/components/Layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Droplets, 
  Activity, 
  AlertTriangle, 
  TrendingUp,
  TrendingDown,
  Gauge,
  Wrench,
  MapPin,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';

interface WardDrainage {
  id: string;
  name: string;
  zone: string;
  healthScore: number;
  designedCapacity: number;
  actualLoad: number;
  drainDensity: number;
  majorOutlets: number;
  connectedOutlets: number;
  historicalPerformance: 'excellent' | 'good' | 'average' | 'poor' | 'critical';
  trend: 'improving' | 'stable' | 'declining';
  bottlenecks: number;
  maintenanceNeeded: boolean;
}

const drainageData: WardDrainage[] = [
  { id: '87', name: 'Ranjeet Nagar', zone: 'Karol Bagh (Central)', healthScore: 32, designedCapacity: 850, actualLoad: 1250, drainDensity: 2.4, majorOutlets: 3, connectedOutlets: 1, historicalPerformance: 'critical', trend: 'declining', bottlenecks: 7, maintenanceNeeded: true },
  { id: '88', name: 'Karol Bagh', zone: 'Karol Bagh (Central)', healthScore: 38, designedCapacity: 1100, actualLoad: 1450, drainDensity: 2.7, majorOutlets: 4, connectedOutlets: 2, historicalPerformance: 'poor', trend: 'stable', bottlenecks: 6, maintenanceNeeded: true },
  { id: '89', name: 'New Rajinder Nagar', zone: 'Karol Bagh (Central)', healthScore: 41, designedCapacity: 950, actualLoad: 1180, drainDensity: 2.9, majorOutlets: 3, connectedOutlets: 2, historicalPerformance: 'poor', trend: 'stable', bottlenecks: 5, maintenanceNeeded: true },
  { id: '202', name: 'Nehru Place', zone: 'Siri Fort (South)', healthScore: 45, designedCapacity: 1400, actualLoad: 1620, drainDensity: 3.1, majorOutlets: 5, connectedOutlets: 3, historicalPerformance: 'poor', trend: 'improving', bottlenecks: 4, maintenanceNeeded: true },
  { id: '203', name: 'Lajpat Nagar', zone: 'Siri Fort (South)', healthScore: 52, designedCapacity: 1200, actualLoad: 1280, drainDensity: 3.4, majorOutlets: 4, connectedOutlets: 3, historicalPerformance: 'average', trend: 'stable', bottlenecks: 3, maintenanceNeeded: false },
  { id: '147', name: 'Rajouri Garden', zone: 'Rajouri Garden (West)', healthScore: 55, designedCapacity: 1600, actualLoad: 1480, drainDensity: 3.6, majorOutlets: 6, connectedOutlets: 4, historicalPerformance: 'average', trend: 'stable', bottlenecks: 3, maintenanceNeeded: false },
  { id: '148', name: 'Punjabi Bagh', zone: 'Rajouri Garden (West)', healthScore: 48, designedCapacity: 1300, actualLoad: 1420, drainDensity: 3.2, majorOutlets: 5, connectedOutlets: 3, historicalPerformance: 'average', trend: 'declining', bottlenecks: 4, maintenanceNeeded: true },
  { id: 'B-1', name: 'Rohini Sector 1-5', zone: 'Rohini (North-West)', healthScore: 72, designedCapacity: 1800, actualLoad: 1320, drainDensity: 4.7, majorOutlets: 8, connectedOutlets: 7, historicalPerformance: 'good', trend: 'stable', bottlenecks: 2, maintenanceNeeded: false },
  { id: 'B-2', name: 'Rohini Sector 6-16', zone: 'Rohini (North-West)', healthScore: 68, designedCapacity: 1650, actualLoad: 1410, drainDensity: 4.5, majorOutlets: 7, connectedOutlets: 6, historicalPerformance: 'good', trend: 'improving', bottlenecks: 3, maintenanceNeeded: false },
  { id: 'C-1', name: 'Dwarka Sector 1-10', zone: 'Dwarka (South-West)', healthScore: 82, designedCapacity: 2200, actualLoad: 1180, drainDensity: 5.4, majorOutlets: 11, connectedOutlets: 10, historicalPerformance: 'excellent', trend: 'stable', bottlenecks: 1, maintenanceNeeded: false },
  { id: 'C-2', name: 'Dwarka Sector 11-23', zone: 'Dwarka (South-West)', healthScore: 75, designedCapacity: 1950, actualLoad: 1270, drainDensity: 5.1, majorOutlets: 9, connectedOutlets: 8, historicalPerformance: 'excellent', trend: 'stable', bottlenecks: 2, maintenanceNeeded: false },
  { id: '267', name: 'Seelampur', zone: 'Shahdara (East)', healthScore: 29, designedCapacity: 900, actualLoad: 1580, drainDensity: 2.2, majorOutlets: 4, connectedOutlets: 1, historicalPerformance: 'critical', trend: 'declining', bottlenecks: 9, maintenanceNeeded: true },
  { id: '268', name: 'Welcome Colony', zone: 'Shahdara (East)', healthScore: 34, designedCapacity: 1050, actualLoad: 1520, drainDensity: 2.5, majorOutlets: 5, connectedOutlets: 2, historicalPerformance: 'poor', trend: 'stable', bottlenecks: 7, maintenanceNeeded: true },
];

const getHealthColor = (score: number) => {
  if (score >= 70) return 'bg-success';
  if (score >= 50) return 'bg-warning';
  if (score >= 30) return 'bg-destructive/80';
  return 'bg-destructive';
};

const getPerformanceVariant = (perf: WardDrainage['historicalPerformance']) => {
  switch (perf) {
    case 'excellent': return 'success';
    case 'good': return 'success';
    case 'average': return 'warning';
    case 'poor': return 'high';
    case 'critical': return 'critical';
  }
};

const getTrendIcon = (trend: WardDrainage['trend']) => {
  switch (trend) {
    case 'improving': return <ArrowUp className="w-4 h-4 text-success" />;
    case 'declining': return <ArrowDown className="w-4 h-4 text-destructive" />;
    case 'stable': return <Minus className="w-4 h-4 text-muted-foreground" />;
  }
};

const DrainageAnalytics = () => {
  const avgHealthScore = Math.round(drainageData.reduce((acc, d) => acc + d.healthScore, 0) / drainageData.length);
  const criticalWards = drainageData.filter(d => d.healthScore < 40).length;
  const totalBottlenecks = drainageData.reduce((acc, d) => acc + d.bottlenecks, 0);
  const maintenanceRequired = drainageData.filter(d => d.maintenanceNeeded).length;

  return (
    <Layout>
      <Helmet>
        <title>Drainage Analytics | Delhi FloodWatch</title>
        <meta name="description" content="Ward-wise drainage infrastructure health analysis and bottleneck identification." />
      </Helmet>

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Drainage Infrastructure Analytics</h1>
            <p className="text-muted-foreground">Ward-wise health scores and bottleneck analysis</p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${avgHealthScore >= 50 ? 'bg-success/20' : 'bg-warning/20'}`}>
                <Gauge className={`w-5 h-5 ${avgHealthScore >= 50 ? 'text-success' : 'text-warning'}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{avgHealthScore}%</p>
                <p className="text-xs text-muted-foreground">Avg Health Score</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/20">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{criticalWards}</p>
                <p className="text-xs text-muted-foreground">Critical Wards</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/20">
                <Activity className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalBottlenecks}</p>
                <p className="text-xs text-muted-foreground">Total Bottlenecks</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Wrench className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{maintenanceRequired}</p>
                <p className="text-xs text-muted-foreground">Need Maintenance</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Analytics Table */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Ward-wise Drainage Health</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground">Ward</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground">Health Score</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground hidden md:table-cell">Capacity vs Load</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground hidden lg:table-cell">Drain Density</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground hidden lg:table-cell">Outlets</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground">Performance</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground">Trend</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground hidden md:table-cell">Issues</th>
                </tr>
              </thead>
              <tbody>
                {drainageData.sort((a, b) => a.healthScore - b.healthScore).map((ward) => (
                  <tr key={ward.id} className="border-b border-border/30 hover:bg-secondary/20 transition-colors">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground">{ward.name}</p>
                          <p className="text-xs text-muted-foreground">{ward.zone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <div className="w-16">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="font-mono text-foreground">{ward.healthScore}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-secondary overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${getHealthColor(ward.healthScore)}`}
                              style={{ width: `${ward.healthScore}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 hidden md:table-cell">
                      <div className="text-sm">
                        <p className="text-foreground">{ward.actualLoad} / {ward.designedCapacity} L/s</p>
                        <p className={`text-xs ${ward.actualLoad > ward.designedCapacity ? 'text-destructive' : 'text-success'}`}>
                          {Math.round((ward.actualLoad / ward.designedCapacity) * 100)}% utilized
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-2 hidden lg:table-cell">
                      <span className="font-mono text-foreground">{ward.drainDensity} km/km²</span>
                    </td>
                    <td className="py-3 px-2 hidden lg:table-cell">
                      <span className="font-mono text-foreground">{ward.connectedOutlets}/{ward.majorOutlets}</span>
                    </td>
                    <td className="py-3 px-2">
                      <Badge variant={getPerformanceVariant(ward.historicalPerformance)}>
                        {ward.historicalPerformance}
                      </Badge>
                    </td>
                    <td className="py-3 px-2">
                      {getTrendIcon(ward.trend)}
                    </td>
                    <td className="py-3 px-2 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{ward.bottlenecks} bottlenecks</span>
                        {ward.maintenanceNeeded && (
                          <Wrench className="w-4 h-4 text-warning" />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Infrastructure Gaps */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Critical Infrastructure Gaps</h2>
            <div className="space-y-3">
              {drainageData
                .filter(d => d.healthScore < 50)
                .map((ward) => (
                  <div key={ward.id} className="p-4 rounded-xl bg-destructive/10 border border-destructive/30">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-foreground">{ward.name}</h3>
                      <Badge variant="critical">{ward.healthScore}%</Badge>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {ward.actualLoad > ward.designedCapacity && (
                        <li className="flex items-center gap-2">
                          <AlertTriangle className="w-3 h-3 text-destructive" />
                          Capacity exceeded by {Math.round(((ward.actualLoad - ward.designedCapacity) / ward.designedCapacity) * 100)}%
                        </li>
                      )}
                      {ward.connectedOutlets < ward.majorOutlets * 0.7 && (
                        <li className="flex items-center gap-2">
                          <AlertTriangle className="w-3 h-3 text-destructive" />
                          Only {ward.connectedOutlets}/{ward.majorOutlets} outlets connected
                        </li>
                      )}
                      <li className="flex items-center gap-2">
                        <AlertTriangle className="w-3 h-3 text-warning" />
                        {ward.bottlenecks} bottleneck locations identified
                      </li>
                    </ul>
                  </div>
                ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Improvement Recommendations</h2>
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
                <h3 className="font-medium text-foreground mb-2">
                  Priority 1: Seelampur (Shahdara – East)
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Drain capacity severely exceeded during peak rainfall</li>
                  <li>• Immediate desilting of primary stormwater drains</li>
                  <li>• Add temporary pumping stations during monsoon months</li>
                  <li>• Identify and clear high-risk choke points</li>
                </ul>
              </div>
              <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
                <h3 className="font-medium text-foreground mb-2">
                  Priority 2: Karol Bagh & Ranjeet Nagar (Central)
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Upgrade undersized drainage pipelines</li>
                  <li>• Improve outlet connectivity to main trunk drains</li>
                  <li>• Repair damaged manholes and collapsed drain sections</li>
                  <li>• Deploy localized water level monitoring sensors</li>
                </ul>
              </div>
              <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
                <h3 className="font-medium text-foreground mb-2">
                  Priority 3: Chandni Chowk (Central)
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Chronic overloading during short-duration heavy rainfall</li>
                  <li>• Connect remaining major outlets to improve discharge</li>
                  <li>• Clear long-standing bottlenecks in narrow lanes</li>
                  <li>• Long-term capacity augmentation planning</li>
                </ul>
              </div>
              <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
                <h3 className="font-medium text-foreground mb-2">
                  Priority 4: Welcome Colony (Shahdara – East)
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Improve secondary drain interconnections</li>
                  <li>• Regular desilting before monsoon onset</li>
                  <li>• Prevent solid-waste choking at inlets</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
                <h3 className="font-medium text-foreground mb-2">
                  Priority 5: New Rajinder Nagar (Central)
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Increase discharge capacity of main outlets</li>
                  <li>• Replace collapsed underground sections</li>
                  <li>• Improve slope for faster runoff</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
                <h3 className="font-medium text-foreground mb-2">
                  Priority 6: Punjabi Bagh (West)
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Address recurring mid-road waterlogging</li>
                  <li>• Upgrade aging drain segments</li>
                  <li>• Conduct joint inspection with traffic dept</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DrainageAnalytics;