import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

console.log("SUPABASE URL:", import.meta.env.VITE_SUPABASE_URL);
console.log(
  "SUPABASE KEY:",
  import.meta.env.VITE_SUPABASE_ANON_KEY?.slice(0, 20)
);

const ReportFlood = () => {
  const navigate = useNavigate();

  const [location, setLocation] = useState("");
  const [depth, setDepth] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!location || !depth) {
      toast({
        title: "Missing data",
        description: "Location and water depth are required",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("flood_reports")
      .insert({
        location,
        water_depth_ft: Number(depth),
        notes,
      });

    setLoading(false);

    if (error) {
      toast({
        title: "Submission failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Flood reported ✅",
        description: "Thank you for helping the community!",
      });

      navigate("/crowdsourced-map");
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold">Report Flood</h1>

        <Input
          placeholder="Location (e.g. Karol Bagh Metro)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <Input
          type="number"
          step="0.1"
          placeholder="Water depth (ft)"
          value={depth}
          onChange={(e) => setDepth(e.target.value)}
        />

        <Textarea
          placeholder="Additional notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <Button onClick={handleSubmit} disabled={loading} className="w-full">
          {loading ? "Submitting..." : "Submit Flood Report"}
        </Button>
      </div>
    </Layout>
  );
};

export default ReportFlood;
