
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Topic } from '../types';

interface VoteChartProps {
  votes: Topic['votes'];
}

const VoteChart: React.FC<VoteChartProps & { labelSupport?: string; labelOppose?: string }> = ({ votes, labelSupport, labelOppose }) => {
  const data = [
    { name: labelSupport || 'A favor', value: votes.support, color: '#22c55e' },
    { name: labelOppose || 'En contra', value: votes.oppose, color: '#ef4444' },
    { name: 'Neutral', value: votes.neutral, color: '#94a3b8' },
  ].filter(d => d.value > 0);

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
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
          />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VoteChart;
