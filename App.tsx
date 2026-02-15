
import React, { useState, useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { HashRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from './src/services/supabase';
import { api } from './src/services/api';
import Dashboard from './views/Dashboard';
import TopicPage from './views/TopicPage';
import NewTopic from './views/NewTopic';
import AuthModal from './components/AuthModal';
import CookieBanner from './components/CookieBanner';
import { Topic, RegionCode } from './types';
import UserProfile from './views/UserProfile';
import UserVotes from './views/UserVotes';
import UserSupports from './views/UserSupports';
import CategoryList from './views/CategoryList';
import CategoryDashboard from './views/CategoryDashboard';
import Terms from './views/Terms';
import Privacy from './views/Privacy';
import NewTopicsList from './views/NewTopicsList';

import { getInitials } from './src/utils/format';

const Navigation: React.FC<{ user: any; onLogin: () => void; onLogout: () => void }> = ({ user, onLogin, onLogout }) => {
  // ... (keep logic)
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path: string) => location.pathname === path;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    setIsMenuOpen(false);
    setIsMobileMenuOpen(false);
    await onLogout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* ... */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="-ml-2 mr-2 flex items-center sm:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors"
              >
                <span className="sr-only">Open main menu</span>
                <svg className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <Link to="/" className="flex items-center space-x-2">
              {/* ... */}
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              </div>
              <span className="text-xl font-extrabold text-gray-900 tracking-tight">La Voz Del <span className="text-blue-600">Pueblo</span></span>
            </Link>
          </div>
          {/* ... Links ... */}
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            <Link to="/" className={`${isActive('/') ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>Temas en Votación</Link>
            <Link to="/new-topics" className={`${isActive('/new-topics') ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>Nuevos Temas</Link>
            <a
              href="/inmobiliaria.html"
              target="_blank"
              className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium group"
              title="Dashboard Inmobiliario"
            >
              <svg className="w-5 h-5 mr-1 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="hidden lg:inline">Inmobiliaria</span>
            </a>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3 bg-gray-50 pr-1 pl-3 py-1 rounded-full border border-gray-200">
                <Link to="/profile" className="flex items-center space-x-2 hover:opacity-80">
                  <span className="text-xs font-bold text-gray-700">{user.name}</span>
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs border border-white shadow-sm">
                    {getInitials(user.name)}
                  </div>
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>

                  {isMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-10 w-full h-full" onClick={() => setIsMenuOpen(false)}></div>
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-20">
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Configuración
                        </Link>
                        <Link
                          to="/profile/votes"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Mis Votos
                        </Link>
                        <Link
                          to="/profile/supports"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Mis Apoyos
                        </Link>
                        <Link
                          to="/propose"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Proponer Tema
                        </Link>
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsMenuOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 bg-red-50/10 border-t border-gray-100"
                        >
                          Cerrar Sesión
                        </button>
                      </div>
                    </>
                  )}
                </div>
                <div className="h-4 w-px bg-gray-300 mx-1"></div>
                <button onClick={handleLogout} className="p-1.5 text-gray-400 hover:text-red-500 transition" title="Cerrar Sesión">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                </button>
              </div>
            ) : (
              // ... login button ...
              <button
                onClick={onLogin}
                className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition active:scale-95"
              >
                Iniciar Sesión
              </button>
            )}
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-white border-t border-gray-200">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className={`${isActive('/') ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Temas en Votación
            </Link>
            <Link
              to="/new-topics"
              className={`${isActive('/new-topics') ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Nuevos Temas
            </Link>
            <a
              href="/inmobiliaria.html"
              target="_blank"
              className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium flex items-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Inmobiliaria
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};



const App: React.FC = () => {
  const [topics, setTopics] = useState<Topic[]>([]);

  const [user, setUser] = useState<{ id: string; name: string; avatar: string; email: string; region?: string; is_fake?: boolean } | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const loadTopics = async () => {
    try {
      const data = await api.fetchTopics();

      if (user) {
        // Fetch user votes to mark topics as voted
        const userVotes = await api.fetchUserVotes(user.id);
        const votedTopicIds = new Set(userVotes.map((v: any) => v.topic_id));
        const merged = data.map(t => ({
          ...t,
          hasVoted: votedTopicIds.has(t.id)
        }));
        setTopics(merged);
      } else {
        setTopics(data);
      }
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  useEffect(() => {
    loadTopics();
  }, [user]);

  useEffect(() => {
    // 1. Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user);
      }
    });

    // 2. Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUserProfile(session.user);
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (sessionUser: any) => {
    const username = sessionUser.user_metadata?.username || sessionUser.email?.split('@')[0] || 'Ciudadano';

    // Fetch extended profile data (region)
    let { data: profile } = await supabase
      .from('profiles')
      .select('region, is_fake, avatar_url')
      .eq('id', sessionUser.id)
      .single();

    if (!profile) {
      // Profile missing? Trigger might have failed. Auto-repair.
      console.log('Profile missing for user. Attempting auto-repair...');
      try {
        const { error: insertError } = await supabase.from('profiles').insert({
          id: sessionUser.id,
          region: sessionUser.user_metadata?.region || 'MD',
          is_fake: false
        });

        if (!insertError) {
          // Fetch again
          const { data: retryProfile } = await supabase
            .from('profiles')
            .select('region, is_fake, avatar_url')
            .eq('id', sessionUser.id)
            .single();
          profile = retryProfile;
        } else {
          console.error('Auto-repair failed:', insertError);
          // CRITICAL: If we can't create a profile, logout to avoid broken state
          await supabase.auth.signOut();
          setUser(null);
          return;
        }
      } catch (e) {
        console.error('Auto-repair exception:', e);
        await supabase.auth.signOut();
        setUser(null);
        return;
      }
    }

    setUser({
      id: sessionUser.id,
      name: username,
      email: sessionUser.email || '',
      avatar: profile?.avatar_url || '',
      region: profile?.region || sessionUser.user_metadata?.region,
      is_fake: profile?.is_fake
    });
  };

  const handleAddTopic = async (newTopic: Topic) => {
    try {
      await api.createTopic(newTopic);
      await loadTopics();
    } catch (e: any) {
      alert('Error creating topic: ' + e.message);
    }
  };

  const handleVote = async (topicId: string, choice: 'support' | 'oppose' | 'neutral', region: RegionCode, choiceOption?: string) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    try {
      await api.castVote(topicId, choice, region, choiceOption);
      await loadTopics();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleRemoveVote = async (topicId: string) => {
    if (!user) return;
    try {
      await api.removeVote(topicId);
      await loadTopics();
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <HelmetProvider>
      <HashRouter>
        <div className="min-h-screen flex flex-col relative">
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
              <Route path="/" element={<CategoryList />} />
              <Route path="/latest" element={<Dashboard topics={topics} />} />
              <Route path="/category/:categoryId" element={<CategoryDashboard topics={topics} />} />

              <Route path="/topic/:id" element={<TopicPage topics={topics} onVote={handleVote} user={user} onRequireAuth={() => setIsAuthModalOpen(true)} />} />
              <Route path="/propose" element={<NewTopic onAddTopic={handleAddTopic} />} />
              <Route path="/new-topics" element={<NewTopicsList topics={topics} user={user} onVote={handleVote} onRemoveVote={handleRemoveVote} onRequireAuth={() => setIsAuthModalOpen(true)} />} />
              {user && (
                <>
                  <Route path="/profile" element={<UserProfile user={user} />} />
                  <Route path="/profile/votes" element={<UserVotes userId={user.id} />} />
                  <Route path="/profile/supports" element={<UserSupports userId={user.id} />} />
                </>
              )}
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
            </Routes>
          </main>

          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
          />

          <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 py-12 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
              <p>&copy; 2026 LaVozDelPueblo.es. Todos los derechos reservados.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Link to="/terms" className="hover:text-blue-600 transition">Términos</Link>
                <Link to="/privacy" className="hover:text-blue-600 transition">Privacidad</Link>
              </div>
            </div>
          </footer>
          <CookieBanner />
        </div>
      </HashRouter>
    </HelmetProvider>
  );
};

export default App;
