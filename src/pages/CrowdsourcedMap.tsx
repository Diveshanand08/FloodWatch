import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import {
  Camera,
  Clock,
  CheckCircle,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  Plus,
  Loader2,
  MapPin,
} from "lucide-react";

import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  LayersControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

/* ================= TYPES ================= */

interface Report {
  id: string;
  location: string;
  ward: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  waterDepth: string;
  confidence: number;
  status: "verified" | "pending" | "flagged";
  upvotes: number;
  downvotes: number;
  mlDetection: {
    estimatedDepth: string;
    severity: "low" | "moderate" | "high" | "critical";
  };
}

/* ================= DATA ================= */

const reports: Report[] = [
  {
    id: "1",
    location: "Minto Road Underpass",
    ward: "Connaught Place",
    latitude: 28.634,
    longitude: 77.2245,
    timestamp: "5 min ago",
    waterDepth: "2.5 ft",
    confidence: 94,
    status: "verified",
    upvotes: 28,
    downvotes: 2,
    mlDetection: { estimatedDepth: "2.3–2.7 ft", severity: "high" },
  },
  {
    id: "2",
    location: "ITO Junction",
    ward: "ITO",
    latitude: 28.628,
    longitude: 77.241,
    timestamp: "12 min ago",
    waterDepth: "1.8 ft",
    confidence: 87,
    status: "verified",
    upvotes: 15,
    downvotes: 1,
    mlDetection: { estimatedDepth: "1.5–2.0 ft", severity: "moderate" },
  },
  {
    id: "3",
    location: "Lajpat Nagar Market",
    ward: "Lajpat Nagar",
    latitude: 28.57,
    longitude: 77.243,
    timestamp: "18 min ago",
    waterDepth: "3.2 ft",
    confidence: 91,
    status: "pending",
    upvotes: 8,
    downvotes: 0,
    mlDetection: { estimatedDepth: "3.0–3.5 ft", severity: "critical" },
  },
  {
    id: "4",
    location: "Rajouri Garden Metro",
    ward: "Rajouri Garden",
    latitude: 28.649,
    longitude: 77.122,
    timestamp: "25 min ago",
    waterDepth: "1.2 ft",
    confidence: 78,
    status: "flagged",
    upvotes: 3,
    downvotes: 5,
    mlDetection: { estimatedDepth: "0.8–1.5 ft", severity: "low" },
  },
  {
    id: "5",
    location: "Karol Bagh Metro Station",
    ward: "Karol Bagh",
    latitude: 28.6448,
    longitude: 77.1905,
    timestamp: "35 min ago",
    waterDepth: "1.5 ft",
    confidence: 81,
    status: "verified",
    upvotes: 19,
    downvotes: 1,
    mlDetection: { estimatedDepth: "1.3–1.7 ft", severity: "moderate" },
  },
  {
    id: "6",
    location: "Patel Nagar Flyover",
    ward: "Patel Nagar",
    latitude: 28.6576,
    longitude: 77.1687,
    timestamp: "50 min ago",
    waterDepth: "2.2 ft",
    confidence: 89,
    status: "verified",
    upvotes: 24,
    downvotes: 2,
    mlDetection: { estimatedDepth: "2.0–2.4 ft", severity: "high" },
  },
  {
    id: "7",
    location: "Yamuna Bank Metro Road",
    ward: "Yamuna Bank",
    latitude: 28.6233,
    longitude: 77.3057,
    timestamp: "1 hr ago",
    waterDepth: "3.6 ft",
    confidence: 93,
    status: "pending",
    upvotes: 11,
    downvotes: 0,
    mlDetection: { estimatedDepth: "3.4–3.8 ft", severity: "critical" },
  },
];

/* ================= HELPERS ================= */

const severityColor = (s: Report["mlDetection"]["severity"]) => {
  switch (s) {
    case "low":
      return "#22c55e";
    case "moderate":
      return "#facc15";
    case "high":
      return "#fb923c";
    case "critical":
      return "#ef4444";
  }
};

const statusBadge = (status: Report["status"]) => {
  switch (status) {
    case "verified":
      return { icon: CheckCircle, label: "Verified", color: "text-green-500" };
    case "pending":
      return { icon: Clock, label: "Pending", color: "text-yellow-500" };
    case "flagged":
      return { icon: AlertTriangle, label: "Flagged", color: "text-red-500" };
  }
};

/* ================= COMPONENT ================= */

const CrowdsourcedMap = () => {
  const [filter, setFilter] = useState<"all" | "verified" | "pending">("all");

  const filteredReports = reports.filter(
    (r) => filter === "all" || r.status === filter
  );

  return (
    <Layout>
      <Helmet>
        <title>Crowdsourced Flood Map | Delhi FloodWatch</title>
      </Helmet>

      <div className="p-6 space-y-6">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">
              AI-Powered Crowdsourced Flood Map
            </h1>
            <p className="text-muted-foreground">
              Real-time citizen reports with AI-assisted flood severity analysis
            </p>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card p-4">
            <Camera className="w-5 h-5 text-primary mb-1" />
            <p className="text-xl font-bold">1</p>
            <p className="text-xs text-muted-foreground">Reports Today</p>
          </div>
          <div className="glass-card p-4">
            <CheckCircle className="w-5 h-5 text-green-500 mb-1" />
            <p className="text-xl font-bold">99</p>
            <p className="text-xs text-muted-foreground">Verified</p>
          </div>
          <div className="glass-card p-4">
            <Loader2 className="w-5 h-5 text-yellow-500 mb-1 animate-spin" />
            <p className="text-xl font-bold">3</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </div>
          <div className="glass-card p-4">
            <AlertTriangle className="w-5 h-5 text-red-500 mb-1" />
            <p className="text-xl font-bold">12</p>
            <p className="text-xs text-muted-foreground">Hotspots</p>
          </div>
        </div>

        {/* MAP + LIST */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* MAP */}
          <div className="lg:col-span-2 glass-card p-6 space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold">Live Flood Reports Map</h2>
              <div className="flex gap-2">
                {["all", "verified", "pending"].map((f) => (
                  <Button
                    key={f}
                    size="sm"
                    variant={filter === f ? "default" : "outline"}
                    onClick={() => setFilter(f as any)}
                  >
                    {f}
                  </Button>
                ))}
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Markers are color-coded by flood severity. Switch Street/Satellite view.
            </p>

            <div className="h-[420px] rounded-xl overflow-hidden border">
              <MapContainer
                center={[28.6139, 77.209]}
                zoom={11}
                className="h-full w-full"
              >
                <LayersControl position="bottomleft">
                  <LayersControl.BaseLayer checked name="Street">
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  </LayersControl.BaseLayer>
                  <LayersControl.BaseLayer name="Satellite">
                    <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
                  </LayersControl.BaseLayer>
                </LayersControl>

                {filteredReports.map((r) => (
                  <CircleMarker
                    key={r.id}
                    center={[r.latitude, r.longitude]}
                    radius={10}
                    pathOptions={{
                      color: severityColor(r.mlDetection.severity),
                      fillColor: severityColor(r.mlDetection.severity),
                      fillOpacity: 0.75,
                    }}
                  >
                    <Popup>
                      <strong>{r.location}</strong>
                      <br />
                      {r.ward}
                      <br />
                      Depth: {r.waterDepth}
                      <br />
                      Confidence: {r.confidence}%
                    </Popup>
                  </CircleMarker>
                ))}
              </MapContainer>
            </div>

            {/* COMPACT INFO BAR */}
            <div className="glass-card px-4 py-3 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full" /> Low
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full" /> Moderate
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-orange-400 rounded-full" /> High
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-red-500 rounded-full" /> Critical
                </span>
              </div>

              <span className="text-muted-foreground">
                {filteredReports.length} active reports • AI + crowd validated
              </span>

              <span className="text-muted-foreground">
                Avoid underpasses & low-lying roads
              </span>
            </div>
          </div>

          {/* REPORT LIST */}
          <div className="glass-card p-6">
            <h2 className="font-semibold mb-3"></h2>
            <div className="space-y-3">
              {filteredReports.map((r) => {
                const s = statusBadge(r.status);
                const Icon = s.icon;
                return (
                  <div
                    key={r.id}
                    className="p-3 rounded-lg bg-secondary/30 border"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">{r.location}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {r.ward} • {r.timestamp}
                        </p>
                      </div>
                      <span className={`text-xs flex items-center gap-1 ${s.color}`}>
                        <Icon className="w-3 h-3" /> {s.label}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs mt-2">
                      <Badge>{r.waterDepth}</Badge>
                      <span className="flex gap-2 text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3" /> {r.upvotes}
                        </span>
                        <span className="flex items-center gap-1">
                          <ThumbsDown className="w-3 h-3" /> {r.downvotes}
                        </span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CrowdsourcedMap;
