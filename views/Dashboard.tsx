
import React from 'react';
import { Topic } from '../types';
import TopicCard from '../components/TopicCard';

interface DashboardProps {
  topics: Topic[];
}

const Dashboard: React.FC<DashboardProps> = ({ topics }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <header className="mb-12 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Democracia impulsada por <span className="text-indigo-600">Inteligencia</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Explora los debates políticos actuales, emite tu voto y obtén análisis equilibrados potenciados por IA avanzada.
        </p>
      </header>

      <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
        <h2 className="text-2xl font-bold text-gray-900">Temas en Tendencia</h2>
        <div className="flex flex-wrap gap-2">
          {['Todos', 'Economía', 'Medio Ambiente', 'Social', 'Legal'].map(cat => (
            <button key={cat} className="px-4 py-2 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-100 transition border border-gray-200">
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {topics.map(topic => (
          <TopicCard key={topic.id} topic={topic} />
        ))}
      </div>

      {topics.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-300">
          <p className="text-gray-500 text-lg">No hay temas activos. ¿Por qué no propones uno?</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
