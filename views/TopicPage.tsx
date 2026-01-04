
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Topic, RegionCode } from '../types';
import VoteChart from '../components/VoteChart';
import SpainMap from '../components/SpainMap';

interface TopicPageProps {
  topics: Topic[];
  onVote: (id: string, choice: 'support' | 'oppose' | 'neutral', region: RegionCode) => void;
  user: any;
  onRequireAuth: () => void;
}

const REGIONS: { code: RegionCode; name: string }[] = [
  { code: 'MD', name: 'Madrid' }, { code: 'CT', name: 'Cataluña' }, { code: 'AN', name: 'Andalucía' },
  { code: 'VC', name: 'Comunidad Valenciana' }, { code: 'GA', name: 'Galicia' }, { code: 'PV', name: 'País Vasco' },
  { code: 'CL', name: 'Castilla y León' }, { code: 'CM', name: 'Castilla-La Mancha' }, { code: 'AR', name: 'Aragón' },
  { code: 'EX', name: 'Extremadura' }, { code: 'IB', name: 'Baleares' }, { code: 'CN', name: 'Canarias' },
  { code: 'AS', name: 'Asturias' }, { code: 'CB', name: 'Cantabria' }, { code: 'NC', name: 'Navarra' },
  { code: 'MC', name: 'Murcia' }, { code: 'RI', name: 'La Rioja' }, { code: 'CE', name: 'Ceuta' },
  { code: 'ML', name: 'Melilla' }
];

const TopicPage: React.FC<TopicPageProps> = ({ topics, onVote, user, onRequireAuth }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const topic = topics.find(t => t.id === id);
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<RegionCode | ''>('');

  if (!topic) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold text-gray-900">Tema no encontrado</h2>
        <button onClick={() => navigate('/')} className="mt-4 text-indigo-600 hover:underline font-bold">Volver al panel principal</button>
      </div>
    );
  }

  const handleVoteClick = (choice: 'support' | 'oppose' | 'neutral') => {
    if (!user) {
      onRequireAuth();
      return;
    }
    if (!selectedRegion) {
      alert("Por favor, selecciona tu comunidad autónoma antes de votar.");
      return;
    }
    onVote(topic.id, choice, selectedRegion as RegionCode);
    setHasVoted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Topic Description & Voting */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
            <div className="flex items-center space-x-2 mb-4">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full uppercase tracking-wider">{topic.category}</span>
              <span className="text-gray-400 text-sm">• Encuesta Activa</span>
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-6 leading-tight">{topic.title}</h1>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              {topic.description}
            </p>

            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Emite tu Voto Ciudadano</h3>

              {!hasVoted ? (
                <div className="space-y-8">
                  <div className="max-w-xs">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Tu Comunidad Autónoma:</label>
                    <select
                      value={selectedRegion}
                      onChange={(e) => setSelectedRegion(e.target.value as RegionCode)}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    >
                      <option value="" className="text-gray-500">Selecciona tu CCAA...</option>
                      {REGIONS.map(r => (
                        <option key={r.code} value={r.code} className="text-gray-900 bg-white">
                          {r.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <button
                      onClick={() => handleVoteClick('support')}
                      className={`flex flex-col items-center p-6 bg-white border-2 border-gray-100 hover:border-green-500 rounded-2xl transition-all group shadow-sm hover:shadow-md ${!selectedRegion && 'opacity-60 grayscale-[0.5]'}`}
                    >
                      <div className="w-14 h-14 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                      </div>
                      <span className="font-bold text-gray-900 uppercase tracking-wide text-sm">{topic.labelSupport || 'A favor'}</span>
                    </button>
                    <button
                      onClick={() => handleVoteClick('oppose')}
                      className={`flex flex-col items-center p-6 bg-white border-2 border-gray-100 hover:border-red-500 rounded-2xl transition-all group shadow-sm hover:shadow-md ${!selectedRegion && 'opacity-60 grayscale-[0.5]'}`}
                    >
                      <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                      </div>
                      <span className="font-bold text-gray-900 uppercase tracking-wide text-sm">{topic.labelOppose || 'En contra'}</span>
                    </button>
                    <button
                      onClick={() => handleVoteClick('neutral')}
                      className={`flex flex-col items-center p-6 bg-white border-2 border-gray-100 hover:border-gray-500 rounded-2xl transition-all group shadow-sm hover:shadow-md ${!selectedRegion && 'opacity-60 grayscale-[0.5]'}`}
                    >
                      <div className="w-14 h-14 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                      </div>
                      <span className="font-bold text-gray-900 uppercase tracking-wide text-sm">Neutral</span>
                    </button>
                  </div>
                  {!user && (
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-2 font-medium">Es necesario estar identificado para votar</p>
                      <button
                        onClick={onRequireAuth}
                        className="text-indigo-600 font-bold hover:text-indigo-700 underline text-sm"
                      >
                        Iniciar sesión ahora
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-10 bg-indigo-50/50 rounded-2xl text-indigo-700 font-bold border border-indigo-100 animate-pulse">
                  <svg className="w-12 h-12 mx-auto mb-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  ¡Voto registrado! Gracias por participar desde {REGIONS.find(r => r.code === selectedRegion)?.name}.
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Distribución Geográfica</h3>
              <div className="flex space-x-2">
                <div className="h-3 w-10 bg-green-500 rounded-full"></div>
                <div className="h-3 w-10 bg-red-500 rounded-full"></div>
              </div>
            </div>
            <SpainMap regionalVotes={topic.regionalVotes} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm group hover:border-green-100 transition-colors">
              <h3 className="text-lg font-bold text-green-600 mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Argumentos A Favor
              </h3>
              <ul className="space-y-4">
                {topic.pros.map((pro, idx) => (
                  <li key={idx} className="flex items-start text-gray-600 text-sm leading-relaxed">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm group hover:border-red-100 transition-colors">
              <h3 className="text-lg font-bold text-red-600 mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                Argumentos En Contra
              </h3>
              <ul className="space-y-4">
                {topic.cons.map((con, idx) => (
                  <li key={idx} className="flex items-start text-gray-600 text-sm leading-relaxed">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Statistics & AI Summary */}
        <div className="space-y-8">
          <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm sticky top-24">
            <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-2">Estadísticas en Tiempo Real</h3>
            <VoteChart votes={topic.votes} labelSupport={topic.labelSupport} labelOppose={topic.labelOppose} />
            <div className="mt-8 space-y-4">
              <div className="flex justify-between items-center text-sm p-3 bg-green-50 rounded-xl">
                <span className="text-green-700 font-medium">{topic.labelSupport || 'A favor'}</span>
                <span className="font-extrabold text-green-700">{topic.votes.support}</span>
              </div>
              <div className="flex justify-between items-center text-sm p-3 bg-red-50 rounded-xl">
                <span className="text-red-700 font-medium">{topic.labelOppose || 'En contra'}</span>
                <span className="font-extrabold text-red-700">{topic.votes.oppose}</span>
              </div>
              <div className="flex justify-between items-center text-sm p-3 bg-slate-100 rounded-xl">
                <span className="text-slate-600 font-medium">Neutral</span>
                <span className="font-extrabold text-slate-700">{topic.votes.neutral}</span>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl shadow-lg text-white">
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-1 bg-white/20 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <h3 className="font-bold text-sm uppercase tracking-wider">Perspectiva IA</h3>
              </div>
              <p className="text-indigo-50 leading-relaxed text-sm italic font-light">
                "{topic.aiAnalysis || 'Analizando el pulso social...'}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicPage;
