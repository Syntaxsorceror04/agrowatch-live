export type Urgency = "high" | "medium" | "low";
export type ReportStatus = "pending" | "approved" | "rejected" | "needs_info";

export interface Alert {
  id: string;
  species: string;
  location: string;
  coordinates: { lat: number; lng: number };
  urgency: Urgency;
  description: string;
  distance: string;
  reportedAt: string;
  teamAssigned?: string;
  dispatchedAt?: string;
}

export interface Report {
  id: string;
  photoUrl: string;
  species: string;
  location: string;
  coordinates: { lat: number; lng: number };
  timestamp: string;
  reportedBy: string;
  status: ReportStatus;
  notes: string;
  confidence: number;
}

export interface MapHotspot {
  city: string;
  lat: number;
  lng: number;
  intensity: number;
  alerts: number;
}

export const teams = [
  "Alpha Response Unit",
  "Beta Field Team",
  "Gamma Survey Unit",
  "Delta Rapid Response",
  "Epsilon Ground Crew",
];

export const regions = [
  "Tamil Nadu",
  "Karnataka",
  "Kerala",
  "Andhra Pradesh",
  "Maharashtra",
  "Rajasthan",
];

export const speciesList = [
  "Kudzu (Pueraria montana)",
  "Lantana (Lantana camara)",
  "Prosopis juliflora",
  "Water Hyacinth (Eichhornia crassipes)",
  "Parthenium hysterophorus",
  "Senna spectabilis",
];

export const alerts: Alert[] = [
  {
    id: "ALT-001",
    species: "Kudzu (Pueraria montana)",
    location: "NH-48 Corridor, Karnataka",
    coordinates: { lat: 12.97, lng: 77.59 },
    urgency: "high",
    description: "Kudzu outbreak detected — 8km from highway. Rapid spread risk to adjacent farmland.",
    distance: "8km from NH-48",
    reportedAt: "2 hours ago",
    teamAssigned: "Alpha Response Unit",
    dispatchedAt: "2hrs ago",
  },
  {
    id: "ALT-002",
    species: "Lantana (Lantana camara)",
    location: "Bandipur Tiger Reserve, Karnataka",
    coordinates: { lat: 11.67, lng: 76.63 },
    urgency: "high",
    description: "Dense Lantana infestation blocking wildlife corridors. Elephant movement disrupted.",
    distance: "Inside reserve boundary",
    reportedAt: "4 hours ago",
  },
  {
    id: "ALT-003",
    species: "Prosopis juliflora",
    location: "Rann of Kutch, Gujarat",
    coordinates: { lat: 23.73, lng: 69.86 },
    urgency: "high",
    description: "Prosopis spreading into grasslands, threatening endemic species habitat.",
    distance: "15km spread radius",
    reportedAt: "6 hours ago",
  },
  {
    id: "ALT-004",
    species: "Water Hyacinth (Eichhornia crassipes)",
    location: "Vembanad Lake, Kerala",
    coordinates: { lat: 9.59, lng: 76.39 },
    urgency: "high",
    description: "Water Hyacinth covering 40% of lake surface. Fishery operations at risk.",
    distance: "Lake-wide",
    reportedAt: "1 hour ago",
  },
  {
    id: "ALT-005",
    species: "Parthenium hysterophorus",
    location: "Pune Outskirts, Maharashtra",
    coordinates: { lat: 18.52, lng: 73.86 },
    urgency: "high",
    description: "Congress grass invasion near agricultural belt. Allergenic risk to farm workers.",
    distance: "3km from settlements",
    reportedAt: "3 hours ago",
  },
  {
    id: "ALT-006",
    species: "Lantana (Lantana camara)",
    location: "Nilgiri Hills, Tamil Nadu",
    coordinates: { lat: 11.41, lng: 76.69 },
    urgency: "high",
    description: "Lantana overrunning tea plantation borders. Biodiversity loss imminent.",
    distance: "2km radius",
    reportedAt: "5 hours ago",
  },
  {
    id: "ALT-007",
    species: "Kudzu (Pueraria montana)",
    location: "Eastern Ghats, Andhra Pradesh",
    coordinates: { lat: 15.51, lng: 79.96 },
    urgency: "high",
    description: "Kudzu vine smothering native tree canopy. 12 hectares affected.",
    distance: "Forest interior",
    reportedAt: "7 hours ago",
  },
  {
    id: "ALT-008",
    species: "Senna spectabilis",
    location: "Wayanad, Kerala",
    coordinates: { lat: 11.69, lng: 76.08 },
    urgency: "high",
    description: "Senna spectabilis invading wildlife sanctuary buffer zone.",
    distance: "5km from core zone",
    reportedAt: "8 hours ago",
  },
  {
    id: "ALT-009",
    species: "Prosopis juliflora",
    location: "Jodhpur, Rajasthan",
    coordinates: { lat: 26.29, lng: 73.02 },
    urgency: "medium",
    description: "Prosopis encroachment near water bodies. Groundwater depletion concerns.",
    distance: "10km spread",
    reportedAt: "12 hours ago",
  },
  {
    id: "ALT-010",
    species: "Lantana (Lantana camara)",
    location: "Coorg, Karnataka",
    coordinates: { lat: 12.42, lng: 75.74 },
    urgency: "medium",
    description: "Lantana patches in coffee plantations. Moderate economic impact.",
    distance: "4km area",
    reportedAt: "1 day ago",
  },
  // More medium/low alerts
  ...Array.from({ length: 13 }, (_, i) => ({
    id: `ALT-${String(11 + i).padStart(3, "0")}`,
    species: speciesList[i % speciesList.length],
    location: `${regions[i % regions.length]} Region`,
    coordinates: { lat: 10 + Math.random() * 18, lng: 72 + Math.random() * 12 },
    urgency: (i < 5 ? "medium" : "low") as Urgency,
    description: `${speciesList[i % speciesList.length]} spotted in ${regions[i % regions.length]}. Monitoring recommended.`,
    distance: `${Math.floor(Math.random() * 20 + 1)}km radius`,
    reportedAt: `${i + 1} days ago`,
  })),
];

export const reports: Report[] = Array.from({ length: 27 }, (_, i) => ({
  id: `RPT-${String(i + 1).padStart(3, "0")}`,
  photoUrl: `https://picsum.photos/seed/plant${i + 1}/400/300`,
  species: speciesList[i % speciesList.length],
  location: `${regions[i % regions.length]}, India`,
  coordinates: {
    lat: parseFloat((8 + Math.random() * 20).toFixed(2)),
    lng: parseFloat((72 + Math.random() * 12).toFixed(2)),
  },
  timestamp: new Date(Date.now() - i * 3600000 * Math.random() * 48).toISOString(),
  reportedBy: [
    "Farmer Ravi K.",
    "Citizen Priya M.",
    "Ranger Suresh B.",
    "Student Ananya P.",
    "Volunteer Karthik R.",
    "Farmer Meena D.",
  ][i % 6],
  status: "pending" as ReportStatus,
  notes: "",
  confidence: parseFloat((0.6 + Math.random() * 0.35).toFixed(2)),
}));

export const mapHotspots: MapHotspot[] = [
  { city: "Chennai", lat: 13.08, lng: 80.27, intensity: 0.9, alerts: 5 },
  { city: "Bengaluru", lat: 12.97, lng: 77.59, intensity: 0.85, alerts: 4 },
  { city: "Kochi", lat: 9.93, lng: 76.27, intensity: 0.7, alerts: 3 },
  { city: "Hyderabad", lat: 17.39, lng: 78.49, intensity: 0.6, alerts: 2 },
  { city: "Mumbai", lat: 19.08, lng: 72.88, intensity: 0.5, alerts: 2 },
  { city: "Jodhpur", lat: 26.29, lng: 73.02, intensity: 0.4, alerts: 1 },
];

export const stats = {
  verifiedThisMonth: 156,
  pendingReports: 27,
  highAlerts: 8,
  mediumAlerts: 23,
  lowAlerts: 4,
  totalAlerts: 35,
  teamsActive: 4,
  speciesTracked: 12,
};
