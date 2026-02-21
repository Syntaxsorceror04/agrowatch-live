import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  MapPin,
  Clock,
  Send,
  ChevronDown,
  Download,
  Filter,
  Map,
  Users,
  Zap,
  Layers,
} from "lucide-react";
import {
  alerts as allAlerts,
  stats,
  teams,
  regions,
  speciesList,
  type Urgency,
  type Alert,
} from "@/data/mockData";
import IndiaHeatMap from "@/components/agency/IndiaHeatMap";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";

const urgencyColors: Record<Urgency, string> = {
  high: "badge-urgency-high",
  medium: "badge-urgency-medium",
  low: "badge-urgency-low",
};

const AgencyDashboard = () => {
  const [urgencyFilter, setUrgencyFilter] = useState<string>("all");
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const [speciesFilter, setSpeciesFilter] = useState<string>("all");
  const [satelliteOverlay, setSatelliteOverlay] = useState(false);
  const [dispatchedAlerts, setDispatchedAlerts] = useState<Set<string>>(
    new Set(["ALT-001"])
  );
  const [teamAssignments, setTeamAssignments] = useState<
    Record<string, string>
  >({ "ALT-001": "Alpha Response Unit" });

  const filtered = allAlerts.filter((a) => {
    if (urgencyFilter !== "all" && a.urgency !== urgencyFilter) return false;
    if (regionFilter !== "all" && !a.location.includes(regionFilter))
      return false;
    if (speciesFilter !== "all" && !a.species.includes(speciesFilter))
      return false;
    return true;
  });

  const highCount = allAlerts.filter((a) => a.urgency === "high").length;

  const handleDispatch = (alertId: string) => {
    if (!teamAssignments[alertId]) {
      toast.error("Please assign a team first");
      return;
    }
    setDispatchedAlerts((s) => new Set([...s, alertId]));
    toast.success(
      `Team dispatched: ${teamAssignments[alertId]} → ${alertId}`
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-4 md:py-6 space-y-4 md:space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold flex items-center gap-2">
              <AlertTriangle className="h-7 w-7 text-agency" />
              <span className="text-agency">{highCount}</span> High Priority
              Alerts
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              {stats.totalAlerts} total alerts across {regions.length} regions
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                toast.success("KML file exported");
              }}
              className="h-9 px-3 rounded-lg border border-border bg-card text-sm font-medium flex items-center gap-1.5 hover:bg-accent transition-colors"
            >
              <Download className="h-3.5 w-3.5" /> KML
            </button>
            <button
              onClick={() => {
                toast.success("CSV file exported");
              }}
              className="h-9 px-3 rounded-lg border border-border bg-card text-sm font-medium flex items-center gap-1.5 hover:bg-accent transition-colors"
            >
              <Download className="h-3.5 w-3.5" /> CSV
            </button>
          </div>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {
              label: "High Alerts",
              value: stats.highAlerts,
              icon: Zap,
              color: "text-agency",
              bg: "bg-agency-muted",
            },
            {
              label: "Medium",
              value: stats.mediumAlerts,
              icon: AlertTriangle,
              color: "text-warning",
              bg: "bg-warning/10",
            },
            {
              label: "Teams Active",
              value: stats.teamsActive,
              icon: Users,
              color: "text-expert",
              bg: "bg-expert-muted",
            },
            {
              label: "Species Tracked",
              value: stats.speciesTracked,
              icon: Layers,
              color: "text-earth",
              bg: "bg-earth-muted",
            },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card rounded-xl p-4"
            >
              <div className={`h-8 w-8 rounded-lg ${s.bg} flex items-center justify-center mb-2`}>
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </div>
              <div className="stat-value">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Main Grid: Map + Alerts */}
        <div className="grid lg:grid-cols-5 gap-4 md:gap-6">
          {/* Map Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 glass-card rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-sm flex items-center gap-1.5">
                <Map className="h-4 w-4 text-agency" /> Live Threat Map
              </h2>
              <button
                onClick={() => setSatelliteOverlay(!satelliteOverlay)}
                className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                  satelliteOverlay
                    ? "bg-earth text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {satelliteOverlay ? "NDVI On" : "Satellite"}
              </button>
            </div>
            <div
              className={`rounded-lg overflow-hidden transition-all ${
                satelliteOverlay ? "bg-earth/5 ring-1 ring-earth/20" : ""
              }`}
            >
              <IndiaHeatMap />
            </div>
          </motion.div>

          {/* Alerts List */}
          <div className="lg:col-span-3 space-y-3">
            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Filter className="h-3.5 w-3.5" />
              </div>
              <select
                value={urgencyFilter}
                onChange={(e) => setUrgencyFilter(e.target.value)}
                className="h-8 rounded-lg border border-input bg-card px-2 text-xs font-medium outline-none"
              >
                <option value="all">All Urgency</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="h-8 rounded-lg border border-input bg-card px-2 text-xs font-medium outline-none"
              >
                <option value="all">All Regions</option>
                {regions.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <select
                value={speciesFilter}
                onChange={(e) => setSpeciesFilter(e.target.value)}
                className="h-8 rounded-lg border border-input bg-card px-2 text-xs font-medium outline-none"
              >
                <option value="all">All Species</option>
                {speciesList.map((s) => (
                  <option key={s} value={s.split(" (")[0]}>
                    {s.split(" (")[0]}
                  </option>
                ))}
              </select>
            </div>

            {/* Alert Cards */}
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              <AnimatePresence mode="popLayout">
                {filtered.map((alert, i) => (
                  <motion.div
                    key={alert.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.02 }}
                    className={`glass-card rounded-xl p-4 ${
                      dispatchedAlerts.has(alert.id) ? "ring-1 ring-success/30" : ""
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={urgencyColors[alert.urgency]}>
                            {alert.urgency}
                          </span>
                          <span className="font-mono text-xs text-muted-foreground">
                            {alert.id}
                          </span>
                        </div>
                        <h3 className="font-bold text-sm truncate">
                          {alert.species.split(" (")[0]}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {alert.description}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {alert.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {alert.reportedAt}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                        {dispatchedAlerts.has(alert.id) ? (
                          <div className="text-xs text-success font-semibold flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-success animate-pulse-dot" />
                            Team dispatched {alert.dispatchedAt || "now"}
                          </div>
                        ) : (
                          <>
                            <select
                              value={teamAssignments[alert.id] || ""}
                              onChange={(e) =>
                                setTeamAssignments((prev) => ({
                                  ...prev,
                                  [alert.id]: e.target.value,
                                }))
                              }
                              className="h-8 rounded-lg border border-input bg-card px-2 text-xs outline-none min-w-[140px]"
                            >
                              <option value="">Assign team...</option>
                              {teams.map((t) => (
                                <option key={t} value={t}>
                                  {t}
                                </option>
                              ))}
                            </select>
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => handleDispatch(alert.id)}
                              className="btn-agency h-8 px-3 rounded-lg text-xs flex items-center gap-1.5"
                            >
                              <Send className="h-3 w-3" /> Dispatch
                            </motion.button>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AgencyDashboard;
