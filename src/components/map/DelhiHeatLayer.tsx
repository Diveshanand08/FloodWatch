import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

import { WardData } from '@/types/ward';
import { wardCoordinates } from '@/data/wardCoordinates';

const riskWeight = (risk: WardData['currentRisk']) => {
  switch (risk) {
    case 'low': return 0.25;
    case 'moderate': return 0.5;
    case 'high': return 0.75;
    case 'critical': return 1.0;
    default: return 0.3;
  }
};

interface Props {
  wards: WardData[];
}

export default function DelhiHeatLayer({ wards }: Props) {
  const map = useMap();

  useEffect(() => {
    if (!wards.length) return;

    const points: [number, number, number][] = wards
      .map((ward) => {
        const coord = wardCoordinates[ward.name];
        if (!coord) return null;
        return [coord[0], coord[1], riskWeight(ward.currentRisk)];
      })
      .filter(Boolean) as [number, number, number][];

    const heatLayer = L.heatLayer(points, {
      radius: 45,
      blur: 35,
      maxZoom: 13,
      gradient: {
        0.25: '#22c55e',
        0.5: '#eab308',
        0.75: '#f97316',
        1.0: '#ef4444',
      },
    });

    heatLayer.addTo(map);

    // ✅ Correct cleanup (THIS fixes your TS error earlier)
    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, wards]);

  return null;
}