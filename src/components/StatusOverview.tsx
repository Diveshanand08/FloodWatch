import {
  Cloud,
  Droplets,
  AlertTriangle,
  MapPin,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const StatusOverview = () => {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<any>(null);

 useEffect(() => {
  const fetchMetrics = async () => {
    const { data, error } = await supabase
      .from("city_metrics")
      .select("*")
      .eq("city", "delhi")
      .single();

    console.log("CITY METRICS DATA:", data);
    console.log("CITY METRICS ERROR:", error);

    if (data) setMetrics(data);
    setLoading(false);
  };

  fetchMetrics();
}, []);

  if (loading || !metrics) {
    return <div className="text-muted-foreground">Loading city status…</div>;
  }

  const stats = [
    {
      label: "Active Alerts",
      value: metrics.active_alerts,
      icon: AlertTriangle,
      change: "+ live",
      status: "warning" as const,
    },
    {
      label: "Current Rainfall",
      value: `${metrics.rainfall_mm_hr} mm/hr`,
      icon: Cloud,
      change: metrics.rainfall_severity,
      status: "high" as const,
    },
    {
      label: "High Risk Zones",
      value: metrics.high_risk_zones,
      icon: MapPin,
      change: "Out of 272 wards",
      status: "moderate" as const,
    },
    {
      label: "Drain Capacity",
      value: `${metrics.drain_capacity_percent}%`,
      icon: Droplets,
      change: metrics.drain_load,
      status: "low" as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className="glass-card-hover p-5 animate-fade-in"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <stat.icon className="w-5 h-5 text-primary" />
            </div>
            <Badge variant={stat.status}>{stat.status}</Badge>
          </div>

          <p className="text-3xl font-bold">{stat.value}</p>
          <p className="text-sm text-muted-foreground">{stat.label}</p>

          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
            <TrendingUp className="w-3 h-3" />
            {stat.change}
          </p>
        </div>
      ))}
    </div>
  );
};

export default StatusOverview;
