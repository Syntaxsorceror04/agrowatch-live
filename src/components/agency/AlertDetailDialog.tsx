import { Alert, alerts as allAlerts, mapHotspots, type MapHotspot } from "@/data/mockData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertTriangle,
  MapPin,
  Clock,
  Ruler,
  Bug,
  Users,
  Send,
  Navigation,
} from "lucide-react";
import { motion } from "framer-motion";

interface AlertDetailDialogProps {
  alert: Alert | null;
  hotspot: MapHotspot | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDispatch?: (alertId: string) => void;
  dispatchedAlerts?: Set<string>;
}

const urgencyConfig: Record<string, { label: string; class: string; bg: string }> = {
  high: { label: "HIGH PRIORITY", class: "text-destructive", bg: "bg-destructive/10" },
  medium: { label: "MEDIUM", class: "text-warning", bg: "bg-warning/10" },
  low: { label: "LOW", class: "text-success", bg: "bg-success/10" },
};

const AlertDetailDialog = ({
  alert,
  hotspot,
  open,
  onOpenChange,
  onDispatch,
  dispatchedAlerts,
}: AlertDetailDialogProps) => {
  // If opened via hotspot, show all alerts for that region
  const relatedAlerts = hotspot
    ? allAlerts.filter((a) => {
        const dist = Math.sqrt(
          Math.pow(a.coordinates.lat - hotspot.lat, 2) +
          Math.pow(a.coordinates.lng - hotspot.lng, 2)
        );
        return dist < 3;
      })
    : alert
    ? [alert]
    : [];

  const title = hotspot
    ? `${hotspot.city} — ${hotspot.alerts} Active Alerts`
    : alert
    ? `${alert.species.split(" (")[0]} Outbreak`
    : "";

  const subtitle = hotspot
    ? `Threat intensity: ${Math.round(hotspot.intensity * 100)}%`
    : alert
    ? alert.id
    : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <AlertTriangle className="h-5 w-5 text-agency" />
            {title}
          </DialogTitle>
          <DialogDescription>{subtitle}</DialogDescription>
        </DialogHeader>

        {/* Hotspot summary card */}
        {hotspot && (
          <div className="rounded-lg bg-agency-muted border border-agency/20 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold flex items-center gap-1.5">
                <Navigation className="h-3.5 w-3.5 text-agency" />
                {hotspot.city} Cluster
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                {hotspot.lat.toFixed(2)}°N, {hotspot.lng.toFixed(2)}°E
              </span>
            </div>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span>Intensity: <strong className="text-agency">{Math.round(hotspot.intensity * 100)}%</strong></span>
              <span>Alerts: <strong className="text-foreground">{hotspot.alerts}</strong></span>
            </div>
            {/* Intensity bar */}
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-agency"
                initial={{ width: 0 }}
                animate={{ width: `${hotspot.intensity * 100}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>
          </div>
        )}

        {/* Alert cards */}
        <div className="space-y-2.5">
          {relatedAlerts.map((a, i) => {
            const cfg = urgencyConfig[a.urgency];
            const dispatched = dispatchedAlerts?.has(a.id);
            return (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-lg border border-border bg-card p-3 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.class}`}>
                      {cfg.label}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">{a.id}</span>
                  </div>
                  {dispatched && (
                    <span className="text-[10px] text-success font-semibold flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                      Dispatched
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-sm">{a.species}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{a.description}</p>

                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {a.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Ruler className="h-3 w-3" /> {a.distance}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {a.reportedAt}
                  </span>
                  <span className="flex items-center gap-1">
                    <Bug className="h-3 w-3" />
                    {a.coordinates.lat.toFixed(2)}°N, {a.coordinates.lng.toFixed(2)}°E
                  </span>
                </div>

                {a.teamAssigned && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1 border-t border-border">
                    <Users className="h-3 w-3" />
                    <span>Assigned: <strong className="text-foreground">{a.teamAssigned}</strong></span>
                    {a.dispatchedAt && <span className="ml-auto text-success text-[10px]">Dispatched {a.dispatchedAt}</span>}
                  </div>
                )}

                {!dispatched && onDispatch && (
                  <button
                    onClick={() => onDispatch(a.id)}
                    className="btn-agency h-7 px-3 rounded-md text-xs flex items-center gap-1.5 w-full justify-center mt-1"
                  >
                    <Send className="h-3 w-3" /> Dispatch Team
                  </button>
                )}
              </motion.div>
            );
          })}

          {relatedAlerts.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">No alerts found for this location.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AlertDetailDialog;
