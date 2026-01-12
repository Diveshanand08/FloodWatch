import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import Index from "./pages/Index";
import CrowdsourcedMap from "./pages/CrowdsourcedMap";
import WardDashboard from "./pages/WardDashboard";
import DataAggregation from "./pages/DataAggregation";
import DrainageAnalytics from "./pages/DrainageAnalytics";
import PreparednessScorecard from "./pages/PreparednessScorecard";
import ReportFlood from "./pages/ReportFlood";
import NotFound from "./pages/NotFound";
import HeroSection from "./pages/landing"

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/dashboard" element={<Index />} />
            <Route path="/crowdsourced-map" element={<CrowdsourcedMap />} />
            <Route path="/ward-dashboard" element={<WardDashboard />} />
            <Route path="/data-aggregation" element={<DataAggregation />} />
            <Route path="/drainage-analytics" element={<DrainageAnalytics />} />
            <Route path="/preparedness" element={<PreparednessScorecard />} />
            <Route path="/" element={<HeroSection/>}/>
            {/* ✅ REPORT FLOOD ROUTE */}
            <Route path="/report-flood" element={<ReportFlood />} />

            {/* ❌ MUST BE LAST */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;