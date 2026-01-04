
import React, { useState } from 'react';
import { supabase } from '../src/services/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { name: string; avatar: string }) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'magic_link' | 'password'>('password'); // Default to password as per request
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [sent, setSent] = useState(false);

  const handleMagicLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    if (error) alert('Error: ' + error.message);
    else setSent(true);
    setLoading(false);
  };

  const handlePasswordAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (mode === 'signup') {
      if (!username) {
        alert('Por favor, elige un nombre de usuario.');
        setLoading(false);
        return;
      }

      // Check if username exists
      // Note: This requires the 'profiles' table and RLS policies to be set up as instructed.
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single();

      if (existingUser) {
        alert('Este nombre de usuario ya está cogido. Por favor elige otro.');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
          }
        }
      });
      if (error) {
        // If trigger fails (duplicate username race condition), catch it here too.
        if (error.message.includes('unique constraint') || error.message.includes('profiles_username_key')) {
          alert('El nombre de usuario no está disponible.');
        } else {
          alert('Error al registrarse: ' + error.message);
        }
      } else {
        alert('Usuario registrado! ' + (data.session ? 'Sesión iniciada.' : 'Por favor revisa tu correo para confirmar.'));
        if (data.session) onClose();
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        alert('Error al entrar: ' + error.message);
      } else {
        // Session listener in App.tsx will handle the rest
        onClose();
      }
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden transform transition-all border border-gray-100">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Acceso Ciudadano</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition p-1 hover:bg-gray-100 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex space-x-2 mb-6 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setView('password')}
              className={`flex - 1 py - 1.5 text - sm font - medium rounded - md transition - all ${view === 'password' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'} `}
            >
              Contraseña
            </button>
            <button
              onClick={() => setView('magic_link')}
              className={`flex - 1 py - 1.5 text - sm font - medium rounded - md transition - all ${view === 'magic_link' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'} `}
            >
              Link Mágico
            </button>
          </div>

          {view === 'magic_link' ? (
            sent ? (
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100">
                <h3 className="text-lg font-medium text-green-900">¡Enlace enviado!</h3>
                <p className="mt-2 text-sm text-green-600">Revisa {email}</p>
                <button onClick={onClose} className="mt-4 text-sm font-medium text-green-600 hover:text-green-500">Cerrar</button>
              </div>
            ) : (
              <form onSubmit={handleMagicLinkLogin} className="space-y-4">
                <p className="text-gray-600 text-sm">Te enviaremos un enlace a tu correo. Sin contraseñas.</p>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                  <input type="email" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" placeholder="ejemplo@correo.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <button type="submit" disabled={loading} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold shadow-md disabled:opacity-50">
                  {loading ? 'Enviando...' : 'Enviar Enlace Mágico ✨'}
                </button>
              </form>
            )
          ) : (
            <form onSubmit={handlePasswordAuth} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                <input type="email" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" placeholder="ejemplo@correo.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              {mode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre de Usuario</label>
                  <input type="text" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" placeholder="usuario_unico" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                <input type="password" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>

              <button type="submit" disabled={loading} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold shadow-md disabled:opacity-50">
                {loading ? 'Procesando...' : (mode === 'signin' ? 'Iniciar Sesión' : 'Registrarse')}
              </button>

              <div className="text-center mt-4">
                <button
                  type="button"
                  className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
                  onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                >
                  {mode === 'signin' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia Sesión'}
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 text-center">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Powered by Supabase Auth</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
