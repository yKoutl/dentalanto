import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ArrowRight, ClipboardList } from 'lucide-react';
import { AnimatedLoginBackground } from './AnimatedLoginBackground';
import { LoadingScreen } from './LoadingScreen';

interface LoginProps {
  onLoginSuccess: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const expectedPassword = import.meta.env.VITE_APP_PASSWORD || '031226';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);

    if (password.trim() === expectedPassword.trim()) {
      setIsLoading(true);
      setTimeout(() => {
        localStorage.setItem('chaski_dental_auth', 'true');
        onLoginSuccess();
      }, 700);
    } else {
      setError(true);
    }
  };

  if (isLoading) {
    return (
      <LoadingScreen
        message="Iniciando sesión..."
        subtext="Accediendo a Chaski Dental"
      />
    );
  }

  return (
    <AnimatedLoginBackground>
      <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl border border-white/60 p-8 sm:p-10 shadow-2xl shadow-purple-950/50 relative z-10 transition-all">
        {/* Header con Icono y Marca */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-700 via-fuchsia-600 to-pink-500 flex items-center justify-center text-white shadow-xl shadow-purple-600/35 mb-4 transform hover:scale-105 transition-transform duration-300">
            <ClipboardList className="w-8 h-8" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Chaski Dental
          </h1>
          <p className="text-sm font-semibold text-purple-700 mt-1">
            Control Clínico, Atenciones y Caja
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Clave de Acceso
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                autoFocus
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="Ingresa tu clave..."
                className={`w-full pl-10 pr-11 py-3.5 text-sm rounded-xl border bg-slate-50/70 text-black font-semibold focus:outline-none focus:bg-white transition-all shadow-inner ${
                  error
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
                    : 'border-purple-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-200'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-purple-700 transition cursor-pointer"
                title={showPassword ? 'Ocultar clave' : 'Mostrar clave'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <p className="text-xs font-semibold text-rose-600 mt-2 flex items-center gap-1.5 animate-pulse">
                <span>Clave incorrecta. Por favor vuelve a intentar.</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!password || isLoading}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-700 via-fuchsia-600 to-pink-600 hover:from-purple-800 hover:to-pink-700 text-white font-bold text-sm shadow-xl shadow-purple-700/30 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Ingresar al Sistema</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer sutil */}
        <div className="mt-8 pt-5 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400 font-medium">
            Clínica Odontológica — Sistema de Control Diario
          </p>
        </div>
      </div>
    </AnimatedLoginBackground>
  );
};
