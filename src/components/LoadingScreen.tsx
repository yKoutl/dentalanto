import React from 'react';
import { AnimatedLoginBackground } from './AnimatedLoginBackground';
import { ClipboardList } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
  subtext?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Cargando sistema...',
  subtext = 'Chaski Dental • Control Clínico y Caja'
}) => {
  return (
    <AnimatedLoginBackground>
      <div className="flex flex-col items-center justify-center p-8 sm:p-10 bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/60 max-w-sm w-full mx-4 text-center animate-in fade-in zoom-in-95 duration-300">
        {/* Contenedor con Espiral Giratoria y Aura */}
        <div className="relative mb-6 flex items-center justify-center">
          {/* Anillo de pulso exterior */}
          <div className="absolute w-28 h-28 bg-pink-500/20 rounded-full animate-ping pointer-events-none" />

          {/* Espiral giratoria elegante en morado y rosa */}
          <div className="w-28 h-28 rounded-full border-4 border-purple-100 border-t-purple-700 border-r-pink-500 animate-spin" />

          {/* Icono central */}
          <div className="absolute w-20 h-20 flex items-center justify-center bg-white rounded-full p-2.5 shadow-md border border-purple-100">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-700 via-fuchsia-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-purple-600/30">
              <ClipboardList className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Textos */}
        <h2 className="text-base font-extrabold text-slate-800 tracking-tight mb-1 flex items-center justify-center gap-1.5">
          <span>{message}</span>
        </h2>

        <p className="text-xs font-semibold text-purple-700 opacity-90 animate-pulse">
          {subtext}
        </p>

        {/* Indicador de 3 puntos pulsantes */}
        <div className="flex items-center justify-center gap-1.5 mt-5">
          <div className="w-2 h-2 rounded-full bg-purple-700 animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 rounded-full bg-fuchsia-600 animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 rounded-full bg-pink-500 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </AnimatedLoginBackground>
  );
};

export default LoadingScreen;
