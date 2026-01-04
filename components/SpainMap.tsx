
import React, { useEffect, useState, useMemo } from 'react';
import { geoPath } from 'd3-geo';
import { geoConicConformalSpain } from 'd3-composite-projections';
import { FeatureCollection, Feature } from 'geojson';
import { RegionalVotes, RegionCode } from '../types';

interface SpainMapProps {
  regionalVotes: RegionalVotes;
  labelSupport?: string;
  labelOppose?: string;
}

// Mapping from GeoJSON "name" property to RegionCode
const NAME_TO_CODE: Record<string, RegionCode> = {
  'Andalucia': 'AN', 'Andalucía': 'AN',
  'Aragon': 'AR', 'Aragón': 'AR',
  'Asturias': 'AS', 'Principado de Asturias': 'AS',
  'Baleares': 'IB', 'Islas Baleares': 'IB', 'Illes Balears': 'IB',
  'Canarias': 'CN', 'Islas Canarias': 'CN',
  'Cantabria': 'CB',
  'Castilla-La Mancha': 'CM', 'Castilla La Mancha': 'CM',
  'Castilla-Leon': 'CL', 'Castilla y Leon': 'CL', 'Castilla y León': 'CL',
  'Cataluna': 'CT', 'Cataluña': 'CT', 'Catalunya': 'CT',
  'Ceuta': 'CE',
  'Madrid': 'MD', 'Comunidad de Madrid': 'MD',
  'Navarra': 'NC', 'Comunidad Foral de Navarra': 'NC', 'Nafarroako Foru Komunitatea': 'NC',
  'Valencia': 'VC', 'Comunidad Valenciana': 'VC', 'Comunitat Valenciana': 'VC',
  'Extremadura': 'EX',
  'Galicia': 'GA',
  'Rioja': 'RI', 'La Rioja': 'RI',
  'Melilla': 'ML',
  'Murcia': 'MC', 'Region de Murcia': 'MC', 'Región de Murcia': 'MC',
  'Pais Vasco': 'PV', 'País Vasco': 'PV', 'Euskadi': 'PV',
};

const SpainMap: React.FC<SpainMapProps> = ({ regionalVotes, labelSupport = 'A favor', labelOppose = 'En contra' }) => {
  const [geoData, setGeoData] = useState<FeatureCollection | null>(null);

  useEffect(() => {
    fetch('/spain-communities.json')
      .then(res => res.json())
      .then(data => setGeoData(data))
      .catch(err => console.error('Error loading map data:', err));
  }, []);

  const projection = useMemo(() => {
    // d3-composite-projections for Spain (handles Canary Islands placement automatically)
    return geoConicConformalSpain().scale(2500).translate([400, 280]);
  }, []);

  const pathGenerator = useMemo(() => geoPath().projection(projection), [projection]);

  const getRegionName = (feature: Feature) => {
    return feature.properties?.name || feature.properties?.noml_ccaa || 'Unknown';
  };

  const getRegionCode = (feature: Feature): RegionCode | undefined => {
    const name = getRegionName(feature);
    // Try explicit map first
    if (NAME_TO_CODE[name]) return NAME_TO_CODE[name];

    // Fallback: try to find substring match if needed
    const found = Object.keys(NAME_TO_CODE).find(k => name.includes(k));
    return found ? NAME_TO_CODE[found] : undefined;
  };

  const getRegionColor = (feature: Feature) => {
    const code = getRegionCode(feature);
    if (!code) return '#e2e8f0'; // Not mapped

    const votes = regionalVotes[code];
    if (!votes || (votes.support === 0 && votes.oppose === 0 && votes.neutral === 0)) return '#e2e8f0';

    const { support, oppose, neutral } = votes;
    const max = Math.max(support, oppose, neutral);

    if (max === 0) return '#e2e8f0';

    if (support === max && support > oppose && support > neutral) return '#22c55e'; // Green
    if (oppose === max && oppose > support && oppose > neutral) return '#ef4444'; // Red
    return '#94a3b8'; // Neutral
  };

  if (!geoData) return <div className="h-96 w-full bg-slate-50 rounded-2xl animate-pulse flex items-center justify-center text-slate-400">Cargando Mapa...</div>;

  return (
    <div className="w-full bg-white rounded-2xl p-6 border border-gray-100 shadow-lg">
      <div className="flex flex-wrap justify-center mb-6 gap-6 text-xs font-bold uppercase tracking-wider text-gray-500">
        <div className="flex items-center">
          <span className="w-3 h-3 bg-green-500 rounded-full mr-2 shadow-sm"></span>
          {labelSupport}
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 bg-red-500 rounded-full mr-2 shadow-sm"></span>
          {labelOppose}
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 bg-slate-400 rounded-full mr-2 shadow-sm"></span>
          Neutral / Empate
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 bg-slate-200 rounded-full mr-2 shadow-sm"></span>
          Sin Datos
        </div>
      </div>

      <div className="relative mx-auto w-full aspect-[5/3]">
        <svg viewBox="0 0 800 500" className="w-full h-full drop-shadow-sm">
          <g>
            {geoData.features.map((feature, i) => {
              const code = getRegionCode(feature);
              const name = getRegionName(feature);
              const votes = code ? regionalVotes[code] : undefined;
              return (
                <path
                  key={i}
                  d={pathGenerator(feature) || ''}
                  fill={getRegionColor(feature)}
                  stroke="#ffffff"
                  strokeWidth="0.5"
                  className="transition-all duration-300 hover:opacity-80 cursor-pointer focus:outline-none hover:stroke-indigo-400 hover:stroke-2"
                >
                  <title>{name}:&#10;{labelSupport}: {votes?.support || 0}&#10;{labelOppose}: {votes?.oppose || 0}&#10;Neutral: {votes?.neutral || 0}</title>
                </path>
              );
            })}
          </g>
        </svg>
      </div>
      <p className="text-center text-xs text-gray-400 mt-4">Mapa oficial por Comunidades Autónomas</p>
    </div>
  );
};

export default SpainMap;
