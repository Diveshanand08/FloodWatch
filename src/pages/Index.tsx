import { Helmet } from 'react-helmet-async';
import Layout from '@/components/Layout';
import StatusOverview from '@/components/StatusOverview';
import LeafletMap from '@/components/LeafletMap';
import DelhiMap from '@/components/DelhiMap';
import PredictionPanel from '@/components/PredictionPanel';
import AlertSystem from '@/components/AlertSystem';
import LiveWeatherWidget from '@/components/LiveWeatherWidget';
import RainfallMonitor from '@/components/RainfallMonitor';
import HighRiskZones from '@/components/HighRiskZones';
import DrainageMetrics from '@/components/DrainageMetrics';
import WardRiskSummary from "@/components/WardRiskSummary";

import 'leaflet/dist/leaflet.css';

const Index = () => {
  return (
    <Layout>
      <Helmet>
        <title>Delhi FloodWatch - Predictive Waterlogging Intelligence System</title>
        <meta
          name="description"
          content="Real-time flood prediction and early warning system for Delhi. Monitor waterlogging hotspots, rainfall intensity, and drainage infrastructure with AI-powered 30–60 minute forecasts."
        />
        <meta
          name="keywords"
          content="Delhi flood warning, waterlogging prediction, monsoon preparedness, urban flooding, GIS mapping, early warning system"
        />
      </Helmet>

      <div className="p-6 space-y-6">
        {/* ================= Status Overview ================= */}
        <StatusOverview />

        {/* ================= Main Dashboard ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section (2 columns) */}
          <div className="lg:col-span-2 glass-card p-6 space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Delhi Ward Risk Map
              </h2>
              <p className="text-sm text-muted-foreground">
                Interactive GIS visualization with real-time flood risk
              </p>
            </div>

            {/* Choose ONE primary map */}
            <LeafletMap height="450px" showDrainNetwork />
            <WardRiskSummary />

            {/* Optional alternate map (toggle later if needed) */}
            {/* <DelhiMap /> */}
          </div>

          {/* Prediction Panel */}
          <PredictionPanel />
        </div>

        {/* ================= Alerts & Weather ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AlertSystem />
          <LiveWeatherWidget />
        </div>

        {/* ================= Rainfall Monitoring ================= */}

        {/* ================= High Risk & Drainage ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <HighRiskZones />
          </div>
          <DrainageMetrics />
        </div>

        {/* ================= Footer ================= */}
        <footer className="glass-card p-4 text-center">
          <p className="text-sm text-muted-foreground">
            Delhi FloodWatch © 2024 | Data sources: IMD, OpenWeatherMap,
            Delhi Jal Board, MCD |
            <span className="text-primary ml-2">
              System refresh: Every 5 minutes
            </span>
          </p>
        </footer>
      </div>
    </Layout>
  );
};

export default Index;
