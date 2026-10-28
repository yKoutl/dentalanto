import React, { useState, useEffect } from 'react';
import { GastoItem } from '../../types';
import { X, Trash2, Check, Receipt, Calendar, DollarSign, FileText } from 'lucide-react';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';

interface EditGastoModalProps {
  isOpen: boolean;
  gasto: GastoItem | null;
  onClose: () => void;
  onSave: (updated: GastoItem) => void;
  onDelete: (id: string) => void;
}

export const EditGastoModal: React.FC<EditGastoModalProps> = ({
  isOpen,
  gasto,
  onClose,
  onSave,
  onDelete
}) => {
  const [formData, setFormData] = useState<GastoItem | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  // Bloquear scroll de la página de fondo cuando la modal está abierta para evitar doble scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (gasto) {
      setFormData({ ...gasto });
    }
  }, [gasto]);

  if (!isOpen || !formData) return null;

  const handleChange = (field: keyof GastoItem, value: any) => {
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: field === 'monto' ? Number(value) || 0 : value
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      onSave(formData);
      onClose();
    }
  };

  const handleDeleteConfirmed = () => {
    if (formData) {
      onDelete(formData.id);
      onClose();
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-5 bg-slate-950/65 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-pink-100 max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Header Fijo */}
          <div className="flex items-center justify-between p-5 sm:p-6 pb-4 border-b border-pink-100 bg-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center font-bold shrink-0">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Detalle y Edición de Gasto
                </h3>
                <p className="text-xs text-slate-500">
                  Modifica el concepto del insumo, medio de pago o monto
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Formulario con Scroll Interno Único */}
          <form id="gasto-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-pink-600" />
                  <span>Fecha</span>
                </label>
                <input
                  type="text"
                  value={formData.fecha}
                  onChange={(e) => handleChange('fecha', e.target.value)}
                  placeholder="21/10"
                  className="w-full px-3 py-2 rounded-xl border border-pink-200 bg-slate-50/50 focus:bg-white text-slate-900 font-semibold text-sm focus:border-pink-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Receipt className="w-3.5 h-3.5 text-pink-600" />
                  <span>Medio de Pago</span>
                </label>
                <select
                  value={formData.medio}
                  onChange={(e) => handleChange('medio', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-pink-200 bg-slate-50/50 focus:bg-white text-slate-900 font-semibold text-sm focus:border-pink-600 focus:outline-none cursor-pointer"
                >
                  <option value="Efectivo">Efectivo</option>
                  <option value="BCP">BCP</option>
                  <option value="Interbank">Interbank</option>
                  <option value="Yape">Yape</option>
                  <option value="Plin">Plin</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-pink-600" />
                <span>Monto del Gasto (S/)</span>
              </label>
              <input
                type="number"
                step="any"
                value={formData.monto === 0 ? '' : formData.monto}
                onChange={(e) => handleChange('monto', e.target.value)}
                placeholder="0.00"
                className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 bg-pink-50/30 focus:bg-white text-pink-700 font-extrabold text-base focus:border-pink-600 focus:outline-none text-right"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-pink-600" />
                <span>Observaciones / Detalle del Gasto</span>
              </label>
              <textarea
                rows={3}
                value={formData.observaciones}
                onChange={(e) => handleChange('observaciones', e.target.value)}
                placeholder="Ej. Anillos, Elásticos, Papel Toalla, Técnico Jesús x2, Volanteo aduana..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 bg-slate-50/50 focus:bg-white text-slate-900 font-semibold text-sm focus:border-pink-500 focus:outline-none"
              />
            </div>
          </form>

          {/* Footer Fijo y Siempre Visible */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-6 pt-3 border-t border-slate-100 bg-white shrink-0">
            <button
              type="button"
              onClick={() => setShowConfirmDelete(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Eliminar Gasto</span>
            </button>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="submit"
                form="gasto-form"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white text-xs font-bold shadow-md shadow-pink-600/25 active:scale-95 transition cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Guardar Cambios</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={handleDeleteConfirmed}
        title="¿Eliminar este gasto?"
        itemName={`Gasto: S/ ${formData.monto.toFixed(2)} — ${formData.observaciones || 'Sin detalle'}`}
      />
    </>
  );
};
