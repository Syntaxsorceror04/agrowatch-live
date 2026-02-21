import { mapHotspots } from "@/data/mockData";
import { motion } from "framer-motion";

// Simplified SVG India map outline with hotspot markers
const IndiaHeatMap = () => {
  // Map coordinates to SVG positions (rough approximation)
  const toSvg = (lat: number, lng: number) => {
    const x = ((lng - 68) / (90 - 68)) * 300 + 50;
    const y = ((35 - lat) / (35 - 6)) * 400 + 20;
    return { x, y };
  };

  return (
    <div className="relative w-full aspect-[4/5] max-h-[420px]">
      <svg viewBox="0 0 400 450" className="w-full h-full">
        {/* India outline simplified */}
        <path
          d="M200,20 L240,30 L270,25 L290,40 L310,35 L330,50 L340,70 L335,90 L340,110 L350,130 L345,150 L340,170 L335,190 L340,210 L350,230 L345,250 L330,270 L310,290 L290,310 L270,330 L250,350 L230,370 L210,390 L200,410 L190,400 L180,380 L160,360 L140,340 L120,310 L100,280 L90,250 L80,220 L75,190 L80,160 L90,130 L100,100 L110,80 L130,60 L150,40 L170,25 Z"
          className="fill-earth-muted/50 stroke-earth/30"
          strokeWidth="2"
        />

        {/* Grid lines */}
        {[100, 150, 200, 250, 300, 350].map((y) => (
          <line
            key={`h-${y}`}
            x1="60"
            y1={y}
            x2="360"
            y2={y}
            className="stroke-border/30"
            strokeWidth="0.5"
            strokeDasharray="4,4"
          />
        ))}

        {/* Hotspots */}
        {mapHotspots.map((spot, i) => {
          const { x, y } = toSvg(spot.lat, spot.lng);
          return (
            <g key={spot.city}>
              {/* Outer pulse */}
              <motion.circle
                cx={x}
                cy={y}
                r={20 * spot.intensity}
                className="fill-agency/15"
                animate={{ r: [16 * spot.intensity, 24 * spot.intensity, 16 * spot.intensity], opacity: [0.3, 0.1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              />
              {/* Inner dot */}
              <circle
                cx={x}
                cy={y}
                r={6 * spot.intensity}
                className="fill-agency/70 stroke-agency"
                strokeWidth="1.5"
              />
              {/* Label */}
              <text
                x={x}
                y={y - 12}
                textAnchor="middle"
                className="fill-foreground text-[10px] font-semibold"
              >
                {spot.city}
              </text>
              <text
                x={x}
                y={y + 20}
                textAnchor="middle"
                className="fill-agency text-[9px] font-mono font-semibold"
              >
                {spot.alerts} alerts
              </text>
            </g>
          );
        })}
      </svg>

      {/* NDVI Toggle Legend */}
      <div className="absolute bottom-2 left-2 flex gap-2 text-[10px]">
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-agency" /> High
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-warning" /> Medium
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-success" /> Low
        </span>
      </div>
    </div>
  );
};

export default IndiaHeatMap;
