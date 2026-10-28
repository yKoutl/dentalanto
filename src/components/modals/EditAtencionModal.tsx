import React, { useState, useEffect } from 'react';
import { AtencionItem } from '../../types';
import { X, Trash2, Check, User, Calendar, Receipt, Stethoscope, FileText } from 'lucide-react';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';

interface EditAtencionModalProps {
  isOpen: boolean;
  atencion: AtencionItem | null;
  onClose: () => void;
  onSave: (updated: AtencionItem) => void;
  onDelete: (id: string) => void;
}

export const EditAtencionModal: React.FC<EditAtencionModalProps> = ({
  isOpen,
  atencion,
  onClose,
  onSave,
  onDelete
}) => {
  const [formData, setFormData] = useState<AtencionItem | null>(null);
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
    if (atencion) {
      setFormData({ ...atencion });
    }
  }, [atencion]);

  if (!isOpen || !formData) return null;

  const handleChange = (field: keyof AtencionItem, value: any) => {
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: (field === 'efectivo' || field === 'banco' || field === 'montoDoctora') ? Number(value) || 0 : value
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
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-purple-100 max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Header Fijo */}
          <div className="flex items-center justify-between p-5 sm:p-6 pb-4 border-b border-purple-100 bg-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Detalle y Edición de Atención
                </h3>
                <p className="text-xs text-slate-500">
                  Modifica los datos del paciente, tratamiento, importes u observaciones
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
          <form id="atencion-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-purple-600" />
                  <span>Fecha</span>
                </label>
                <input
                  type="text"
                  value={formData.fecha}
                  onChange={(e) => handleChange('fecha', e.target.value)}
                  placeholder="21/10"
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 bg-slate-50/50 focus:bg-white text-slate-900 font-semibold text-sm focus:border-purple-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Receipt className="w-3.5 h-3.5 text-purple-600" />
                  <span>N° Boleta</span>
                </label>
                <input
                  type="text"
                  value={formData.boleta}
                  onChange={(e) => handleChange('boleta', e.target.value)}
                  placeholder="600"
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 bg-slate-50/50 focus:bg-white text-slate-900 font-semibold text-sm focus:border-purple-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5 text-purple-600" />
                  <span>Doctora Atiende</span>
                </label>
                <input
                  type="text"
                  value={formData.doctora}
                  onChange={(e) => handleChange('doctora', e.target.value)}
                  placeholder="Vanessa"
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 bg-slate-50/50 focus:bg-white text-purple-900 font-bold text-sm focus:border-purple-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-purple-600" />
                  <span>Paciente</span>
                </label>
                <input
                  type="text"
                  value={formData.paciente}
                  onChange={(e) => handleChange('paciente', e.target.value)}
                  placeholder="Nombre y apellidos"
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 bg-slate-50/50 focus:bg-white text-slate-900 font-bold text-sm focus:border-purple-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5 text-purple-600" />
                  <span>Tratamiento</span>
                </label>
                <input
                  type="text"
                  value={formData.tratamiento}
                  onChange={(e) => handleChange('tratamiento', e.target.value)}
                  placeholder="Ej. Control de ortodoncia, Extracción..."
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 bg-slate-50/50 focus:bg-white text-slate-900 font-medium text-sm focus:border-purple-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Pagos y Comisiones */}
            <div className="p-4 bg-purple-50/40 border border-purple-100 rounded-2xl space-y-3.5">
              <span className="text-[11px] font-extrabold text-purple-950 uppercase tracking-wider block">
                Detalle Financiero y Liquidación
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-purple-900 mb-1">
                    Efectivo (S/)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.efectivo === 0 ? '' : formData.efectivo}
                    onChange={(e) => handleChange('efectivo', e.target.value)}
                    placeholder="0.00"
                    className="w-full px-3 py-2 rounded-xl border border-purple-300 bg-white text-slate-900 font-extrabold text-sm focus:border-purple-600 focus:outline-none text-right"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-purple-900 mb-1">
                    Banco / Transferencia (S/)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.banco === 0 ? '' : formData.banco}
                    onChange={(e) => handleChange('banco', e.target.value)}
                    placeholder="0.00"
                    className="w-full px-3 py-2 rounded-xl border border-purple-300 bg-white text-slate-900 font-extrabold text-sm focus:border-purple-600 focus:outline-none text-right"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-purple-900 mb-1">
                    Medio de Pago
                  </label>
                  <input
                    type="text"
                    value={formData.bancoTipo}
                    onChange={(e) => handleChange('bancoTipo', e.target.value)}
                    placeholder="BCP, Interbank, Yape..."
                    className="w-full px-3 py-2 rounded-xl border border-purple-300 bg-white text-purple-900 font-bold text-sm focus:border-purple-600 focus:outline-none uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-purple-200/60">
                <div>
                  <label className="block text-[11px] font-bold text-purple-900 mb-1">
                    Doctora Asignada / Comisionista
                  </label>
                  <input
                    type="text"
                    value={formData.doctoraAsignada}
                    onChange={(e) => handleChange('doctoraAsignada', e.target.value)}
                    placeholder="Yoselyn, Elizabeth, etc."
                    className="w-full px-3 py-2 rounded-xl border border-purple-300 bg-white text-purple-900 font-bold text-sm focus:border-purple-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-purple-900 mb-1">
                    Monto Comisión Doctora (S/)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.montoDoctora === 0 ? '' : formData.montoDoctora}
                    onChange={(e) => handleChange('montoDoctora', e.target.value)}
                    placeholder="0.00"
                    className="w-full px-3 py-2 rounded-xl border border-purple-300 bg-white text-pink-700 font-extrabold text-sm focus:border-purple-600 focus:outline-none text-right"
                  />
                </div>
              </div>
            </div>

            {/* Observaciones */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-pink-600" />
                <span>Observaciones del Tratamiento</span>
              </label>
              <textarea
                rows={2}
                value={formData.observaciones}
                onChange={(e) => handleChange('observaciones', e.target.value)}
                placeholder="Anotaciones: cancela tratamiento, adelanto de endodoncia pieza 21, saldo pendiente..."
                className="w-full px-3 py-2 rounded-xl border border-pink-200 bg-slate-50/50 focus:bg-white text-slate-900 font-medium text-sm focus:border-pink-500 focus:outline-none"
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
              <span>Eliminar Atención</span>
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
                form="atencion-form"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-700 to-pink-600 hover:from-purple-800 hover:to-pink-700 text-white text-xs font-bold shadow-md shadow-purple-700/25 active:scale-95 transition cursor-pointer"
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
        title="¿Eliminar esta atención médica?"
        itemName={`Paciente: ${formData.paciente || 'Sin nombre'} (${formData.tratamiento || 'Sin tratamiento'})`}
      />
    </>
  );
};
