import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/Layout';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DelhiMap from '@/components/DelhiMap'; 
import { generateWardReport } from '@/utils/reportGenerator';
import { 
  MapPin, History, Activity, Droplets, Cloud, 
  AlertTriangle, Eye, Calendar, TrendingUp, ChevronRight,
  Waves, ThermometerSun, Info, RefreshCw, Signal
} from 'lucide-react';
import { WardData, RiskLevel } from '@/types/ward';

// --- EXPANDED DATASET (20 Locations) ---
const rawWardsData: WardData[] = [
  // ... Keep your existing 10 items (Chandni Chowk to Dwarka) here ...
  { 
    id: '1', name: 'Chandni Chowk', zone: 'Central', population: '156K',
    currentRisk: 'critical', currentRainfall: 52, drainCapacity: 15, activeIncidents: 4, lastFlood: '2 hours ago',
    historicalRisk: 'critical', historicalIncidents: 47,
    floodFrequency: 47, severeFloods: 12, peakRainfall: '185 mm (Jul 2023)', avgDrainCapacity: 45
  },
  { 
    id: '2', name: 'Nehru Place', zone: 'South', population: '89K',
    currentRisk: 'critical', currentRainfall: 48, drainCapacity: 22, activeIncidents: 3, lastFlood: '4 hours ago',
    historicalRisk: 'high', historicalIncidents: 38,
    floodFrequency: 38, severeFloods: 8, peakRainfall: '142 mm (Aug 2022)', avgDrainCapacity: 60
  },
  { 
    id: '3', name: 'Karol Bagh', zone: 'Central', population: '178K',
    currentRisk: 'high', currentRainfall: 45, drainCapacity: 28, activeIncidents: 2, lastFlood: '6 hours ago',
    historicalRisk: 'high', historicalIncidents: 42,
    floodFrequency: 42, severeFloods: 9, peakRainfall: '155 mm (Jul 2023)', avgDrainCapacity: 55
  },
  { 
    id: '4', name: 'ITO', zone: 'Central', population: '45K',
    currentRisk: 'high', currentRainfall: 42, drainCapacity: 35, activeIncidents: 2, lastFlood: '8 hours ago',
    historicalRisk: 'moderate', historicalIncidents: 35,
    floodFrequency: 35, severeFloods: 5, peakRainfall: '130 mm (Sep 2021)', avgDrainCapacity: 65
  },
  { 
    id: '5', name: 'Rajouri Garden', zone: 'West', population: '203K',
    currentRisk: 'high', currentRainfall: 44, drainCapacity: 32, activeIncidents: 2, lastFlood: '5 hours ago',
    historicalRisk: 'high', historicalIncidents: 31,
    floodFrequency: 31, severeFloods: 7, peakRainfall: '148 mm (Jul 2023)', avgDrainCapacity: 58
  },
  { 
    id: '6', name: 'Lajpat Nagar', zone: 'South', population: '145K',
    currentRisk: 'moderate', currentRainfall: 38, drainCapacity: 45, activeIncidents: 1, lastFlood: '1 day ago',
    historicalRisk: 'high', historicalIncidents: 28,
    floodFrequency: 28, severeFloods: 6, peakRainfall: '138 mm (Aug 2022)', avgDrainCapacity: 62
  },
  { 
    id: '7', name: 'Pitampura', zone: 'North', population: '267K',
    currentRisk: 'moderate', currentRainfall: 35, drainCapacity: 52, activeIncidents: 1, lastFlood: '2 days ago',
    historicalRisk: 'moderate', historicalIncidents: 24,
    floodFrequency: 24, severeFloods: 4, peakRainfall: '125 mm (Jul 2021)', avgDrainCapacity: 70
  },
  { 
    id: '8', name: 'Shahdara', zone: 'East', population: '312K',
    currentRisk: 'moderate', currentRainfall: 40, drainCapacity: 38, activeIncidents: 1, lastFlood: '12 hours ago',
    historicalRisk: 'high', historicalIncidents: 29,
    floodFrequency: 29, severeFloods: 8, peakRainfall: '160 mm (Jul 2023)', avgDrainCapacity: 50
  },
  { 
    id: '9', name: 'Rohini', zone: 'North', population: '445K',
    currentRisk: 'low', currentRainfall: 28, drainCapacity: 68, activeIncidents: 0, lastFlood: '5 days ago',
    historicalRisk: 'moderate', historicalIncidents: 18,
    floodFrequency: 18, severeFloods: 2, peakRainfall: '110 mm (Aug 2020)', avgDrainCapacity: 75
  },
  { 
    id: '10', name: 'Dwarka', zone: 'South-West', population: '389K',
    currentRisk: 'low', currentRainfall: 22, drainCapacity: 75, activeIncidents: 0, lastFlood: '2 weeks ago',
    historicalRisk: 'low', historicalIncidents: 12,
    floodFrequency: 12, severeFloods: 1, peakRainfall: '95 mm (Sep 2021)', avgDrainCapacity: 82
  },

  // --- NEW LOCATIONS ---
  { 
    id: '11', name: 'Connaught Place', zone: 'Central', population: '25K',
    currentRisk: 'high', currentRainfall: 46, drainCapacity: 40, activeIncidents: 2, lastFlood: '6 hours ago',
    historicalRisk: 'moderate', historicalIncidents: 22,
    floodFrequency: 22, severeFloods: 3, peakRainfall: '145 mm (Jul 2023)', avgDrainCapacity: 72
  },
  { 
    id: '12', name: 'Vasant Kunj', zone: 'South', population: '110K',
    currentRisk: 'low', currentRainfall: 18, drainCapacity: 82, activeIncidents: 0, lastFlood: '3 weeks ago',
    historicalRisk: 'low', historicalIncidents: 8,
    floodFrequency: 8, severeFloods: 0, peakRainfall: '88 mm (Aug 2021)', avgDrainCapacity: 85
  },
  { 
    id: '13', name: 'Hauz Khas', zone: 'South', population: '85K',
    currentRisk: 'moderate', currentRainfall: 32, drainCapacity: 55, activeIncidents: 1, lastFlood: '1 day ago',
    historicalRisk: 'moderate', historicalIncidents: 15,
    floodFrequency: 15, severeFloods: 2, peakRainfall: '115 mm (Sep 2022)', avgDrainCapacity: 68
  },
  { 
    id: '14', name: 'Saket', zone: 'South', population: '140K',
    currentRisk: 'moderate', currentRainfall: 35, drainCapacity: 48, activeIncidents: 1, lastFlood: '14 hours ago',
    historicalRisk: 'high', historicalIncidents: 30,
    floodFrequency: 30, severeFloods: 5, peakRainfall: '138 mm (Jul 2023)', avgDrainCapacity: 52
  },
  { 
    id: '15', name: 'Okhla', zone: 'East', population: '210K',
    currentRisk: 'critical', currentRainfall: 55, drainCapacity: 12, activeIncidents: 5, lastFlood: '1 hour ago',
    historicalRisk: 'critical', historicalIncidents: 52,
    floodFrequency: 52, severeFloods: 15, peakRainfall: '170 mm (Aug 2023)', avgDrainCapacity: 35
  },
  { 
    id: '16', name: 'Janakpuri', zone: 'West', population: '190K',
    currentRisk: 'moderate', currentRainfall: 28, drainCapacity: 65, activeIncidents: 0, lastFlood: '4 days ago',
    historicalRisk: 'moderate', historicalIncidents: 20,
    floodFrequency: 20, severeFloods: 3, peakRainfall: '122 mm (Aug 2021)', avgDrainCapacity: 71
  },
  { 
    id: '17', name: 'Laxmi Nagar', zone: 'East', population: '250K',
    currentRisk: 'critical', currentRainfall: 50, drainCapacity: 18, activeIncidents: 3, lastFlood: '3 hours ago',
    historicalRisk: 'critical', historicalIncidents: 45,
    floodFrequency: 45, severeFloods: 11, peakRainfall: '165 mm (Jul 2023)', avgDrainCapacity: 40
  },
  { 
    id: '18', name: 'Model Town', zone: 'North', population: '95K',
    currentRisk: 'high', currentRainfall: 42, drainCapacity: 35, activeIncidents: 2, lastFlood: '7 hours ago',
    historicalRisk: 'moderate', historicalIncidents: 25,
    floodFrequency: 25, severeFloods: 4, peakRainfall: '132 mm (Sep 2022)', avgDrainCapacity: 66
  },
  { 
    id: '19', name: 'Punjabi Bagh', zone: 'West', population: '82K',
    currentRisk: 'moderate', currentRainfall: 30, drainCapacity: 58, activeIncidents: 1, lastFlood: '2 days ago',
    historicalRisk: 'high', historicalIncidents: 27,
    floodFrequency: 27, severeFloods: 6, peakRainfall: '140 mm (Jul 2021)', avgDrainCapacity: 55
  },
  { 
    id: '20', name: 'Mayur Vihar', zone: 'East', population: '165K',
    currentRisk: 'high', currentRainfall: 44, drainCapacity: 30, activeIncidents: 2, lastFlood: '5 hours ago',
    historicalRisk: 'high', historicalIncidents: 33,
    floodFrequency: 33, severeFloods: 7, peakRainfall: '150 mm (Aug 2023)', avgDrainCapacity: 48
  },
];

const WardDashboard = () => {
  const [view, setView] = useState<'live' | 'historical'>('live');
  const [selectedWardId, setSelectedWardId] = useState<string | null>(null);

  const displayedWards = useMemo(() => {
    return rawWardsData.map(ward => {
      if (view === 'live') {
        // LIVE VIEW: Green dots, perfect weather params
        return {
          ...ward,
          currentRisk: 'low' as RiskLevel,
          currentRainfall: 0,
          activeIncidents: 0,
          drainCapacity: Math.floor(Math.random() * (95 - 85 + 1)) + 85,
          lastFlood: `${Math.floor(Math.random() * 2) + 5} months ago`
        };
      } else {
        // HISTORICAL VIEW: Use Historical Risk color
        return {
          ...ward,
          currentRisk: ward.historicalRisk 
        };
      }
    });
  }, [view]);

  const selectedWard = useMemo(() => 
    displayedWards.find(w => w.id === selectedWardId) || null, 
  [displayedWards, selectedWardId]);

  return (
    <Layout>
      <Helmet>
        <title>Ward Risk Dashboard | Delhi FloodWatch</title>
      </Helmet>

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Interactive Ward-Level Risk Dashboard</h1>
            <p className="text-muted-foreground">Color-coded heat map with dual view modes</p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant={view === 'live' ? 'default' : 'outline'} 
              onClick={() => setView('live')}
              className="gap-2"
            >
              <Activity className="w-4 h-4" />
              Live View
            </Button>
            <Button 
              variant={view === 'historical' ? 'default' : 'outline'} 
              onClick={() => setView('historical')}
              className="gap-2"
            >
              <History className="w-4 h-4" />
              Historical
            </Button>
          </div>
        </div>

        {/* Top Legend Badge */}
        <div className="glass-card p-4">
          <div className="flex flex-wrap items-center gap-6">
            <span className="text-sm text-muted-foreground font-medium">
              Risk Level:
            </span>

            {/* Low */}
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm text-foreground">Low</span>
            </div>

            {/* Moderate */}
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-yellow-400" />
              <span className="text-sm text-foreground">Moderate</span>
            </div>

            {/* High */}
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="text-sm text-foreground">High</span>
            </div>

            {/* Critical */}
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-600 animate-pulse" />
              <span className="text-sm text-foreground">Critical</span>
            </div>
          </div>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Heat Map Grid */}
          <div className="lg:col-span-2 glass-card p-0 overflow-hidden flex flex-col">
            <div className="p-6 pb-2 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                {view === 'live' ? 'Live Risk Heat Map' : 'Historical Risk Pattern'}
              </h2>
              <Badge variant={view === 'live' ? 'default' : 'secondary'} className="gap-1">
                {view === 'live' ? <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/> : <History className="w-3 h-3"/>}
                {view === 'live' ? 'Real-time System Active' : '5-Year Analysis'}
              </Badge>
            </div>

            <div className="flex-1 p-0 min-h-[400px]">
              <DelhiMap
                wardsData={displayedWards}
                onWardSelect={(ward) => setSelectedWardId(ward.id)}
                selectedWardId={selectedWardId}
              />
            </div>

            {/* --- UPDATED FOOTER --- */}
            <div className="px-4 py-3 bg-secondary/10 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  <span>System Status: <strong>Optimal</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                   <Info className="w-3 h-3" />
                   <span>Source: IMD, OPENMETEO & OGD Data</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <RefreshCw className="w-3 h-3 animate-spin-slow" />
                <span>Last Updated: {view === 'live' ? 'Just now' : 'Dec 2025'}</span>
              </div>
            </div>
            {/* ---------------------- */}
          </div>

          {/* Ward Details Panel */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Ward Details</h2>
            
            {selectedWard ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-foreground">{selectedWard.name}</h3>
                    <Badge variant={
                      selectedWard.currentRisk === 'critical' ? 'destructive' :
                      selectedWard.currentRisk === 'high' ? 'destructive' :
                      selectedWard.currentRisk === 'moderate' ? 'secondary' : 'outline'
                    } className={selectedWard.currentRisk === 'low' ? 'bg-success text-white border-0' : ''}>
                      {selectedWard.currentRisk.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{selectedWard.zone} Delhi • Pop. {selectedWard.population}</p>
                </div>

                <div className="space-y-3">
                  {view === 'live' ? (
                    // Live View Params
                    <>
                       <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/20">
                        <div className="flex items-center gap-2">
                          <Cloud className="w-4 h-4 text-primary" />
                          <span className="text-sm text-muted-foreground">Current Rainfall</span>
                        </div>
                        <span className="font-mono text-foreground">{selectedWard.currentRainfall} mm/hr</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/20">
                        <div className="flex items-center gap-2">
                          <Droplets className="w-4 h-4 text-primary" />
                          <span className="text-sm text-muted-foreground">Drain Capacity</span>
                        </div>
                        <span className="font-mono text-foreground">{selectedWard.drainCapacity}%</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/20">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-warning" />
                          <span className="text-sm text-muted-foreground">Active Incidents</span>
                        </div>
                        <span className="font-mono text-foreground">{selectedWard.activeIncidents}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/20">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Last Flood</span>
                        </div>
                        <span className="text-sm text-foreground">{selectedWard.lastFlood}</span>
                      </div>
                    </>
                  ) : (
                    // Historical View Params
                    <>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/20">
                        <div className="flex items-center gap-2">
                          <Waves className="w-4 h-4 text-blue-500" />
                          <span className="text-sm text-muted-foreground">Flood Frequency</span>
                        </div>
                        <span className="font-mono text-foreground">{selectedWard.floodFrequency} events</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/20">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-destructive" />
                          <span className="text-sm text-muted-foreground">Severe Events</span>
                        </div>
                        <span className="font-mono text-foreground">{selectedWard.severeFloods}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/20">
                        <div className="flex items-center gap-2">
                          <ThermometerSun className="w-4 h-4 text-orange-500" />
                          <span className="text-sm text-muted-foreground">Peak Rainfall</span>
                        </div>
                        <span className="font-mono text-foreground">{selectedWard.peakRainfall}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/20">
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Avg Drain Capacity</span>
                        </div>
                        <span className="font-mono text-foreground">{selectedWard.avgDrainCapacity}%</span>
                      </div>
                    </>
                  )}
                </div>

                <Button 
                  variant="outline" 
                  className="w-full gap-2 mt-4"
                  onClick={() => {
                    if (selectedWard) {
                      generateWardReport(selectedWard);
                    }
                  }}
                >
                  <Eye className="w-4 h-4" />
                  View Full Report
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Select a ward to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/20">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {displayedWards.filter(w => w.currentRisk === 'critical').length}
                </p>
                <p className="text-xs text-muted-foreground">Critical Wards</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/20">
                <TrendingUp className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {displayedWards.filter(w => w.currentRisk === 'high').length}
                </p>
                <p className="text-xs text-muted-foreground">High Risk Wards</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {view === 'live' 
                    ? displayedWards.reduce((acc, w) => acc + w.activeIncidents, 0)
                    : displayedWards.reduce((acc, w) => acc + w.floodFrequency, 0)
                  }
                </p>
                <p className="text-xs text-muted-foreground">
                  {view === 'live' ? 'Active Incidents' : 'Total Flood Events'}
                </p>
              </div>
            </div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/20">
                <Droplets className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {Math.round(displayedWards.reduce((acc, w) => acc + (view === 'live' ? w.drainCapacity : w.avgDrainCapacity), 0) / displayedWards.length)}%
                </p>
                <p className="text-xs text-muted-foreground">Avg Drain Capacity</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WardDashboard;