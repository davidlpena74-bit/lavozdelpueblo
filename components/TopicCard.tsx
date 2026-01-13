
import React from 'react';
import { Link } from 'react-router-dom';
import { Topic } from '../types';

interface TopicCardProps {
  topic: Topic;
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

const TopicCard: React.FC<TopicCardProps> = ({ topic }) => {
  const totalVotes = topic.type === 'multiple_choice'
    ? Object.values(topic.optionCounts).reduce((a, b) => a + b, 0)
    : (topic.votes.support + topic.votes.oppose + topic.votes.neutral);

  // For binary we show "X% Support". For multi, maybe "Leading Party %" or just "X Votes"
  const supportPercent = totalVotes > 0 ? Math.round((topic.votes.support / totalVotes) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
          {topic.category}
        </span>
        <span className="text-gray-400 text-xs">{new Date(topic.createdAt).toLocaleDateString()}</span>
      </div>
      <Link to={`/topic/${topic.id}`}>
        <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-2">
          {topic.title}
        </h3>
      </Link>
      <p className="text-gray-600 line-clamp-3 mb-6 text-sm">
        {topic.description}
      </p>

      <div className="space-y-2">
        <div className="flex justify-between text-xs font-semibold text-gray-500">
          <span>{totalVotes.toLocaleString()} Votos</span>
          {topic.type === 'binary' && <span>{supportPercent}% A favor</span>}
          {topic.type === 'multiple_choice' && <span>Multirespuesta</span>}
        </div>

        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden flex">
          {totalVotes === 0 ? (
            <div className="w-full h-full bg-gray-200"></div>
          ) : topic.type === 'multiple_choice' ? (
            // Multi-color bar
            Object.entries(topic.optionCounts)
              .sort((a, b) => b[1] - a[1]) // optional: sort largest first
              .map(([name, count]) => (
                <div
                  key={name}
                  className="h-full"
                  style={{
                    width: `${(count / totalVotes) * 100}%`,
                    backgroundColor: getColor(name)
                  }}
                  title={`${name}: ${count}`}
                ></div>
              ))
          ) : (
            // Binary bar
            <>
              <div className="bg-green-500 h-full" style={{ width: `${(topic.votes.support / totalVotes) * 100}%` }}></div>
              <div className="bg-red-500 h-full" style={{ width: `${(topic.votes.oppose / totalVotes) * 100}%` }}></div>
              <div className="bg-gray-400 h-full" style={{ width: `${(topic.votes.neutral / totalVotes) * 100}%` }}></div>
            </>
          )}
        </div>
      </div>

      <Link
        to={`/topic/${topic.id}`}
        className="mt-6 block w-full text-center py-2.5 px-4 bg-gray-50 text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-colors"
      >
        Ver Análisis
      </Link>
    </div>
  );
};

export default TopicCard;
