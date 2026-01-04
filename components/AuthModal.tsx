
import React, { useState } from 'react';
import { supabase } from '../src/services/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { name: string; avatar: string }) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  // Check if session exists on mount/open could be added here

  const handleMagicLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Supabase Magic Link Login
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin, // Redirect back to this page
      },
    });

    if (error) {
      alert('Error: ' + error.message);
    } else {
      setSent(true);
      // For UX, we don't close the modal immediately, we show a success message
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

          <p className="text-gray-600 mb-8 text-sm leading-relaxed">
            Ingresa tu correo electrónico para recibir un enlace de acceso seguro. Sin contraseñas que recordar.
          </p>

          {sent ? (
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-green-900">¡Enlace enviado!</h3>
              <p className="mt-2 text-sm text-green-600">
                Revisa tu bandeja de entrada ({email}) y haz clic en el enlace para entrar.
              </p>
              <button
                onClick={onClose}
                className="mt-4 text-sm font-medium text-green-600 hover:text-green-500"
              >
                Cerrar ventana
              </button>
            </div>
          ) : (
            <form onSubmit={handleMagicLinkLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full flex items-center justify-center py-3 bg-indigo-600 hover:bg-indigo-700 transition-all font-bold text-white rounded-full shadow-md disabled:opacity-50`}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span>Enviar Enlace Mágico ✨</span>
                )}
              </button>
            </form>
          )}

          <div className="mt-10 pt-6 border-t border-gray-50 text-center">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold flex items-center justify-center">
              <svg className="w-3 h-3 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.9L10 1.154l7.834 3.746v5.203c0 5.061-3.345 9.778-7.834 11.05-4.489-1.272-7.834-5.989-7.834-11.05V4.9zM10 8a1 1 0 011 1v5a1 1 0 11-2 0V9a1 1 0 011-1zm0-4a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" /></svg>
              Powered by Supabase Auth
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
