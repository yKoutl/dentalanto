import React, { useState } from 'react';
import { AtencionItem } from '../types';
import { Plus, Trash2, Search, Edit3, X } from 'lucide-react';
import { EditAtencionModal } from './modals/EditAtencionModal';
import { ConfirmDeleteModal } from './modals/ConfirmDeleteModal';

interface AtencionesTableProps {
  atenciones: AtencionItem[];
  onChange: (items: AtencionItem[]) => void;
}

export const AtencionesTable: React.FC<AtencionesTableProps> = ({ atenciones, onChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAtencion, setSelectedAtencion] = useState<AtencionItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Modal de confirmación para eliminar fila
  const [itemToDelete, setItemToDelete] = useState<AtencionItem | null>(null);

  const handleOpenEdit = (item: AtencionItem) => {
    setSelectedAtencion(item);
    setIsEditModalOpen(true);
  };

  const handleSaveModal = (updated: AtencionItem) => {
    onChange(atenciones.map((item) => (item.id === updated.id ? updated : item)));
  };

  const handleDeleteItem = (id: string) => {
    onChange(atenciones.filter((item) => item.id !== id));
  };

  const handleAddRow = () => {
    const newItem: AtencionItem = {
      id: `atn_${Date.now()}`,
      fecha: atenciones.length > 0 ? atenciones[atenciones.length - 1].fecha : new Date().toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit' }),
      boleta: '',
      doctora: '',
      paciente: '',
      tratamiento: '',
      efectivo: 0,
      banco: 0,
      bancoTipo: '',
      doctoraAsignada: '',
      montoDoctora: 0,
      observaciones: ''
    };
    onChange([...atenciones, newItem]);
    handleOpenEdit(newItem);
  };

  const filteredItems = atenciones.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      (item.paciente || '').toLowerCase().includes(term) ||
      (item.doctora || '').toLowerCase().includes(term) ||
      (item.boleta || '').toLowerCase().includes(term) ||
      (item.tratamiento || '').toLowerCase().includes(term) ||
      (item.observaciones || '').toLowerCase().includes(term)
    );
  });

  const totalEfectivo = atenciones.reduce((acc, curr) => acc + (Number(curr.efectivo) || 0), 0);
  const totalBanco = atenciones.reduce((acc, curr) => acc + (Number(curr.banco) || 0), 0);
  const totalDoctoras = atenciones.reduce((acc, curr) => acc + (Number(curr.montoDoctora) || 0), 0);

  return (
    <div className="bg-white rounded-2xl border border-purple-100 shadow-xs overflow-hidden">
      {/* Header Bar Totalmente Adaptable */}
      <div className="p-4 sm:p-5 border-b border-purple-100 flex flex-col md:flex-row md:items-center justify-between gap-3.5 bg-gradient-to-r from-purple-50/70 to-pink-50/50">
        <div className="shrink-0">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Registro de Pacientes y Atenciones
            </h3>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-200">
              {atenciones.length} {atenciones.length === 1 ? 'registro' : 'registros'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Haz clic en cualquier fila para abrir el panel de edición cómodo
          </p>
        </div>

        {/* Buscador fluido y botón */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <div className="relative flex-1 md:w-72 lg:w-80">
            <Search className="w-4 h-4 text-purple-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar paciente, boleta, doctora..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-9 pr-8 py-2.5 rounded-xl border border-purple-200/90 bg-white shadow-xs focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200 transition-all text-slate-900 font-medium placeholder:text-slate-400"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                title="Limpiar búsqueda"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={handleAddRow}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-sm shadow-purple-700/20 transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nueva Fila</span>
          </button>
        </div>
      </div>

      {/* Indicador de filtro activo */}
      {searchTerm && (
        <div className="px-4 py-2 bg-purple-50/80 border-b border-purple-100 flex items-center justify-between text-xs text-purple-900 font-medium">
          <span>
            Resultados de búsqueda: <b>{filteredItems.length}</b> de {atenciones.length} atenciones
          </span>
          <button
            onClick={() => setSearchTerm('')}
            className="text-purple-700 hover:text-purple-950 font-bold underline cursor-pointer"
          >
            Limpiar filtro
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-purple-900 text-white font-bold tracking-wider text-[11px]">
              <th className="py-3 px-2.5 text-center w-10">#</th>
              <th className="py-3 px-2 w-16">Fecha</th>
              <th className="py-3 px-2 w-16">Boleta</th>
              <th className="py-3 px-2.5 w-24">Doctora</th>
              <th className="py-3 px-2.5 min-w-[140px]">Paciente</th>
              <th className="py-3 px-2.5 min-w-[170px]">Tratamiento</th>
              <th className="py-3 px-2.5 text-right w-24 bg-purple-950">Efectivo S/</th>
              <th className="py-3 px-2.5 text-right w-28 bg-purple-950/80">Banco S/ (Medio)</th>
              <th className="py-3 px-2.5 w-32 bg-purple-950/60">Doctora / Comisión</th>
              <th className="py-3 px-3 min-w-[180px] bg-pink-900">Observaciones</th>
              <th className="py-3 px-2 text-center w-16">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-100">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-10 text-center text-slate-400 font-medium">
                  No hay registros. Toma una foto al cuaderno o agrega una fila.
                </td>
              </tr>
            ) : (
              filteredItems.map((item, index) => (
                <tr
                  key={item.id}
                  onClick={() => handleOpenEdit(item)}
                  className="hover:bg-purple-50/60 transition-colors group cursor-pointer"
                  title="Haz clic para editar en modal"
                >
                  <td className="py-2.5 px-2 text-center text-slate-400 font-medium">
                    {index + 1}
                  </td>
                  <td className="py-2 px-1.5 font-semibold text-black">
                    {item.fecha || '-'}
                  </td>
                  <td className="py-2 px-1.5 font-medium text-black">
                    {item.boleta || '-'}
                  </td>
                  <td className="py-2 px-1.5 font-bold text-purple-900">
                    {item.doctora || '-'}
                  </td>
                  <td className="py-2 px-1.5 font-bold text-black">
                    {item.paciente || '-'}
                  </td>
                  <td className="py-2 px-1.5 text-slate-800 font-medium">
                    {item.tratamiento || '-'}
                  </td>
                  <td className="py-2 px-2.5 text-right bg-purple-50/30 text-black font-extrabold">
                    {item.efectivo ? `S/ ${Number(item.efectivo).toFixed(2)}` : '-'}
                  </td>
                  <td className="py-2 px-2.5 text-right bg-fuchsia-50/30 font-extrabold text-black">
                    {item.banco ? `S/ ${Number(item.banco).toFixed(2)} ${item.bancoTipo ? `(${item.bancoTipo})` : ''}` : '-'}
                  </td>
                  <td className="py-2 px-2 bg-pink-50/20 text-purple-950 font-semibold">
                    {item.doctoraAsignada ? (
                      <span>
                        {item.doctoraAsignada}: <b className="text-pink-700">S/ {item.montoDoctora}</b>
                      </span>
                    ) : '-'}
                  </td>
                  <td className="py-2 px-3 bg-pink-50/40 text-black font-medium">
                    {item.observaciones ? (
                      <span className="inline-block px-2 py-0.5 rounded-md bg-white border border-pink-200 text-pink-900 text-[11px] font-semibold">
                        {item.observaciones}
                      </span>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>
                  <td className="py-2 px-2 text-center" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 text-purple-600 hover:text-purple-800 hover:bg-purple-100 rounded-lg transition cursor-pointer"
                        title="Modificar en modal"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setItemToDelete(item)}
                        className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                        title="Eliminar registro"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {atenciones.length > 0 && (
            <tfoot>
              <tr className="bg-purple-100/70 font-bold text-slate-900 border-t-2 border-purple-200">
                <td colSpan={6} className="py-3 px-3 text-right uppercase tracking-wider text-xs font-bold text-purple-950">
                  Totales Atenciones:
                </td>
                <td className="py-3 px-2.5 text-right text-purple-950 font-extrabold text-sm">
                  S/ {totalEfectivo.toFixed(2)}
                </td>
                <td className="py-3 px-2.5 text-right text-fuchsia-950 font-extrabold text-sm">
                  S/ {totalBanco.toFixed(2)}
                </td>
                <td className="py-3 px-2.5 text-pink-900 font-extrabold">
                  S/ {totalDoctoras.toFixed(2)}
                </td>
                <td colSpan={2}></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* Modal de edición */}
      <EditAtencionModal
        isOpen={isEditModalOpen}
        atencion={selectedAtencion}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveModal}
        onDelete={handleDeleteItem}
      />

      {/* Modal de confirmación para eliminar desde la tabla */}
      <ConfirmDeleteModal
        isOpen={Boolean(itemToDelete)}
        onClose={() => setItemToDelete(null)}
        onConfirm={() => {
          if (itemToDelete) {
            handleDeleteItem(itemToDelete.id);
            setItemToDelete(null);
          }
        }}
        title="¿Eliminar atención médica?"
        itemName={itemToDelete ? `Paciente: ${itemToDelete.paciente || 'Sin nombre'} (${itemToDelete.tratamiento || 'Sin tratamiento'})` : undefined}
      />
    </div>
  );
};
