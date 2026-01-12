import { Helmet } from 'react-helmet-async';
import Layout from '@/components/Layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Database, 
  Users, 
  Twitter, 
  Cloud, 
  Droplets, 
  CheckCircle, 
  AlertTriangle,
  RefreshCw,
  Zap,
  Link2,
  Activity,
  Shield,
  TrendingUp
} from 'lucide-react';

interface DataSource {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  status: 'active' | 'syncing' | 'error' | 'offline';
  lastSync: string;
  recordsToday: number;
  accuracy: number;
  description: string;
}

const dataSources: DataSource[] = [
  {
    id: '1',
    name: 'Citizen Reports',
    icon: Users,
    status: 'active',
    lastSync: '2 min ago',
    recordsToday: 156,
    accuracy: 89,
    description: 'Geotagged photos and reports from mobile app users',
  },
  {
    id: '2',
    name: 'Twitter/X Scraping',
    icon: Twitter,
    status: 'active',
    lastSync: '5 min ago',
    recordsToday: 423,
    accuracy: 72,
    description: 'Real-time flood mentions with NLP sentiment analysis',
  },
  {
    id: '3',
    name: 'IMD Rainfall API',
    icon: Cloud,
    status: 'active',
    lastSync: '1 min ago',
    recordsToday: 288,
    accuracy: 98,
    description: 'Official meteorological data from India Meteorological Dept',
  },
  {
    id: '4',
    name: 'Drainage Sensors',
    icon: Droplets,
    status: 'syncing',
    lastSync: '8 min ago',
    recordsToday: 1440,
    accuracy: 95,
    description: 'IoT sensors monitoring drain water levels across wards',
  },
  {
    id: '5',
    name: 'MCD Infrastructure DB',
    icon: Database,
    status: 'active',
    lastSync: '1 hour ago',
    recordsToday: 52,
    accuracy: 99,
    description: 'Official drainage infrastructure and maintenance records',
  },
];

interface CrossVerification {
  source1: string;
  source2: string;
  matchRate: number;
  conflicts: number;
  lastCheck: string;
}

const verifications: CrossVerification[] = [
  { source1: 'Citizen Reports', source2: 'Twitter/X', matchRate: 82, conflicts: 18, lastCheck: '5 min ago' },
  { source1: 'Citizen Reports', source2: 'Drainage Sensors', matchRate: 91, conflicts: 7, lastCheck: '3 min ago' },
  { source1: 'IMD Rainfall', source2: 'Drainage Sensors', matchRate: 94, conflicts: 4, lastCheck: '2 min ago' },
  { source1: 'Twitter/X', source2: 'IMD Rainfall', matchRate: 76, conflicts: 23, lastCheck: '8 min ago' },
];

const getStatusStyles = (status: DataSource['status']) => {
  switch (status) {
    case 'active':
      return { color: 'text-success', bg: 'bg-success/20', label: 'Active' };
    case 'syncing':
      return { color: 'text-warning', bg: 'bg-warning/20', label: 'Syncing' };
    case 'error':
      return { color: 'text-destructive', bg: 'bg-destructive/20', label: 'Error' };
    case 'offline':
      return { color: 'text-muted-foreground', bg: 'bg-muted/20', label: 'Offline' };
  }
};

const DataAggregation = () => {
  return (
    <Layout>
      <Helmet>
        <title>Data Aggregation | Delhi FloodWatch</title>
        <meta name="description" content="Multi-source data integration with cross-verification for accurate flood monitoring." />
      </Helmet>

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Multi-Source Data Aggregation</h1>
            <p className="text-muted-foreground">Real-time integration with cross-verification</p>
          </div>
          <Button variant="glow" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Sync All Sources
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Database className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">5</p>
                <p className="text-xs text-muted-foreground">Active Sources</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/20">
                <Zap className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">2,359</p>
                <p className="text-xs text-muted-foreground">Records Today</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/20">
                <Shield className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">86%</p>
                <p className="text-xs text-muted-foreground">Avg Accuracy</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/20">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">52</p>
                <p className="text-xs text-muted-foreground">Conflicts Detected</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Data Sources */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Connected Data Sources</h2>
            <div className="space-y-4">
              {dataSources.map((source) => {
                const statusStyles = getStatusStyles(source.status);
                
                return (
                  <div key={source.id} className="p-4 rounded-xl bg-secondary/30 border border-border/50">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${statusStyles.bg}`}>
                        <source.icon className={`w-5 h-5 ${statusStyles.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-foreground">{source.name}</h3>
                          <Badge variant={source.status === 'active' ? 'success' : source.status === 'syncing' ? 'warning' : 'destructive'}>
                            {statusStyles.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{source.description}</p>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Last Sync</p>
                            <p className="font-mono text-foreground">{source.lastSync}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Today</p>
                            <p className="font-mono text-foreground">{source.recordsToday}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Accuracy</p>
                            <p className="font-mono text-foreground">{source.accuracy}%</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cross-Verification */}
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Cross-Verification Matrix</h2>
              <div className="space-y-4">
                {verifications.map((v, index) => (
                  <div key={index} className="p-4 rounded-xl bg-secondary/30 border border-border/50">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-medium text-foreground">{v.source1}</span>
                      <Link2 className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">{v.source2}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Match Rate</span>
                        <span className="font-mono text-foreground">{v.matchRate}%</span>
                      </div>
                      <Progress value={v.matchRate} className="h-2" />
                    </div>
                    <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                      <span>{v.conflicts} conflicts</span>
                      <span>Checked {v.lastCheck}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Flow Diagram */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Data Pipeline Status</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/20">
                  <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
                  <span className="text-sm text-foreground flex-1">Ingestion Layer</span>
                  <Badge variant="success">Healthy</Badge>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/20">
                  <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
                  <span className="text-sm text-foreground flex-1">Validation Engine</span>
                  <Badge variant="success">Healthy</Badge>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/20">
                  <div className="w-3 h-3 rounded-full bg-warning animate-pulse" />
                  <span className="text-sm text-foreground flex-1">ML Processing</span>
                  <Badge variant="warning">High Load</Badge>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/20">
                  <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
                  <span className="text-sm text-foreground flex-1">Output API</span>
                  <Badge variant="success">Healthy</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DataAggregation;
