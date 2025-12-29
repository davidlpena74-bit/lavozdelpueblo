
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Topic, RegionalVotes } from '../types';
import { generateTopicAnalysis, suggestPopularTopics } from '../services/geminiService';

const REGIONS = ['AN', 'AR', 'AS', 'IB', 'CN', 'CB', 'CM', 'CL', 'CT', 'VC', 'EX', 'GA', 'MD', 'MC', 'NC', 'PV', 'RI', 'CE', 'ML'];

const NewTopic: React.FC<{ onAddTopic: (topic: Topic) => void }> = ({ onAddTopic }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Economía'
  });

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const suggs = await suggestPopularTopics();
        setSuggestions(suggs);
      } catch (e) {
        console.error("Failed to fetch suggestions");
      }
    };
    fetchSuggestions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;

    setLoading(true);
    try {
      const analysis = await generateTopicAnalysis(formData.title, formData.description);
      
      const emptyRegional: RegionalVotes = {};
      REGIONS.forEach(r => {
        emptyRegional[r] = { support: 0, oppose: 0, neutral: 0 };
      });

      const newTopic: Topic = {
        id: Math.random().toString(36).substr(2, 9),
        title: formData.title,
        description: formData.description,
        category: formData.category,
        createdAt: Date.now(),
        votes: { support: 0, oppose: 0, neutral: 0 },
        regionalVotes: emptyRegional,
        pros: analysis.pros,
        cons: analysis.cons,
        aiAnalysis: analysis.summary
      };

      onAddTopic(newTopic);
      navigate('/');
    } catch (error) {
      alert("Error al analizar el tema. Por favor, revisa tu conexión o inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-indigo-600 px-8 py-10 text-white">
          <h1 className="text-3xl font-extrabold mb-2">Proponer un Nuevo Debate</h1>
          <p className="text-indigo-100">La IA generará automáticamente una lista equilibrada de argumentos y un análisis para tu tema.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Título del Tema</label>
            <input
              type="text"
              required
              placeholder="p.ej. Implementación del voto obligatorio en elecciones generales"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
            {suggestions.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-xs text-gray-400 self-center">Sugerencias:</span>
                {suggestions.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setFormData({ ...formData, title: s })}
                    className="text-xs bg-gray-100 hover:bg-indigo-50 hover:text-indigo-600 px-2 py-1 rounded transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Categoría</label>
              <select
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Economía" className="text-gray-900">Economía</option>
                <option value="Medio Ambiente" className="text-gray-900">Medio Ambiente</option>
                <option value="Social" className="text-gray-900">Social</option>
                <option value="Legal" className="text-gray-900">Legal</option>
                <option value="Salud" className="text-gray-900">Salud</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Duración de la Votación</label>
              <select disabled className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed">
                <option>7 Días (Estándar)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Descripción y Contexto</label>
            <textarea
              required
              rows={4}
              placeholder="Proporciona un breve resumen de por qué este tema es importante y qué se debería votar específicamente."
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end items-center space-x-4">
             <button type="button" onClick={() => navigate('/')} className="px-6 py-3 text-sm font-bold text-gray-600 hover:text-gray-900">Cancelar</button>
             <button
               type="submit"
               disabled={loading}
               className={`px-10 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700 active:scale-95'}`}
             >
               {loading ? 'Analizando...' : 'Proponer Tema'}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTopic;
