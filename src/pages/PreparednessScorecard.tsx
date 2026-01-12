import { Helmet } from 'react-helmet-async';
import Layout from '@/components/Layout';
import { Progress } from '@/components/ui/progress';
import {
  TrendingUp,
  TrendingDown,
  MapPin,
  Droplets,
  Wrench,
  Users,
  Shield,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/* =========================
   TYPES & INTERFACES
   ========================= */

interface PreparednessMetric {
  category: string;
  icon: LucideIcon;
  score: number;
  status: 'good' | 'moderate' | 'poor';
  details: string;
}

interface ZoneScore {
  zone: string;
  overallScore: number;
  repeatLocations: number; // affected area (hectares)
  incidentTrend: 'improving' | 'stable' | 'worsening';
  drainageReadiness: number;
  responseCapability: number;
  lastUpdated: string;
}

/* =========================
   DATA
   ========================= */

const cityMetrics: PreparednessMetric[] = [
  {
    category: 'Drainage Infrastructure',
    icon: Droplets,
    score: 58,
    status: 'moderate',
    details: '68% of planned upgrades completed',
  },
  {
    category: 'Emergency Response Teams',
    icon: Users,
    score: 75,
    status: 'good',
    details: '45 teams across 11 zones',
  },
  {
    category: 'Equipment Readiness',
    icon: Wrench,
    score: 82,
    status: 'good',
    details: '156 pumps, 42 boats ready',
  },
  {
    category: 'Early Warning Coverage',
    icon: Shield,
    score: 91,
    status: 'good',
    details: '272/272 wards connected',
  },
  {
    category: 'Historical Pattern Analysis',
    icon: TrendingUp,
    score: 88,
    status: 'good',
    details: '5 year data integrated',
  },
  {
    category: 'Citizen App Adoption',
    icon: Users,
    score: 45,
    status: 'poor',
    details: '180K active users (target: 500K)',
  },
];

const zoneScores: ZoneScore[] = [
  {
    zone: 'North Delhi',
    overallScore: 42,
    repeatLocations: 2387,
    incidentTrend: 'worsening',
    drainageReadiness: 40,
    responseCapability: 54,
    lastUpdated: 'Satellite data (1998–2022)',
  },
  {
    zone: 'East Delhi',
    overallScore: 48,
    repeatLocations: 1820,
    incidentTrend: 'stable',
    drainageReadiness: 46,
    responseCapability: 58,
    lastUpdated: 'Satellite data (1998–2022)',
  },
  {
    zone: 'Shahdara',
    overallScore: 50,
    repeatLocations: 1640,
    incidentTrend: 'stable',
    drainageReadiness: 48,
    responseCapability: 60,
    lastUpdated: 'Satellite data (1998–2022)',
  },
  {
    zone: 'North East Delhi',
    overallScore: 52,
    repeatLocations: 1480,
    incidentTrend: 'stable',
    drainageReadiness: 50,
    responseCapability: 62,
    lastUpdated: 'Satellite data (1998–2022)',
  },
  {
    zone: 'South East Delhi',
    overallScore: 64,
    repeatLocations: 720,
    incidentTrend: 'improving',
    drainageReadiness: 66,
    responseCapability: 74,
    lastUpdated: 'Satellite data (1998–2022)',
  },
  {
    zone: 'Central Delhi',
    overallScore: 70,
    repeatLocations: 420,
    incidentTrend: 'improving',
    drainageReadiness: 72,
    responseCapability: 80,
    lastUpdated: 'Satellite data (1998–2022)',
  },
  {
    zone: 'North West Delhi',
    overallScore: 68,
    repeatLocations: 560,
    incidentTrend: 'improving',
    drainageReadiness: 70,
    responseCapability: 78,
    lastUpdated: 'Satellite data (1998–2022)',
  },
];


/* =========================
   HELPERS
   ========================= */

const getScoreColor = (score: number): string => {
  if (score >= 70) return 'text-success';
  if (score >= 50) return 'text-warning';
  return 'text-destructive';
};

const getTrendIcon = (
  trend: ZoneScore['incidentTrend']
): JSX.Element => {
  switch (trend) {
    case 'improving':
      return <TrendingDown className="w-4 h-4 text-success" />;
    case 'worsening':
      return <TrendingUp className="w-4 h-4 text-destructive" />;
    case 'stable':
      return (
        <span className="w-4 h-4 flex items-center justify-center text-warning">
          −
        </span>
      );
  }
};

/* =========================
   COMPONENT
   ========================= */

const PreparednessScorecard: React.FC = () => {
  const overallScore = Math.round(
    zoneScores.reduce((acc, z) => acc + z.overallScore, 0) /
      zoneScores.length
  );

  return (
    <Layout>
      <Helmet>
        <title>Preparedness Scorecard | Delhi FloodWatch</title>
      </Helmet>

      <div className="p-6 space-y-6">

        {/* ================= ZONE-WISE PREPAREDNESS ================= */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Zone-wise Preparedness
          </h2>

          <div className="space-y-4">
            {zoneScores
              .sort((a, b) => a.overallScore - b.overallScore)
              .map((zone) => (
                <div
                  key={zone.zone}
                  className="p-4 rounded-xl bg-secondary/30 border border-border/50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">
                        {zone.zone}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {getTrendIcon(zone.incidentTrend)}
                      <span
                        className={`text-2xl font-bold ${getScoreColor(
                          zone.overallScore
                        )}`}
                      >
                        {zone.overallScore}
                      </span>
                    </div>
                  </div>

                  <Progress value={zone.overallScore} className="h-2 mb-3" />

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">Affected Area</p>
                      <p className="font-mono text-foreground">
                        {zone.repeatLocations} ha
                      </p>
                    </div>

                    <div>
                      <p className="text-muted-foreground">Drainage</p>
                      <p className="font-mono text-foreground">
                        {zone.drainageReadiness}%
                      </p>
                    </div>

                    <div>
                      <p className="text-muted-foreground">Response</p>
                      <p className="font-mono text-foreground">
                        {zone.responseCapability}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* ================= REPEAT FLOODING LOCATIONS ================= */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Repeat Flooding Locations (Top 10)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              {
                location:
                  'Adarsh Nagar  Hakikat Nagar  Jahangirpuri Metro Station',
                zone: 'North',
                image: '/images/locations/adarsh-nagar.jpg',
              },
              {
                location: 'Anand Parbat Road',
                zone: 'North',
                image: '/images/locations/anand-prabhat.jpg',
              },
              {
                location: 'Archana T-Point, Greater Kailash',
                zone: 'South',
                image: '/images/locations/greater-kailash.jpg',
              },
              {
                location: 'Mukarba Chowk',
                zone: 'North',
                image: '/images/locations/mukarba-chowk.jpg',
              },
              {
                location: 'Bhishma Pitamaha Marg',
                zone: 'Central',
                image: '/images/locations/bhishma-marg.jpg',
              },
              {
                location: 'Hansraj Gupta Marg',
                zone: 'North',
                image: '/images/locations/hansraj-gupta.jpg',
              },
              {
                location: 'DND Flyover towards Maharani Bagh',
                zone: 'South',
                image: '/images/locations/dnd-flyover.jpg',
              },
              {
                location: 'Aurobindo Marg',
                zone: 'South',
                image: '/images/locations/aurobindo-marg.jpg',
              },
              {
                location: 'Andheria Mor',
                zone: 'South',
                image: '/images/locations/andheria-mor.jpg',
              },
              {
                location: 'Barf Khana Chowk',
                zone: 'North',
                image: '/images/locations/barf-khana.jpg',
              },
            ].map((loc, index) => (
              <div
                key={loc.location}
                className="p-3 rounded-xl bg-secondary/30 border border-border/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              >
                <div className="relative">
                  <img
                    src={loc.image}
                    alt={loc.location}
                    className="w-full h-24 object-cover rounded-lg"
                  />

                  <span
                    className={`absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index < 3
                        ? 'bg-destructive text-destructive-foreground'
                        : index < 6
                        ? 'bg-warning text-warning-foreground'
                        : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    {index + 1}
                  </span>
                </div>

                <div className="mt-2">
                  <p className="text-sm font-medium text-foreground leading-tight line-clamp-2">
                    {loc.location}
                  </p>

                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-muted-foreground">
                      {loc.zone} Zone
                    </span>
                    <span className="text-xs text-destructive font-medium">
                      High recurrence
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default PreparednessScorecard;