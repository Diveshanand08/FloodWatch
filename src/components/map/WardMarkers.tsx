import { CircleMarker, Tooltip } from 'react-leaflet';
import { WardData } from '@/types/ward';
import { wardCoordinates } from '@/data/wardCoordinates';

interface Props {
  wards: WardData[];
  onSelect: (ward: WardData) => void;
  selectedWardId?: string;
}

const colorMap = {
  low: '#22c55e',
  moderate: '#eab308',
  high: '#f97316',
  critical: '#ef4444',
};

export default function WardMarkers({
  wards,
  onSelect,
  selectedWardId,
}: Props) {
  return (
    <>
      {wards.map((ward) => {
        const coord = wardCoordinates[ward.name];
        if (!coord) return null;

        const isSelected = ward.id === selectedWardId;

        return (
          <CircleMarker
            key={ward.id}
            center={[coord[0], coord[1]]}
            radius={isSelected ? 10 : 7}
            pathOptions={{
              color: '#fff',
              weight: 1,
              fillColor: colorMap[ward.currentRisk],
              fillOpacity: 1,
            }}
            eventHandlers={{
              click: () => onSelect(ward),
            }}
          >
            <Tooltip direction="top" offset={[0, -6]} opacity={1}>
              <b>{ward.name}</b>
              <br />
              Risk: {ward.currentRisk.toUpperCase()}
            </Tooltip>
          </CircleMarker>
        );
      })}
    </>
  );
}