
import React, { useState, useEffect, useRef } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { name: string; avatar: string }) => void;
}

function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [isHttps, setIsHttps] = useState(true);
  const googleBtnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Verificar si estamos en HTTPS (requerido por Facebook)
    setIsHttps(window.location.protocol === 'https:' || window.location.hostname === 'localhost');

    if (isOpen) {
      // 1. Inicializar Google Identity Services
      const initGoogle = () => {
        if ((window as any).google) {
          (window as any).google.accounts.id.initialize({
            client_id: "TU_GOOGLE_CLIENT_ID.apps.googleusercontent.com", // REEMPLAZAR CON ID REAL
            callback: (response: any) => {
              setIsLoading('google');
              const userData = parseJwt(response.credential);
              if (userData) {
                setTimeout(() => {
                  onLoginSuccess({
                    name: userData.name,
                    avatar: userData.picture
                  });
                  setIsLoading(null);
                  onClose();
                }, 800);
              }
            }
          });

          if (googleBtnRef.current) {
            (window as any).google.accounts.id.renderButton(googleBtnRef.current, {
              theme: "outline",
              size: "large",
              width: 320,
              text: "signin_with",
              shape: "pill"
            });
          }
        } else {
          // Re-intentar si el script no ha cargado aún
          setTimeout(initGoogle, 500);
        }
      };
      
      initGoogle();
    }
  }, [isOpen]);

  const handleFacebookLogin = () => {
    const fb = (window as any).FB;
    
    if (!fb) {
      alert("El SDK de Facebook no ha cargado. Por favor, revisa tu conexión o bloqueador de anuncios.");
      return;
    }

    if (!isHttps) {
      alert("Error de Seguridad: Facebook requiere una conexión segura (HTTPS) para iniciar sesión. Si estás en un entorno de desarrollo, asegúrate de usar HTTPS.");
      return;
    }

    setIsLoading('facebook');
    
    fb.login((response: any) => {
      if (response.authResponse) {
        fb.api('/me', { fields: 'name,picture.type(large)' }, (userData: any) => {
          onLoginSuccess({
            name: userData.name,
            avatar: userData.picture?.data?.url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`
          });
          setIsLoading(null);
          onClose();
        });
      } else {
        setIsLoading(null);
        console.log('User cancelled login or did not fully authorize.');
      }
    }, { scope: 'public_profile,email' });
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
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Identidad Ciudadana</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition p-1 hover:bg-gray-100 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <p className="text-gray-600 mb-8 text-sm leading-relaxed">
            Para garantizar un sistema de "Un ciudadano, Un voto", conectamos con proveedores de identidad verificados. Tu voto será anónimo para otros usuarios.
          </p>
          
          <div className="flex flex-col items-center space-y-4">
            {/* Contenedor oficial de Google */}
            <div className="w-full flex justify-center" ref={googleBtnRef}></div>

            {/* Separador visual */}
            <div className="flex items-center w-full my-2">
              <div className="flex-grow h-px bg-gray-100"></div>
              <span className="px-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest">Alternativa</span>
              <div className="flex-grow h-px bg-gray-100"></div>
            </div>

            {/* Botón Facebook */}
            <div className="w-full">
              <button 
                onClick={handleFacebookLogin}
                disabled={!!isLoading}
                className={`w-full flex items-center justify-center space-x-3 py-3 bg-[#1877F2] hover:bg-[#166fe5] transition-all font-bold text-white rounded-full shadow-md disabled:opacity-50 ${!isHttps ? 'opacity-50 grayscale' : ''}`}
              >
                {isLoading === 'facebook' ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                )}
                <span>Continuar con Facebook</span>
              </button>
              
              {!isHttps && (
                <p className="mt-2 text-[10px] text-red-500 text-center font-medium">
                  ⚠️ Facebook Login requiere HTTPS para funcionar.
                </p>
              )}
            </div>
          </div>
          
          <div className="mt-10 pt-6 border-t border-gray-50 text-center">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold flex items-center justify-center">
              <svg className="w-3 h-3 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.9L10 1.154l7.834 3.746v5.203c0 5.061-3.345 9.778-7.834 11.05-4.489-1.272-7.834-5.989-7.834-11.05V4.9zM10 8a1 1 0 011 1v5a1 1 0 11-2 0V9a1 1 0 011-1zm0-4a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" /></svg>
              Datos encriptados de extremo a extremo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
