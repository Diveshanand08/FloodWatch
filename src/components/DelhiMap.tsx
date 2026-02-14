import { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import DelhiHeatLayer from './map/DelhiHeatLayer';
import WardMarkers from './map/WardMarkers';

function ForceResize() {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [map]);

  return null;
}

export default function DelhiMap({
  wardsData,
  onWardSelect,
  selectedWardId,
}) {
  return (
    <div
      style={{
        height: '360px',   //  FIXED HEIGHT (NOT %)
        width: '100%',
        position: 'relative',
      }}
    >
      <MapContainer
        center={[28.6139, 77.209]}
        zoom={11}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <ForceResize />

        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        <DelhiHeatLayer wards={wardsData} />

        <WardMarkers
          wards={wardsData}
          onSelect={onWardSelect}
          selectedWardId={selectedWardId}
        />
      </MapContainer>
    </div>
  );
}
