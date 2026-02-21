import { mapHotspots, type MapHotspot } from "@/data/mockData";
import { motion } from "framer-motion";

interface IndiaHeatMapProps {
  onHotspotClick?: (hotspot: MapHotspot) => void;
}

const IndiaHeatMap = ({ onHotspotClick }: IndiaHeatMapProps) => {
  const toSvg = (lat: number, lng: number) => {
    const x = ((lng - 68) / (90 - 68)) * 300 + 50;
    const y = ((35 - lat) / (35 - 6)) * 400 + 20;
    return { x, y };
  };

  return (
    <div className="relative w-full aspect-[4/5] max-h-[420px]">
      <svg viewBox="0 0 400 450" className="w-full h-full">
        <defs>
          {/* Radial gradients for hotspots */}
          {mapHotspots.map((spot, i) => {
            const { x, y } = toSvg(spot.lat, spot.lng);
            return (
              <radialGradient key={`grad-${i}`} id={`hotspot-grad-${i}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0.6 * spot.intensity} />
                <stop offset="60%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0.2 * spot.intensity} />
                <stop offset="100%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0} />
              </radialGradient>
            );
          })}
          {/* Map fill gradient */}
          <linearGradient id="map-fill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(120, 15%, 85%)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="hsl(120, 15%, 85%)" stopOpacity="0.15" />
          </linearGradient>
          {/* Glow filter */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background grid */}
        {[80, 130, 180, 230, 280, 330, 380].map((y) => (
          <line key={`h-${y}`} x1="40" y1={y} x2="370" y2={y} stroke="hsl(120, 10%, 88%)" strokeWidth="0.3" strokeDasharray="2,6" />
        ))}
        {[80, 130, 180, 230, 280, 330].map((x) => (
          <line key={`v-${x}`} x1={x} y1="20" x2={x} y2="430" stroke="hsl(120, 10%, 88%)" strokeWidth="0.3" strokeDasharray="2,6" />
        ))}

        {/* India outline */}
        <path
          d="M200,20 L240,30 L270,25 L290,40 L310,35 L330,50 L340,70 L335,90 L340,110 L350,130 L345,150 L340,170 L335,190 L340,210 L350,230 L345,250 L330,270 L310,290 L290,310 L270,330 L250,350 L230,370 L210,390 L200,410 L190,400 L180,380 L160,360 L140,340 L120,310 L100,280 L90,250 L80,220 L75,190 L80,160 L90,130 L100,100 L110,80 L130,60 L150,40 L170,25 Z"
          fill="url(#map-fill)"
          stroke="hsl(120, 36%, 26%)"
          strokeWidth="1.5"
          strokeOpacity="0.4"
        />

        {/* Terrain texture lines */}
        {[
          "M110,120 Q160,130 200,115 Q240,100 280,120",
          "M100,200 Q150,190 200,200 Q250,210 300,195",
          "M120,280 Q170,270 210,285 Q250,295 290,280",
        ].map((d, i) => (
          <path key={`terrain-${i}`} d={d} fill="none" stroke="hsl(120, 20%, 40%)" strokeWidth="0.4" strokeOpacity="0.2" strokeDasharray="4,8" />
        ))}

        {/* Heat zones (large radial fills) */}
        {mapHotspots.map((spot, i) => {
          const { x, y } = toSvg(spot.lat, spot.lng);
          const r = 35 * spot.intensity;
          return (
            <circle key={`heat-${i}`} cx={x} cy={y} r={r} fill={`url(#hotspot-grad-${i})`} />
          );
        })}

        {/* Hotspot markers */}
        {mapHotspots.map((spot, i) => {
          const { x, y } = toSvg(spot.lat, spot.lng);
          return (
            <g
              key={spot.city}
              className="cursor-pointer"
              onClick={() => onHotspotClick?.(spot)}
            >
              {/* Animated pulse ring */}
              <motion.circle
                cx={x}
                cy={y}
                r={14 * spot.intensity}
                fill="none"
                stroke="hsl(0, 72%, 51%)"
                strokeWidth="1"
                animate={{
                  r: [12 * spot.intensity, 22 * spot.intensity, 12 * spot.intensity],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4 }}
              />
              {/* Second pulse */}
              <motion.circle
                cx={x}
                cy={y}
                r={10 * spot.intensity}
                fill="none"
                stroke="hsl(0, 72%, 51%)"
                strokeWidth="0.5"
                animate={{
                  r: [8 * spot.intensity, 18 * spot.intensity, 8 * spot.intensity],
                  opacity: [0.3, 0, 0.3],
                }}
                transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4 + 0.6 }}
              />
              {/* Core dot with glow */}
              <circle
                cx={x}
                cy={y}
                r={5 * spot.intensity}
                fill="hsl(0, 72%, 51%)"
                fillOpacity={0.9}
                filter="url(#glow)"
              />
              <circle
                cx={x}
                cy={y}
                r={2.5 * spot.intensity}
                fill="hsl(0, 100%, 70%)"
                fillOpacity={0.8}
              />

              {/* City label */}
              <rect
                x={x - 24}
                y={y - 24}
                width={48}
                height={14}
                rx={3}
                fill="hsl(0, 0%, 0%)"
                fillOpacity={0.55}
              />
              <text
                x={x}
                y={y - 14}
                textAnchor="middle"
                fill="white"
                fontSize="8"
                fontWeight="600"
                fontFamily="Inter, sans-serif"
              >
                {spot.city}
              </text>

              {/* Alert count badge */}
              <rect
                x={x - 16}
                y={y + 10}
                width={32}
                height={13}
                rx={6.5}
                fill="hsl(0, 72%, 51%)"
                fillOpacity={0.85}
              />
              <text
                x={x}
                y={y + 19}
                textAnchor="middle"
                fill="white"
                fontSize="7.5"
                fontWeight="700"
                fontFamily="JetBrains Mono, monospace"
              >
                {spot.alerts} alerts
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-2 left-2 flex gap-3 text-[10px] bg-card/80 backdrop-blur-sm rounded-md px-2.5 py-1.5 border border-border/50">
        <span className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-agency shadow-[0_0_6px_hsl(0,72%,51%)]" /> Critical
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-warning" /> Moderate
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-success" /> Low
        </span>
      </div>

      {/* Live indicator */}
      <div className="absolute top-2 right-2 flex items-center gap-1.5 text-[10px] font-semibold bg-card/80 backdrop-blur-sm rounded-md px-2 py-1 border border-border/50">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-agency opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-agency" />
        </span>
        LIVE
      </div>
    </div>
  );
};

export default IndiaHeatMap;
