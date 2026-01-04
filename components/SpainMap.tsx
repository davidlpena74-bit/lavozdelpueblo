
import React from 'react';
import { RegionalVotes, RegionCode } from '../types';

interface SpainMapProps {
  regionalVotes: RegionalVotes;
  labelSupport?: string;
  labelOppose?: string;
}

const REGION_DATA: Record<RegionCode, { name: string; path: string }> = {
  'GA': { name: 'Galicia', path: 'M130.6,83.9l-4.2-7.5l-9.1-1.4l-3-8.8l-12.7-2.6l-5.6-7.1l-11.8,0.2l-2.6,4.7l-9.4-1.2l-1.9,8.7l-4,2.1l0.5,12l-6.1,1.4l-1.2,16.5l8.7,9.4l4.5,11.5l14.8,5.4l10.8,11.5l11.5,1.2l12.2-7.8l5.4-10.4l11.3-4l0.2-12l5.4-8.7L130.6,83.9z' },
  'AS': { name: 'Asturias', path: 'M210.6,71.2l-8.7-4l-14.8,0.9l-14.1-3.5l-13.9,4.2l-9.8-1.2l-12.5,4.7l-6.1,11.5l16.2,0.7l13.7,1.9l12.7,4.2l12-3.8l15.1,1.2l11.5-6.8l7.5-6.6L210.6,71.2z' },
  'CB': { name: 'Cantabria', path: 'M255.4,85.3l-10.4-10.8l-11.1-3.8l-15.3,1.6l-8,7.3l0.7,11.5l10.6,3.8l10.4,1.4l15.1,6.8l8-9.4L255.4,85.3z' },
  'PV': { name: 'País Vasco', path: 'M314.8,91.9l-12.7-10.8l-11.3-2.6l-11.3,4.5l-4.5,13l13.7,11.3l15.1,1.9l11.3,0.5l9.4-7.5l0.5-5.9L314.8,91.9z' },
  'NC': { name: 'Navarra', path: 'M376.1,117.8l-11.1-13.7l-16-6.4l-14.6,5.4l-1.6,15.1l7.8,11.5l2.4,12l10.6,9.4l14.6,3.3l14.8-15.5l5.2-11.8L376.1,117.8z' },
  'RI': { name: 'La Rioja', path: 'M336,155.5l-11.8-6.1l-14.1-1.2l-4,9.6l10.1,11.5l15.3,0.7l11.3-6.6L336,155.5z' },
  'AR': { name: 'Aragón', path: 'M490.5,164.7l-15.5-23.8l-16-11.1l-22.1,3.1l-16.2,14.4l-11.3,27.1l-11.3,3.3l-5.6,11.5l5.4,12.5l2.4,15.1l11.3,11.5l-0.7,14.4l7.3,10.6l16.7,10.1l4,15.5l14.6,3.5l15.1-4l14.6-11.3l12-25.7l11.5-16.9l4-27.1L501.1,202L490.5,164.7z' },
  'CT': { name: 'Cataluña', path: 'M627.3,186.1l-14.1-23.8l-16-4l-11.8,11.5l-14.6-0.7l-1.9,16.5l9.6,17.2l-0.9,13.2l12,11.1l1.4,16.2l15.5,11.5l14.8-4l10.4-11.3l12.7,0.7l14.8-13l3.5-16.5l-6.8-13l-10.4-7.5L627.3,186.1z' },
  'CL': { name: 'Castilla y León', path: 'M250.7,211.8l-25.7-27.1l-16.7-6.1l-12.2,4l-10.6-2.1l-12-14.1l-25.2,4.7l-8,14.6l-5.6,11.8l-2.1,15.5l9.2,11.1l10.4,11.5l-0.7,16l11.5,13.7l13.9,4.2l0.2,15.1l13.4,7.5l15.5,13.9l14.4,0.5l15.1-4l12,11.8l20.5,0.7l16-6.8l10.4-12l10.4-1.2l12-14.1l-1.4-16l14.6-11.5l4-15.5l-14.6-15.8l-12-16.9l-11.5-3.3l-15.1,1.9L250.7,211.8z' },
  'MD': { name: 'Madrid', path: 'M355.2,342.1l-14.1-13l-11.3,10.8l-1.9,16.9l12.2,14.1l15.5,1.2l12.7-12l3.8-14.4L355.2,342.1z' },
  'CM': { name: 'Castilla-La Mancha', path: 'M448.3,426.3l-15.5-27.1l-14.8-6.1l-15.1,2.4l-14.6-13.7l-1.9-15.3l-16-1.4l-15.8,11.5l-2.1,16.2l-14.4,1.4l-11.3,13.7l-14.4,11.8l0.9,15.5l10.6,16.2l1.9,15.5l11.5,11.1l14.4-1.2l15.5,11.5l16.7-1.4l11.3,11.3l13.9-3.8l16.2-14.1l11.3-16.9l4.5-27.5l16-16l6.8-16.9L448.3,426.3z' },
  'VC': { name: 'C. Valenciana', path: 'M508.3,431.1l-15.1-27.1l-16.2-4.5l-9.8,16l-7.3,16.5l-4.5,27.1l11.3,16.2l1.4,16.9l11.5,12.2l10.8,4.2l14.6-11.8l6.8-16.5l10.4-15.5l0.7-17.6l-7.3-17.2L508.3,431.1z' },
  'EX': { name: 'Extremadura', path: 'M230.1,438.2l-15.5-27.1l-16-4l-12,11.8l-14.6-1.4l-1.9,15.3l9.6,16.2l-0.9,13.2l12,11.1l1.4,16.2l15.5,11.1l14.6-4.2l10.6-11.5l12.5,0.7l14.8-13.2l3.5-16.7l-6.8-13L230.1,438.2z' },
  'MC': { name: 'Murcia', path: 'M490.5,570l-14.1-13l-16.2-1.4l-11.8,11.5l-1.6,15.1l7.8,11.5l15.1,1.2l12.5-12l3.8-14.4L490.5,570z' },
  'AN': { name: 'Andalucía', path: 'M415.6,630.1l-25.7-27.1l-16.5-6.1l-12.2,4l-10.6-2.1l-12-14.1l-25.2,4.7l-8,14.6l-5.6,11.8l-2.1,15.5l9.2,11.1l10.4,11.5l-0.7,16l11.5,13.7l13.9,4.2l0.2,15.1l13.4,7.5l15.5,13.9l14.4,0.5l15.1-4l12,11.8l20.5,0.7l16-6.8l10.4-12l10.4-1.2l12-14.1l-1.4-16l14.6-11.5l4-15.5l-14.6-15.8L415.6,630.1z' },
  'IB': { name: 'Baleares', path: 'M780,320c0,11,9,20,20,20s20-9,20-20s-9-20-20-20S780,309,780,320z M830,280c0,5.5,4.5,10,10,10s10-4.5,10-10s-4.5-10-10-10S830,274.5,830,280z' },
  'CN': { name: 'Canarias', path: 'M100,750c0,11,9,20,20,20s20-9,20-20s-9-20-20-20S100,739,100,750z M160,730c0,8,7,15,15,15s15-7,15-15s-7-15-15-15S160,722,160,730z' },
  'CE': { name: 'Ceuta', path: 'M320,780h20v20h-20V780z' },
  'ML': { name: 'Melilla', path: 'M440,780h20v20h-20V780z' }
};

const SpainMap: React.FC<SpainMapProps> = ({ regionalVotes, labelSupport = 'A favor', labelOppose = 'En contra' }) => {
  const getRegionColor = (code: RegionCode) => {
    const votes = regionalVotes[code];
    if (!votes || (votes.support === 0 && votes.oppose === 0 && votes.neutral === 0)) return '#e2e8f0'; // Gris base (slate-200)

    // Find the winner
    const { support, oppose, neutral } = votes;
    const max = Math.max(support, oppose, neutral);

    if (max === 0) return '#e2e8f0';

    if (support === max && support > oppose && support > neutral) {
      // Winner: Option A (Green)
      // Opacity based on dominance? Let's just give a solid nice green for clear visibility as requested
      return '#22c55e'; // green-500
    } else if (oppose === max && oppose > support && oppose > neutral) {
      // Winner: Option B (Red)
      return '#ef4444'; // red-500
    } else {
      // Winner: Neutral or Tie (Gray)
      return '#94a3b8'; // slate-400
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl p-6 border border-gray-100 shadow-lg">
      <div className="flex flex-wrap justify-center mb-8 gap-6 text-xs font-bold uppercase tracking-wider text-gray-500">
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

      <div className="relative group mx-auto max-w-2xl">
        <svg viewBox="0 0 1000 850" className="w-full h-auto filter drop-shadow-lg transform transition-all hover:scale-[1.01]">
          {/* Recuadro para Canarias */}
          <rect x="20" y="680" width="220" height="150" fill="none" stroke="#e2e8f0" strokeWidth="2" rx="10" />

          <g id="spain-detailed-map">
            {(Object.entries(REGION_DATA) as [RegionCode, { name: string; path: string }][]).map(([code, data]) => (
              <path
                key={code}
                d={data.path}
                fill={getRegionColor(code)}
                stroke="#ffffff"
                strokeWidth="1.5"
                className="transition-all duration-300 hover:opacity-80 cursor-pointer focus:outline-none"
              >
                <title>{data.name}:&#10;{labelSupport}: {regionalVotes[code]?.support || 0}&#10;{labelOppose}: {regionalVotes[code]?.oppose || 0}&#10;Neutral: {regionalVotes[code]?.neutral || 0}</title>
              </path>
            ))}
          </g>

          {/* Etiquetas decorativas */}
          <text x="130" y="815" fontSize="14" fill="#cbd5e1" textAnchor="middle" fontWeight="bold" fontFamily="sans-serif">Canarias</text>
        </svg>
      </div>
    </div>
  );
};

export default SpainMap;
