import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ArrowRight, ShieldCheck, ClipboardList } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const expectedPassword = import.meta.env.VITE_APP_PASSWORD || '031226';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(false);

    setTimeout(() => {
      if (password.trim() === expectedPassword.trim()) {
        localStorage.setItem('chaski_dental_auth', 'true');
        onLoginSuccess();
      } else {
        setError(true);
        setIsSubmitting(false);
      }
    }, 200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-slate-900 to-pink-950 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Círculos decorativos de fondo */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-pink-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl border border-purple-100/30 p-8 shadow-2xl relative z-10">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-700 via-fuchsia-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-600/30 mb-4">
            <ClipboardList className="w-8 h-8" />
          </div>

          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Chaski Dental
          </h1>
          <p className="text-sm font-semibold text-purple-700 mt-0.5">
            Control Clínico, Atenciones y Caja
          </p>
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-800 text-xs font-semibold border border-purple-200/60">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
            <span>Acceso Privado</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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
                placeholder="Ingresa la clave..."
                className={`w-full pl-10 pr-11 py-3 text-sm rounded-xl border bg-slate-50/50 text-slate-900 font-semibold focus:outline-none focus:bg-white transition-all ${
                  error
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
                    : 'border-purple-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-200'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-purple-700 transition cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <p className="text-xs font-semibold text-rose-600 mt-2 flex items-center gap-1 animate-pulse">
                <span>⚠️ Clave incorrecta. Por favor vuelve a intentar.</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!password || isSubmitting}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-700 via-fuchsia-600 to-pink-600 hover:from-purple-800 hover:to-pink-700 text-white font-bold text-sm shadow-lg shadow-purple-700/25 active:scale-[0.98] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Ingresar al Sistema</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-5 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            Clínica Odontológica — Sistema de Control Diario
          </p>
        </div>
      </div>
    </div>
  );
};
