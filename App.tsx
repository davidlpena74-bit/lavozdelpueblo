
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { supabase } from './src/services/supabase';
import Dashboard from './views/Dashboard';
import TopicPage from './views/TopicPage';
import NewTopic from './views/NewTopic';
import AuthModal from './components/AuthModal';
import { Topic, RegionCode } from './types';

const REGIONS: RegionCode[] = ['AN', 'AR', 'AS', 'IB', 'CN', 'CB', 'CM', 'CL', 'CT', 'VC', 'EX', 'GA', 'MD', 'MC', 'NC', 'PV', 'RI', 'CE', 'ML'];

const generateMockRegionalVotes = () => {
  const votes: any = {};
  REGIONS.forEach(region => {
    votes[region] = {
      support: Math.floor(Math.random() * 100),
      oppose: Math.floor(Math.random() * 100),
      neutral: Math.floor(Math.random() * 20),
    };
  });
  return votes;
};

const INITIAL_TOPICS: Topic[] = [
  {
    id: '1',
    title: 'Renta Básica Universal (RBU)',
    category: 'Economía',
    description: 'Un pago en efectivo periódico entregado a todos de forma individual, sin prueba de recursos ni requisito de trabajo.',
    createdAt: Date.now() - 86400000 * 5,
    votes: { support: 450, oppose: 320, neutral: 120 },
    regionalVotes: generateMockRegionalVotes(),
    pros: ['Reduce la pobreza', 'Proporciona seguridad ante la automatización', 'Apoya el trabajo no remunerado como los cuidados'],
    cons: ['Potencialmente inflacionario', 'Reducción del incentivo para trabajar', 'Enorme coste fiscal'],
    aiAnalysis: 'El debate se centra en el equilibrio entre la seguridad económica y la participación en la fuerza laboral.'
  },
  {
    id: '2',
    title: 'Impuesto al Carbono Estricto',
    category: 'Medio Ambiente',
    description: 'Propuesta de un impuesto obligatorio sobre las emisiones de carbono para los principales actores industriales para combatir el cambio climático.',
    createdAt: Date.now() - 86400000 * 2,
    votes: { support: 890, oppose: 450, neutral: 80 },
    regionalVotes: generateMockRegionalVotes(),
    pros: ['Incentiva la energía verde', 'Internaliza los costes ambientales', 'Los ingresos pueden financiar proyectos renovables'],
    cons: ['Aumento de costes para los consumidores', 'Puede dañar la competitividad industrial', 'Difícil de implementar globalmente'],
    aiAnalysis: 'Los economistas generalmente apoyan esto como una solución eficiente basada en el mercado, pero la viabilidad política sigue siendo baja debido a las preocupaciones sobre el coste.'
  }
];

const Navigation: React.FC<{ user: any; onLogin: () => void; onLogout: () => void }> = ({ user, onLogin, onLogout }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-indigo-600 text-white p-2 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-xl font-extrabold text-gray-900 tracking-tight">La Voz Del <span className="text-indigo-600">Pueblo</span></span>
            </Link>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            <Link to="/" className={`${isActive('/') ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>Explorar</Link>
            <Link to="/new" className={`${isActive('/new') ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>Proponer Tema</Link>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3 bg-gray-50 pr-1 pl-3 py-1 rounded-full border border-gray-200">
                <span className="text-xs font-bold text-gray-700">{user.name}</span>
                <img src={user.avatar} className="w-8 h-8 rounded-full border border-white shadow-sm" alt="User" />
                <button onClick={onLogout} className="p-1.5 text-gray-400 hover:text-red-500 transition">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                </button>
              </div>
            ) : (
              <button
                onClick={onLogin}
                className="bg-indigo-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition active:scale-95"
              >
                Iniciar Sesión
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const App: React.FC = () => {
  const [topics, setTopics] = useState<Topic[]>(() => {
    const saved = localStorage.getItem('politipoll_topics_v2');
    return saved ? JSON.parse(saved) : INITIAL_TOPICS;
  });

  const [user, setUser] = useState<{ name: string; avatar: string } | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // ... imports

  useEffect(() => {
    localStorage.setItem('politipoll_topics_v2', JSON.stringify(topics));
  }, [topics]);

  useEffect(() => {
    // 1. Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // Prioritize username from metadata, fallback to email
        const username = session.user.user_metadata?.username || session.user.email?.split('@')[0] || 'Ciudadano';
        setUser({
          name: username,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
        });
      }
    });

    // 2. Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const username = session.user.user_metadata?.username || session.user.email?.split('@')[0] || 'Ciudadano';
        setUser({
          name: username,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAddTopic = (newTopic: Topic) => {
    setTopics(prev => [newTopic, ...prev]);
  };

  const handleVote = (topicId: string, choice: 'support' | 'oppose' | 'neutral', region: RegionCode) => {
    setTopics(prev => prev.map(t => {
      if (t.id === topicId) {
        const updatedRegional = { ...t.regionalVotes };
        if (!updatedRegional[region]) {
          updatedRegional[region] = { support: 0, oppose: 0, neutral: 0 };
        }
        updatedRegional[region] = {
          ...updatedRegional[region],
          [choice]: updatedRegional[region][choice] + 1
        };

        return {
          ...t,
          votes: {
            ...t.votes,
            [choice]: t.votes[choice] + 1
          },
          regionalVotes: updatedRegional
        };
      }
      return t;
    }));
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col">
        <Navigation
          user={user}
          onLogin={() => setIsAuthModalOpen(true)}
          onLogout={async () => {
            await supabase.auth.signOut();
            setUser(null);
          }}
        />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Dashboard topics={topics} />} />
            <Route path="/topic/:id" element={<TopicPage topics={topics} onVote={handleVote} user={user} onRequireAuth={() => setIsAuthModalOpen(true)} />} />
            <Route path="/new" element={<NewTopic onAddTopic={handleAddTopic} />} />
          </Routes>
        </main>

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={(userData) => setUser(userData)}
        />

        <footer className="bg-white border-t border-gray-200 py-12 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
            <p>&copy; 2024 LaVozDelPueblo.es. Todos los derechos reservados.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-indigo-600 transition">Términos</a>
              <a href="#" className="hover:text-indigo-600 transition">Privacidad</a>
            </div>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
