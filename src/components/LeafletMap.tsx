import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, Popup, useMap, Circle, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, ZoomIn, ZoomOut, Layers, Navigation } from 'lucide-react';

// Fix for default marker icons in Leaflet with bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

export interface WardData {
  id: string;
  name: string;
  risk: 'low' | 'moderate' | 'high' | 'critical';
  floodProbability: number;
  timeToFlood: string;
  rainfall: number;
  drainCapacity: number;
  activeIncidents: number;
  coordinates: [number, number]; // [lat, lng]
}

// Delhi ward data with actual coordinates
const delhiWards: WardData[] = [
  { id: '1', name: 'Rohini', risk: 'moderate', floodProbability: 45, timeToFlood: '45 min', rainfall: 28, drainCapacity: 68, activeIncidents: 1, coordinates: [28.7495, 77.0568] },
  { id: '2', name: 'Narela', risk: 'low', floodProbability: 15, timeToFlood: '-', rainfall: 18, drainCapacity: 82, activeIncidents: 0, coordinates: [28.8527, 77.0929] },
  { id: '3', name: 'Pitampura', risk: 'high', floodProbability: 72, timeToFlood: '25 min', rainfall: 42, drainCapacity: 45, activeIncidents: 2, coordinates: [28.7035, 77.1315] },
  { id: '4', name: 'Model Town', risk: 'moderate', floodProbability: 55, timeToFlood: '40 min', rainfall: 35, drainCapacity: 52, activeIncidents: 1, coordinates: [28.7157, 77.1927] },
  { id: '5', name: 'Karol Bagh', risk: 'critical', floodProbability: 89, timeToFlood: '15 min', rainfall: 52, drainCapacity: 22, activeIncidents: 4, coordinates: [28.6514, 77.1907] },
  { id: '6', name: 'Rajouri Garden', risk: 'high', floodProbability: 78, timeToFlood: '20 min', rainfall: 48, drainCapacity: 28, activeIncidents: 3, coordinates: [28.6491, 77.1212] },
  { id: '7', name: 'Dwarka', risk: 'low', floodProbability: 22, timeToFlood: '-', rainfall: 22, drainCapacity: 75, activeIncidents: 0, coordinates: [28.5921, 77.0460] },
  { id: '8', name: 'Janakpuri', risk: 'moderate', floodProbability: 48, timeToFlood: '50 min', rainfall: 32, drainCapacity: 55, activeIncidents: 1, coordinates: [28.6219, 77.0878] },
  { id: '9', name: 'Saket', risk: 'high', floodProbability: 68, timeToFlood: '30 min', rainfall: 45, drainCapacity: 38, activeIncidents: 2, coordinates: [28.5245, 77.2066] },
  { id: '10', name: 'Nehru Place', risk: 'critical', floodProbability: 92, timeToFlood: '10 min', rainfall: 55, drainCapacity: 18, activeIncidents: 5, coordinates: [28.5491, 77.2533] },
  { id: '11', name: 'Lajpat Nagar', risk: 'high', floodProbability: 75, timeToFlood: '22 min', rainfall: 48, drainCapacity: 32, activeIncidents: 3, coordinates: [28.5677, 77.2433] },
  { id: '12', name: 'Connaught Place', risk: 'moderate', floodProbability: 52, timeToFlood: '35 min', rainfall: 38, drainCapacity: 48, activeIncidents: 1, coordinates: [28.6315, 77.2167] },
  { id: '13', name: 'Chandni Chowk', risk: 'critical', floodProbability: 95, timeToFlood: '8 min', rainfall: 58, drainCapacity: 12, activeIncidents: 6, coordinates: [28.6562, 77.2303] },
  { id: '14', name: 'Shahdara', risk: 'high', floodProbability: 70, timeToFlood: '28 min', rainfall: 44, drainCapacity: 35, activeIncidents: 2, coordinates: [28.6732, 77.2891] },
  { id: '15', name: 'Mayur Vihar', risk: 'moderate', floodProbability: 42, timeToFlood: '55 min', rainfall: 28, drainCapacity: 62, activeIncidents: 1, coordinates: [28.5921, 77.2975] },
  { id: '16', name: 'Noida Border', risk: 'low', floodProbability: 18, timeToFlood: '-', rainfall: 20, drainCapacity: 78, activeIncidents: 0, coordinates: [28.5355, 77.3910] },
  { id: '17', name: 'East Delhi', risk: 'moderate', floodProbability: 58, timeToFlood: '38 min', rainfall: 38, drainCapacity: 45, activeIncidents: 1, coordinates: [28.6280, 77.3150] },
  { id: '18', name: 'ITO', risk: 'high', floodProbability: 82, timeToFlood: '18 min', rainfall: 50, drainCapacity: 25, activeIncidents: 3, coordinates: [28.6289, 77.2405] },
];

const getRiskColor = (risk: WardData['risk']) => {
  switch (risk) {
    case 'low': return '#22c55e';
    case 'moderate': return '#f59e0b';
    case 'high': return '#ef4444';
    case 'critical': return '#dc2626';
  }
};

const getCircleRadius = (risk: WardData['risk']) => {
  switch (risk) {
    case 'low': return 800;
    case 'moderate': return 1000;
    case 'high': return 1200;
    case 'critical': return 1500;
  }
};

// Custom control component for zoom buttons - must be inside MapContainer
const MapControls = ({ onReset }: { onReset: () => void }) => {
  const map = useMap();

  const handleZoomIn = () => map.zoomIn();
  const handleZoomOut = () => map.zoomOut();
  const handleResetView = () => onReset();

  useEffect(() => {
    // Controls are rendered outside MapContainer, so we just return null here
  }, []);

  return null;
};

// Separate component for map event handling
const MapEventHandler = ({ mapRef }: { mapRef: React.RefObject<L.Map | null> }) => {
  const map = useMap();
  
  useEffect(() => {
    if (mapRef.current === null) {
      (mapRef as React.MutableRefObject<L.Map | null>).current = map;
    }
  }, [map, mapRef]);

  return null;
};

interface LeafletMapProps {
  onWardSelect?: (ward: WardData) => void;
  selectedWardId?: string;
  showDrainNetwork?: boolean;
  height?: string;
}

const LeafletMap = ({ onWardSelect, selectedWardId, showDrainNetwork = false, height = '500px' }: LeafletMapProps) => {
  const [selectedWard, setSelectedWard] = useState<WardData | null>(null);
  const [mapLayer, setMapLayer] = useState<'streets' | 'satellite'>('streets');
  const mapRef = useRef<L.Map>(null);

  // Delhi center coordinates
  const delhiCenter: [number, number] = [28.6139, 77.2090];
  const defaultZoom = 11;

  const handleWardClick = (ward: WardData) => {
    setSelectedWard(ward);
    onWardSelect?.(ward);
  };

  const handleReset = () => {
    if (mapRef.current) {
      mapRef.current.setView(delhiCenter, defaultZoom);
    }
  };

  // Major drain lines (simplified representation)
  const drainLines = [
    [[28.7495, 77.0568], [28.7035, 77.1315], [28.6514, 77.1907]],
    [[28.6562, 77.2303], [28.6289, 77.2405], [28.5677, 77.2433]],
    [[28.6491, 77.1212], [28.6219, 77.0878], [28.5921, 77.0460]],
  ];

  return (
    <div className="relative rounded-xl overflow-hidden border border-border/50" style={{ height }}>
      <MapContainer
        center={delhiCenter}
        zoom={defaultZoom}
        className="w-full h-full"
        zoomControl={false}
      >
        <MapEventHandler mapRef={mapRef} />
        
        {/* Tile Layer */}
        {mapLayer === 'streets' ? (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        ) : (
          <TileLayer
            attribution='&copy; Esri'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        )}

        {/* Drain Network Lines */}
        {showDrainNetwork && drainLines.map((line, index) => (
          <GeoJSON
            key={`drain-${index}`}
            data={{
              type: 'Feature',
              properties: { type: 'drain' },
              geometry: {
                type: 'LineString',
                coordinates: line.map(([lat, lng]) => [lng, lat]),
              },
            } as GeoJSON.Feature}
            style={{
              color: '#3b82f6',
              weight: 3,
              opacity: 0.7,
              dashArray: '5, 5',
            }}
          />
        ))}

        {/* Ward Circles */}
        {delhiWards.map((ward) => (
          <Circle
            key={ward.id}
            center={ward.coordinates}
            radius={getCircleRadius(ward.risk)}
            pathOptions={{
              color: getRiskColor(ward.risk),
              fillColor: getRiskColor(ward.risk),
              fillOpacity: selectedWardId === ward.id ? 0.7 : 0.4,
              weight: selectedWardId === ward.id ? 3 : 2,
            }}
            eventHandlers={{
              click: () => handleWardClick(ward),
            }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm">{ward.name}</h3>
                  <Badge variant={ward.risk} className="text-xs">
                    {ward.risk}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground">Flood Probability</p>
                    <p className="font-semibold">{ward.floodProbability}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Time to Flood</p>
                    <p className="font-semibold">{ward.timeToFlood}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Rainfall</p>
                    <p className="font-semibold">{ward.rainfall} mm/hr</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Drain Capacity</p>
                    <p className="font-semibold">{ward.drainCapacity}%</p>
                  </div>
                </div>
                {ward.activeIncidents > 0 && (
                  <div className="mt-2 p-2 bg-destructive/10 rounded text-xs text-destructive font-medium">
                    ⚠️ {ward.activeIncidents} Active Incident{ward.activeIncidents > 1 ? 's' : ''}
                  </div>
                )}
              </div>
            </Popup>
          </Circle>
        ))}
      </MapContainer>
      
      {/* Map Controls - Outside MapContainer */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        <Button 
          variant="outline" 
          size="icon" 
          className="bg-background/90 backdrop-blur"
          onClick={() => mapRef.current?.zoomIn()}
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="bg-background/90 backdrop-blur"
          onClick={() => mapRef.current?.zoomOut()}
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="bg-background/90 backdrop-blur"
          onClick={handleReset}
        >
          <Navigation className="w-4 h-4" />
        </Button>
      </div>

      {/* Layer Toggle */}
      <div className="absolute bottom-4 left-4 z-[1000]">
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 bg-background/90 backdrop-blur"
          onClick={() => setMapLayer(mapLayer === 'streets' ? 'satellite' : 'streets')}
        >
          <Layers className="w-4 h-4" />
          {mapLayer === 'streets' ? 'Satellite' : 'Streets'}
        </Button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 z-[1000] glass-card p-3 text-xs">
        <p className="font-medium mb-2">Risk Level</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#22c55e' }} />
            <span>Low</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#f59e0b' }} />
            <span>Moderate</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ef4444' }} />
            <span>High</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#dc2626' }} />
            <span>Critical</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeafletMap;
