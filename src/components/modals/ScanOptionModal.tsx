import React from 'react';
import { Layers, RefreshCw, PlusCircle, X } from 'lucide-react';

interface ScanOptionModalProps {
  isOpen: boolean;
  onReplace: () => void;
  onAppend: () => void;
  onCancel: () => void;
  newAtencionesCount: number;
  newGastosCount: number;
  existingAtencionesCount: number;
  existingGastosCount: number;
}

export const ScanOptionModal: React.FC<ScanOptionModalProps> = ({
  isOpen,
  onReplace,
  onAppend,
  onCancel,
  newAtencionesCount,
  newGastosCount,
  existingAtencionesCount,
  existingGastosCount
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-purple-100 animate-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between pb-3 border-b border-purple-100 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Registros Detectados en la Foto
              </h3>
              <p className="text-xs text-slate-500">
                Se detectaron {newAtencionesCount} atenciones y {newGastosCount} gastos
              </p>
            </div>
          </div>

          <button
            onClick={onCancel}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-slate-700 mb-5 leading-relaxed">
          Ya tienes <span className="font-bold text-purple-900">{existingAtencionesCount} atenciones</span> y{' '}
          <span className="font-bold text-pink-900">{existingGastosCount} gastos</span> en la tabla actual. ¿Cómo deseas incorporar esta nueva información?
        </p>

        <div className="grid grid-cols-1 gap-3 mb-6">
          {/* Opción 1: Sumar / Agregar */}
          <button
            type="button"
            onClick={onAppend}
            className="flex items-start gap-3.5 p-4 rounded-2xl border-2 border-purple-200 hover:border-purple-600 hover:bg-purple-50/50 transition text-left cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 block group-hover:text-purple-900">
                Sumar y agregar a la lista actual
              </span>
              <span className="text-xs text-slate-500 block mt-0.5 leading-relaxed">
                Conserva los registros que ya tienes y añade las nuevas filas (ideal para páginas continuas o cuaderno de varios días).
              </span>
            </div>
          </button>

          {/* Opción 2: Reemplazar todo */}
          <button
            type="button"
            onClick={onReplace}
            className="flex items-start gap-3.5 p-4 rounded-2xl border-2 border-slate-200 hover:border-pink-600 hover:bg-pink-50/50 transition text-left cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 block group-hover:text-pink-900">
                Reemplazar todo (empezar desde cero)
              </span>
              <span className="text-xs text-slate-500 block mt-0.5 leading-relaxed">
                Sobrescribe la tabla anterior con los datos de esta nueva fotografía.
              </span>
            </div>
          </button>
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

