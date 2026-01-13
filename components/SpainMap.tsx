
import React, { useEffect, useState, useMemo } from 'react';
import { geoPath } from 'd3-geo';
import { geoConicConformalSpain } from 'd3-composite-projections';
import { FeatureCollection, Feature } from 'geojson';
import { RegionalVotes, RegionCode } from '../types';

interface SpainMapProps {
  regionalVotes: RegionalVotes;
  regionalOptionCounts?: Record<RegionCode, Record<string, number>>;
  pollType?: 'binary' | 'multiple_choice';
  labelSupport?: string;
  labelOppose?: string;
}

const PARTY_COLORS: Record<string, string> = {
  'PSOE': '#E30613', // Rojo
  'PP': '#0056A7',   // Azul
  'Vox': '#63BE21',  // Verde
  'Sumar': '#E51C55', // Magenta
  'Podemos': '#6B1F5F', // Morado
  'Junts': '#00C3B2', // Turquesa
  'ERC': '#FFD700',   // Amarillo
  'PNV': '#008000',   // Verde Oscuro
  'Bildu': '#B5CF18', // Verde Lima
  'SALF': '#A0522D',  // Marron
  'PACMA': '#9ACD32', // Verde
  'Ciudadanos': '#EB6109', // Naranja
  // Fallbacks
  'Otros': '#808080',
  'En blanco': '#FFFFFF'
};

const DEFAULT_PARTY_COLOR = '#4B5563'; // Gris oscuro para desconocidos

// ... (Mapping from GeoJSON "name" property to RegionCode - SAME AS BEFORE)
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

const SpainMap: React.FC<SpainMapProps> = ({ regionalVotes, regionalOptionCounts, pollType = 'binary', labelSupport = 'A favor', labelOppose = 'En contra' }) => {
  const [geoData, setGeoData] = useState<FeatureCollection | null>(null);

  useEffect(() => {
    fetch('/spain-communities.json')
      .then(res => res.json())
      .then(data => setGeoData(data))
      .catch(err => console.error('Error loading map data:', err));
  }, []);

  const projection = useMemo(() => {
    return geoConicConformalSpain().scale(2500).translate([400, 280]);
  }, []);

  const pathGenerator = useMemo(() => geoPath().projection(projection), [projection]);

  const getRegionName = (feature: Feature) => {
    return feature.properties?.name || feature.properties?.noml_ccaa || 'Unknown';
  };

  const getRegionCode = (feature: Feature): RegionCode | undefined => {
    const name = getRegionName(feature);
    if (NAME_TO_CODE[name]) return NAME_TO_CODE[name];
    const found = Object.keys(NAME_TO_CODE).find(k => name.includes(k));
    return found ? NAME_TO_CODE[found] : undefined;
  };

  const getWinnerParty = (code: RegionCode): { name: string, color: string, votes: number } | null => {
    if (!regionalOptionCounts || !regionalOptionCounts[code]) return null;
    const options = regionalOptionCounts[code];

    let winner = '';
    let maxVotes = -1;

    Object.entries(options).forEach(([party, votes]) => {
      if (votes > maxVotes) {
        maxVotes = votes;
        winner = party;
      }
    });

    if (maxVotes <= 0) return null;

    // Find color match
    const colorKey = Object.keys(PARTY_COLORS).find(k => winner.includes(k) || k.includes(winner));
    return {
      name: winner,
      color: colorKey ? PARTY_COLORS[colorKey] : DEFAULT_PARTY_COLOR,
      votes: maxVotes
    };
  };

  const getRegionColor = (feature: Feature) => {
    const code = getRegionCode(feature);
    if (!code) return '#e2e8f0';

    if (pollType === 'multiple_choice') {
      const winner = getWinnerParty(code);
      return winner ? winner.color : '#e2e8f0';
    }

    // Binary logic
    const votes = regionalVotes[code];
    if (!votes || (votes.support === 0 && votes.oppose === 0 && votes.neutral === 0)) return '#e2e8f0';

    const { support, oppose, neutral } = votes;
    const max = Math.max(support, oppose, neutral);

    if (max === 0) return '#e2e8f0';
    if (support === max && support > oppose && support > neutral) return '#22c55e';
    if (oppose === max && oppose > support && oppose > neutral) return '#ef4444';
    return '#94a3b8';
  };

  if (!geoData) return <div className="h-96 w-full bg-slate-50 rounded-2xl animate-pulse flex items-center justify-center text-slate-400">Cargando Mapa...</div>;

  return (
    <div className="w-full bg-white rounded-2xl p-6 border border-gray-100 shadow-lg">
      <div className="flex flex-wrap justify-center mb-6 gap-x-6 gap-y-2 text-xs font-bold uppercase tracking-wider text-gray-500">
        {pollType === 'binary' ? (
          <>
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
          </>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 w-full">
            {Object.entries(PARTY_COLORS).map(([name, color]) => (
              <div key={name} className="flex items-center">
                <span className="w-3 h-3 rounded-full mr-2 shadow-sm flex-shrink-0" style={{ backgroundColor: color }}></span>
                <span className="truncate">{name}</span>
              </div>
            ))}
          </div>
        )}

      </div>

      <div className="relative mx-auto w-full aspect-[5/3]">
        <svg viewBox="0 0 800 500" className="w-full h-full drop-shadow-sm">
          <g>
            {geoData.features.map((feature, i) => {
              const code = getRegionCode(feature);
              const name = getRegionName(feature);

              let tooltip = name;
              if (code) {
                if (pollType === 'binary') {
                  const votes = regionalVotes[code];
                  if (votes) tooltip += `\n${labelSupport}: ${votes.support}\n${labelOppose}: ${votes.oppose}\nNeutral: ${votes.neutral}`;
                } else {
                  const winner = getWinnerParty(code);
                  if (winner) tooltip += `\nGanador: ${winner.name} (${winner.votes} votos)`;
                  else tooltip += `\nSin votos`;
                }
              }

              return (
                <path
                  key={i}
                  d={pathGenerator(feature) || ''}
                  fill={getRegionColor(feature)}
                  stroke="#ffffff"
                  strokeWidth="0.5"
                  className="transition-all duration-300 hover:opacity-80 cursor-pointer focus:outline-none hover:stroke-indigo-400 hover:stroke-2"
                >
                  <title>{tooltip}</title>
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
