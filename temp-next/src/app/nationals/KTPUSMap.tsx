"use client";

import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type Chapter = {
  id: string;
  name: string;
  university: string;
  coords: [number, number]; // [lat, lng] for Leaflet
};

const chapters: Chapter[] = [
  { id: "alpha", name: "Alpha Chapter", university: "University of Michigan", coords: [42.2808, -83.7312] },
  { id: "beta", name: "Beta Chapter", university: "University of Pittsburgh", coords: [40.4406, -79.9959] },
  { id: "gamma", name: "Gamma Chapter", university: "Rose-Hulman Institute of Technology", coords: [39.4822, -87.3239] },
  { id: "delta", name: "Delta Chapter", university: "Syracuse University", coords: [43.0481, -76.1474] },
  { id: "epsilon", name: "Epsilon Chapter", university: "University of Maryland", coords: [38.9869, -76.9378] },
  { id: "zeta", name: "Zeta Chapter", university: "The College of New Jersey", coords: [40.2677, -74.7429] },
  { id: "eta", name: "Eta Chapter", university: "University of North Carolina at Chapel Hill", coords: [35.9049, -79.0193] },
  { id: "theta", name: "Theta Chapter", university: "University of Chicago", coords: [41.7886, -87.5987] },
  { id: "iota", name: "Iota Chapter", university: "University of Texas at Austin", coords: [30.2849, -97.7331] },
  { id: "kappa", name: "Kappa Chapter", university: "Northwestern University", coords: [42.0564, -87.6753] },
  { id: "lambda", name: "Lambda Chapter", university: "Boston University", coords: [42.3505, -71.0995] },
  { id: "mu", name: "Mu Chapter", university: "University of Texas at Dallas", coords: [32.9857, -96.7500] },
  { id: "nu", name: "Nu Chapter", university: "University of Colorado Boulder", coords: [40.0076, -105.2705] },
  { id: "rho", name: "Rho Chapter", university: "Vanderbilt University", coords: [36.1447, -86.8027] },
  { id: "sigma", name: "Sigma Chapter", university: "University of Miami", coords: [25.7207, -80.2794] },
  { id: "tau", name: "Tau Chapter", university: "University of Southern California", coords: [34.0224, -118.285] },
  { id: "upsilon", name: "Upsilon Chapter", university: "Lewis University", coords: [41.6050, -88.0817] },
  { id: "phi", name: "Phi Chapter", university: "University of Georgia", coords: [33.9480, -83.3773] },
  { id: "chi", name: "Chi Chapter", university: "Nova Southeastern University", coords: [26.1003, -80.2430] },
  { id: "psi", name: "Psi Chapter", university: "Cameron University", coords: [34.6085, -98.3959] },
  { id: "omega", name: "Omega Chapter", university: "Northeastern University", coords: [42.3398, -71.0892] },
  { id: "alpha-alpha", name: "Alpha Alpha Chapter", university: "University of Central Arkansas", coords: [35.0806, -92.4426] },
  { id: "alpha-beta", name: "Alpha Beta Chapter", university: "Rutgers University", coords: [40.5008, -74.4274] },
  { id: "alpha-gamma", name: "Alpha Gamma Chapter", university: "Virginia Tech", coords: [37.2284, -80.4234] },
  { id: "alpha-delta", name: "Alpha Delta Chapter", university: "Ohio State University", coords: [40.0067, -83.0305] },
  { id: "alpha-epsilon", name: "Alpha Epsilon Chapter", university: "Cornell University", coords: [42.4534, -76.4735] },
  { id: "alpha-zeta", name: "Alpha Zeta Chapter", university: "University of Virginia", coords: [38.0336, -78.5080] },
  { id: "alpha-eta", name: "Alpha Eta Chapter", university: "Indiana University Bloomington", coords: [39.1670, -86.5342] },
];

export default function KTPUSMap() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Fix for default markers
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });
  }, []);

  // Simple, clean marker icon
  const customIcon = L.divIcon({
    html: `<div class="ktp-marker" style="
      width: 16px; 
      height: 16px; 
      background-color: #315CA9;
      border: 3px solid white; 
      border-radius: 50%; 
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
      cursor: pointer;
    "></div>`,
    className: "custom-marker-icon",
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

  if (!isClient) {
    return (
      <div className="w-full h-[500px] rounded-2xl border border-neutral-200 overflow-hidden bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-2xl border border-neutral-200 overflow-hidden">
      <MapContainer
        center={[39.8283, -98.5795]} // Center of US
        zoom={4}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
        touchZoom={true}
        doubleClickZoom={true}
        dragging={true}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        {chapters.map((chapter) => (
          <Marker
            key={chapter.id}
            position={chapter.coords}
            icon={customIcon}
          >
            <Tooltip 
              permanent={false}
              direction="top"
              offset={[0, -15]}
              className="custom-tooltip"
            >
              <div className="text-center min-w-max">
                <div className="font-bold text-[#315CA9] text-sm mb-1">{chapter.name}</div>
                <div className="text-xs text-gray-700 font-medium">{chapter.university}</div>
              </div>
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
