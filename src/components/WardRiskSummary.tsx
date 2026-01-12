import { AlertTriangle, Droplets, CloudRain, Clock } from "lucide-react";

const WardRiskSummary = () => {
  return (
    <div className="glass-card p-5 space-y-5">
      <h3 className="text-sm font-semibold text-foreground">
        Ward Risk Snapshot
      </h3>

      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-foreground">
            Critical Zones Identified
          </p>
          <p className="text-xs text-muted-foreground">
            Multiple wards showing high waterlogging probability due to
            concentrated rainfall and low drainage efficiency.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <CloudRain className="w-5 h-5 text-blue-400 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-foreground">
            Rainfall Intensity
          </p>
          <p className="text-xs text-muted-foreground">
            Persistent moderate-to-heavy rainfall observed across central and
            east Delhi regions.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <Droplets className="w-5 h-5 text-cyan-400 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-foreground">
            Drainage Stress
          </p>
          <p className="text-xs text-muted-foreground">
            Older drainage networks operating near capacity in dense urban
            wards.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <Clock className="w-5 h-5 text-primary mt-0.5" />
        <div>
          <p className="text-sm font-medium text-foreground">
            Update Frequency
          </p>
          <p className="text-xs text-muted-foreground">
            System refreshes flood risk indicators every 5 minutes.
          </p>
        </div>
      </div>

      {/* ===== Images Row ===== */}
      <div className="flex gap-3 pt-3">
        <img
          src="images/locations/hansraj-gupta.jpg"
          alt="Flood risk map"
          className="w-1/3 h-26 object-cover rounded-lg border border-border/40"
        />
        <img
          src="images/locations/adarsh-nagar.jpg"
          alt="Rainfall intensity"
          className="w-1/3 h-26 object-cover rounded-lg border border-border/40"
        />
        <img
          src="images/locations/bhishma-marg.jpg"
          alt="Rainfall intensity"
          className="w-1/3 h-26 object-cover rounded-lg border border-border/40"
        />
      </div>
    </div>
  );
};

export default WardRiskSummary;
