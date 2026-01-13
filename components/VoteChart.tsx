
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Topic } from '../types';

interface VoteChartProps {
  votes: Topic['votes'];
  optionCounts?: Record<string, number>; // New prop
  type?: 'binary' | 'multiple_choice';
}

const PARTY_COLORS: Record<string, string> = {
  'PSOE': '#E30613', 'PP': '#0056A7', 'Vox': '#63BE21', 'Sumar': '#E51C55',
  'Podemos': '#6B1F5F', 'Junts': '#00C3B2', 'ERC': '#FFD700', 'PNV': '#008000',
  'Bildu': '#B5CF18', 'SALF': '#A0522D', 'PACMA': '#9ACD32', 'Ciudadanos': '#EB6109',
  'Otros': '#808080', 'En blanco': '#FFFFFF'
};

const getColor = (name: string) => {
  const key = Object.keys(PARTY_COLORS).find(k => name.includes(k));
  return key ? PARTY_COLORS[key] : '#aaaaaa';
};

const VoteChart: React.FC<VoteChartProps & { labelSupport?: string; labelOppose?: string }> = ({ votes, optionCounts, type = 'binary', labelSupport, labelOppose }) => {
  let data = [];

  if (type === 'multiple_choice' && optionCounts) {
    data = Object.entries(optionCounts)
      .map(([name, value]) => ({
        name,
        value,
        color: getColor(name)
      }))
      .filter(d => d.value > 0)
      .sort((a, b) => b.value - a.value); // Order Descending
  } else {
    data = [
      { name: labelSupport || 'A favor', value: votes.support, color: '#22c55e' },
      { name: labelOppose || 'En contra', value: votes.oppose, color: '#ef4444' },
      { name: 'Neutral', value: votes.neutral, color: '#94a3b8' },
    ].filter(d => d.value > 0);
  }

  if (data.length === 0) {
    return <div className="h-64 flex items-center justify-center text-gray-400 text-sm">Sin votos registrados</div>;
  }

  // Render BarChart for Multiple Choice
  if (type === 'multiple_choice') {
    return (
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              width={100}
              tick={{ fontSize: 11, fontWeight: 'bold', fill: '#374151' }}
            />
            <Tooltip
              cursor={{ fill: 'rgba(0,0,0,0.05)' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // Render PieChart for Binary
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
          />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VoteChart;
