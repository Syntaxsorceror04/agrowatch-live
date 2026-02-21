import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Download,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  User,
  Sparkles,
  Image,
  CheckCheck,
  Loader2,
} from "lucide-react";
import {
  reports as initialReports,
  stats,
  type Report,
  type ReportStatus,
} from "@/data/mockData";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";

const ExpertDashboard = () => {
  const [reports, setReports] = useState<Report[]>(initialReports);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [notesMap, setNotesMap] = useState<Record<string, string>>({});
  const [isVerifying, setIsVerifying] = useState(false);

  const pendingReports = reports.filter((r) => r.status === "pending");
  const verifiedCount = reports.filter((r) => r.status === "approved").length;
  const rejectedCount = reports.filter((r) => r.status === "rejected").length;
  const current = pendingReports[currentIndex];

  const updateStatus = (id: string, status: ReportStatus) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status, notes: notesMap[id] || r.notes } : r))
    );
    if (currentIndex >= pendingReports.length - 1) {
      setCurrentIndex(Math.max(0, currentIndex - 1));
    }
    const label =
      status === "approved"
        ? "Approved ✓"
        : status === "rejected"
        ? "Rejected ✗"
        : "Needs more info";
    toast.success(`${id}: ${label}`);
  };

  const handleBulkVerify = () => {
    if (selectedIds.size === 0) {
      toast.error("Select reports first");
      return;
    }
    setIsVerifying(true);
    setTimeout(() => {
      setReports((prev) =>
        prev.map((r) =>
          selectedIds.has(r.id) ? { ...r, status: "approved" } : r
        )
      );
      toast.success(`${selectedIds.size} reports verified successfully!`);
      setSelectedIds(new Set());
      setIsVerifying(false);
      setCurrentIndex(0);
    }, 1200);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selectedIds.size === pendingReports.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(pendingReports.map((r) => r.id)));
    }
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
              <Image className="h-7 w-7 text-expert" />
              <span className="text-expert">{pendingReports.length}</span>{" "}
              Reports Awaiting Verification
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              {stats.verifiedThisMonth} verified this month • {verifiedCount}{" "}
              approved today
            </p>
          </div>
          <button
            onClick={() => toast.success("Training data download started (2.4k images)")}
            className="h-9 px-4 rounded-lg border border-border bg-card text-sm font-medium flex items-center gap-1.5 hover:bg-accent transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            ML Export (2.4k images)
          </button>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "Pending",
              value: pendingReports.length,
              color: "text-expert",
              bg: "bg-expert-muted",
            },
            {
              label: "Approved",
              value: verifiedCount,
              color: "text-success",
              bg: "bg-success/10",
            },
            {
              label: "Rejected",
              value: rejectedCount,
              color: "text-agency",
              bg: "bg-agency-muted",
            },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card rounded-xl p-4 text-center"
            >
              <div className={`stat-value ${s.color}`}>{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {pendingReports.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card rounded-xl p-12 text-center"
          >
            <CheckCircle2 className="h-12 w-12 text-success mx-auto mb-3" />
            <h2 className="text-xl font-bold">All reports verified!</h2>
            <p className="text-muted-foreground text-sm mt-1">
              No pending reports remaining.
            </p>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-5 gap-4 md:gap-6">
            {/* Photo Carousel / Current Report */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-3 space-y-4"
            >
              {current && (
                <div className="glass-card rounded-xl overflow-hidden">
                  {/* Image */}
                  <div className="relative bg-muted aspect-video">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={current.id}
                        src={current.photoUrl}
                        alt={current.species}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.25 }}
                        className="w-full h-full object-cover"
                      />
                    </AnimatePresence>

                    {/* Nav arrows */}
                    <button
                      onClick={() =>
                        setCurrentIndex(Math.max(0, currentIndex - 1))
                      }
                      disabled={currentIndex === 0}
                      className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center disabled:opacity-30"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() =>
                        setCurrentIndex(
                          Math.min(pendingReports.length - 1, currentIndex + 1)
                        )
                      }
                      disabled={currentIndex >= pendingReports.length - 1}
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center disabled:opacity-30"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>

                    {/* Counter */}
                    <div className="absolute top-2 right-2 bg-card/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-mono">
                      {currentIndex + 1}/{pendingReports.length}
                    </div>

                    {/* Confidence */}
                    <div className="absolute bottom-2 left-2 bg-card/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-expert" />
                      ML: {(current.confidence * 100).toFixed(0)}%
                    </div>
                  </div>

                  {/* Report Details */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold">{current.species}</h3>
                        <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {current.coordinates.lat}°N,{" "}
                            {current.coordinates.lng}°E
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />{" "}
                            {new Date(current.timestamp).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" /> {current.reportedBy}
                          </span>
                        </div>
                      </div>
                      <span className="font-mono text-xs text-muted-foreground">
                        {current.id}
                      </span>
                    </div>

                    {/* Satellite Comparison */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-lg bg-muted aspect-video flex items-center justify-center text-xs text-muted-foreground">
                        <div className="text-center">
                          <Image className="h-5 w-5 mx-auto mb-1 opacity-50" />
                          Citizen Photo
                        </div>
                      </div>
                      <div className="rounded-lg bg-earth-muted aspect-video flex items-center justify-center text-xs text-muted-foreground">
                        <div className="text-center">
                          <Sparkles className="h-5 w-5 mx-auto mb-1 opacity-50" />
                          Sentinel-2 Imagery
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    <textarea
                      value={notesMap[current.id] || ""}
                      onChange={(e) =>
                        setNotesMap((prev) => ({
                          ...prev,
                          [current.id]: e.target.value,
                        }))
                      }
                      placeholder="Add verification notes..."
                      className="w-full h-16 rounded-lg border border-input bg-card/50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/30 resize-none"
                    />

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => updateStatus(current.id, "approved")}
                        className="flex-1 h-10 rounded-lg bg-success text-success-foreground font-semibold text-sm flex items-center justify-center gap-1.5 transition-colors hover:opacity-90"
                      >
                        <CheckCircle2 className="h-4 w-4" /> APPROVE
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => updateStatus(current.id, "rejected")}
                        className="flex-1 h-10 rounded-lg bg-agency text-agency-foreground font-semibold text-sm flex items-center justify-center gap-1.5 transition-colors hover:opacity-90"
                      >
                        <XCircle className="h-4 w-4" /> REJECT
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() =>
                          updateStatus(current.id, "needs_info")
                        }
                        className="flex-1 h-10 rounded-lg bg-warning text-warning-foreground font-semibold text-sm flex items-center justify-center gap-1.5 transition-colors hover:opacity-90"
                      >
                        <HelpCircle className="h-4 w-4" /> INFO
                      </motion.button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Report Queue / Bulk Tools */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 space-y-3"
            >
              {/* Bulk Actions */}
              <div className="glass-card rounded-xl p-3 flex items-center justify-between">
                <button
                  onClick={selectAll}
                  className="text-xs font-medium text-expert hover:underline"
                >
                  {selectedIds.size === pendingReports.length
                    ? "Deselect All"
                    : `Select All (${pendingReports.length})`}
                </button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleBulkVerify}
                  disabled={isVerifying || selectedIds.size === 0}
                  className="btn-expert h-8 px-3 rounded-lg text-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isVerifying ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <CheckCheck className="h-3 w-3" />
                  )}
                  Verify {selectedIds.size > 0 ? `(${selectedIds.size})` : ""}
                </motion.button>
              </div>

              {/* Report List */}
              <div className="space-y-1.5 max-h-[550px] overflow-y-auto pr-1">
                {pendingReports.map((report, i) => (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    onClick={() => setCurrentIndex(i)}
                    className={`glass-card rounded-lg p-3 cursor-pointer transition-all ${
                      i === currentIndex ? "ring-2 ring-expert/40" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(report.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleSelect(report.id);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="h-4 w-4 rounded border-input accent-expert"
                      />
                      <img
                        src={report.photoUrl}
                        alt={report.species}
                        className="h-10 w-10 rounded-md object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold truncate">
                          {report.species.split(" (")[0]}
                        </div>
                        <div className="text-[11px] text-muted-foreground truncate">
                          {report.reportedBy} • {report.coordinates.lat}°N
                        </div>
                      </div>
                      <div className="text-[10px] font-mono text-muted-foreground">
                        {(report.confidence * 100).toFixed(0)}%
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ExpertDashboard;
