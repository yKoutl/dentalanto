import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  itemName?: string;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = '¿Eliminar registro?',
  message = 'Esta acción eliminará el registro de la tabla y recalculará los totales.',
  itemName
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0 shadow-xs">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">
            {title}
          </h3>
          <p className="text-sm text-slate-500 mt-1 leading-relaxed">
            {message}
          </p>

          {itemName && (
            <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 break-words">
              {itemName}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/25 transition active:scale-95 cursor-pointer"
          >
            Sí, eliminar definitivamente
          </button>
        </div>
      </div>
    </div>
  );
};

