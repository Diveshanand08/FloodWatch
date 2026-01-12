import { FC } from "react";
import { useNavigate } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpeg";

const Landing: FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden text-white bg-[#050b14] flex flex-col">
      {/* ================= BACKGROUND ================= */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{ backgroundImage: `url(${heroBg})` }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/80 to-black" />

      {/* Animated grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating glow orbs */}
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-cyan-500/20 blur-[120px] rounded-full animate-float" />
      <div className="absolute bottom-20 -left-40 w-[500px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full animate-float delay-2000" />

      {/* ================= CONTENT ================= */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-grow px-6 text-center py-20">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/10 backdrop-blur border border-white/10 animate-fade">
          <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-sm text-white/80">
            Live Monitoring Active — Delhi NCR
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.2] mb-6 animate-slide pb-2">
          <span className="block">Real-time Flood</span>
          <span className="block bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent pb-1">
            Intelligence
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl text-white/70 text-base md:text-lg mb-8 animate-fade delay-200 leading-relaxed">
          AI-powered crowdsourced flood monitoring for Delhi NCR.
          Report incidents, view live hotspots, and stay safe during monsoon.
        </p>

        {/* Feature Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10 animate-fade delay-300">
          {[
            "🤖 AI-Powered Analysis",
            "🗺️ Interactive Maps",
            "📱 Real-time Alerts",
            "👥 Community Driven",
          ].map((text: string) => (
            <div
              key={text}
              className="px-4 py-2 rounded-full bg-white/5 backdrop-blur border border-white/10 text-sm text-white/80 hover:bg-white/10 hover:border-cyan-400/30 transition-all duration-300 cursor-default"
            >
              {text}
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate("/dashboard")}
          className="
            group relative px-10 py-4 rounded-xl font-semibold text-lg text-black
            bg-gradient-to-r from-cyan-400 to-blue-500
            hover:scale-105 hover:shadow-[0_0_50px_rgba(34,211,238,0.6)]
            transition-all duration-300 animate-slide delay-400
            overflow-hidden
          "
        >
          <span className="relative z-10 flex items-center gap-2">
            Get Started
            <span className="inline-block group-hover:translate-x-1 transition-transform duration-300">
              →
            </span>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>

        {/* ================= STATS ================= */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
          {[
            { value: "50+", label: "Live Hotspots", icon: "📍" },
            { value: "10+", label: "Reports Today", icon: "⚠️" },
            { value: "100+", label: "Active Users", icon: "👥" },
          ].map(
            (
              stat: { value: string; label: string; icon: string },
              i: number
            ) => (
              <div
                key={stat.label}
                className="
                  group relative bg-white/5 backdrop-blur border border-white/10
                  rounded-2xl p-8
                  hover:scale-105 hover:-translate-y-2
                  hover:shadow-[0_30px_80px_rgba(0,255,255,0.2)]
                  transition-all duration-500 animate-slide cursor-pointer
                "
                style={{ animationDelay: `${500 + i * 150}ms` }}
              >
                <div className="absolute inset-0 rounded-2xl bg-cyan-400/10 blur-xl opacity-0 group-hover:opacity-100 transition duration-500" />
                <div className="relative z-10 flex items-center gap-5">
                  <div className="h-14 w-14 flex items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-400/20 text-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                    {stat.icon}
                  </div>
                  <div className="text-left">
                    <div className="text-3xl font-bold group-hover:text-cyan-400 transition-colors duration-300">
                      {stat.value}
                    </div>
                    <div className="text-white/60 text-sm">
                      {stat.label}
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <footer className="relative z-10 w-full border-t border-white/10 bg-black/40 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 text-center">
          <p className="text-sm text-white/60">
            Created by{" "}
            <span className="font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              DELHI_FLOODWATCH
            </span>
          </p>
        </div>
      </footer>

      {/* ================= ANIMATIONS ================= */}
      <style>{`
        @keyframes fade {
          from { opacity: 0 }
          to { opacity: 1 }
        }
        @keyframes slide {
          from { opacity: 0; transform: translateY(40px) }
          to { opacity: 1; transform: translateY(0) }
        }
        @keyframes float {
          0%,100% { transform: translateY(0) }
          50% { transform: translateY(-30px) }
        }
        .animate-fade { animation: fade 1s ease forwards }
        .animate-slide { animation: slide 1s ease forwards }
        .animate-float { animation: float 20s ease-in-out infinite }
        .delay-200 { animation-delay: .2s }
        .delay-300 { animation-delay: .3s }
        .delay-400 { animation-delay: .4s }
        .delay-2000 { animation-delay: 2s }
      `}</style>
    </div>
  );
};

export default Landing;