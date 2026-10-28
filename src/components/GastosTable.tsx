import React, { useState } from 'react';
import { GastoItem } from '../types';
import { Plus, Trash2, Search, Receipt, Edit3, X } from 'lucide-react';
import { EditGastoModal } from './modals/EditGastoModal';
import { ConfirmDeleteModal } from './modals/ConfirmDeleteModal';

interface GastosTableProps {
  gastos: GastoItem[];
  onChange: (items: GastoItem[]) => void;
  totalGastosDeclarado?: number;
}

export const GastosTable: React.FC<GastosTableProps> = ({
  gastos,
  onChange,
  totalGastosDeclarado
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGasto, setSelectedGasto] = useState<GastoItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Modal de confirmación para eliminar gasto
  const [itemToDelete, setItemToDelete] = useState<GastoItem | null>(null);

  const handleOpenEdit = (item: GastoItem) => {
    setSelectedGasto(item);
    setIsEditModalOpen(true);
  };

  const handleSaveModal = (updated: GastoItem) => {
    onChange(gastos.map((item) => (item.id === updated.id ? updated : item)));
  };

  const handleDeleteItem = (id: string) => {
    onChange(gastos.filter((item) => item.id !== id));
  };

  const handleAddRow = () => {
    const newItem: GastoItem = {
      id: `gst_${Date.now()}`,
      fecha: gastos.length > 0 ? gastos[gastos.length - 1].fecha : new Date().toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit' }),
      monto: 0,
      medio: 'Efectivo',
      observaciones: ''
    };
    onChange([...gastos, newItem]);
    handleOpenEdit(newItem);
  };

  const filteredItems = gastos.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      (item.observaciones || '').toLowerCase().includes(term) ||
      (item.medio || '').toLowerCase().includes(term) ||
      (item.fecha || '').toLowerCase().includes(term)
    );
  });

  const totalCalculado = gastos.reduce((acc, curr) => acc + (Number(curr.monto) || 0), 0);

  return (
    <div className="bg-white rounded-2xl border border-pink-100 shadow-xs overflow-hidden">
      {/* Header Bar Totalmente Adaptable */}
      <div className="p-4 sm:p-5 border-b border-pink-100 flex flex-col md:flex-row md:items-center justify-between gap-3.5 bg-gradient-to-r from-pink-50/70 to-purple-50/50">
        <div className="shrink-0">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-pink-700" />
              <span>Gastos y Egresos Diarios</span>
            </h3>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-900 border border-pink-200">
              {gastos.length} {gastos.length === 1 ? 'gasto' : 'gastos'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Haz clic en cualquier fila para modificar el gasto en modal
          </p>
        </div>

        {/* Buscador fluido y botón */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <div className="relative flex-1 md:w-72 lg:w-80">
            <Search className="w-4 h-4 text-pink-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar insumo, concepto, medio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-9 pr-8 py-2.5 rounded-xl border border-pink-200/90 bg-white shadow-xs focus:outline-none focus:border-pink-600 focus:ring-2 focus:ring-pink-200 transition-all text-slate-900 font-medium placeholder:text-slate-400"
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
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold shadow-sm shadow-pink-600/20 transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Nuevo Gasto</span>
            <span className="xs:hidden">Gasto</span>
          </button>
        </div>
      </div>

      {/* Indicador de filtro activo */}
      {searchTerm && (
        <div className="px-4 py-2 bg-pink-50/80 border-b border-pink-100 flex items-center justify-between text-xs text-pink-900 font-medium">
          <span>
            Resultados de búsqueda: <b>{filteredItems.length}</b> de {gastos.length} gastos
          </span>
          <button
            onClick={() => setSearchTerm('')}
            className="text-pink-700 hover:text-pink-950 font-bold underline cursor-pointer"
          >
            Limpiar filtro
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-pink-900 text-white font-bold tracking-wider text-[11px]">
              <th className="py-3 px-3 text-center w-12">#</th>
              <th className="py-3 px-3 w-28">Fecha</th>
              <th className="py-3 px-3 w-32">Medio</th>
              <th className="py-3 px-3 text-right w-36 bg-pink-950">Monto S/</th>
              <th className="py-3 px-4 min-w-[240px]">Observaciones / Detalle del Gasto</th>
              <th className="py-3 px-3 text-center w-16">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-pink-100">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-slate-400 font-medium">
                  No hay gastos registrados. Sube la foto del cuaderno o agrega un nuevo gasto.
                </td>
              </tr>
            ) : (
              filteredItems.map((item, index) => (
                <tr
                  key={item.id}
                  onClick={() => handleOpenEdit(item)}
                  className="hover:bg-pink-50/60 transition-colors group cursor-pointer"
                  title="Haz clic para editar en modal"
                >
                  <td className="py-2.5 px-3 text-center text-slate-400 font-medium">
                    {index + 1}
                  </td>
                  <td className="py-2 px-3 font-semibold text-black">
                    {item.fecha || '-'}
                  </td>
                  <td className="py-2 px-3 font-semibold text-black">
                    <span className="inline-block px-2 py-0.5 rounded-md bg-pink-50 text-pink-900 border border-pink-200 text-[11px] font-bold">
                      {item.medio || 'Efectivo'}
                    </span>
                  </td>
                  <td className="py-2 px-3 bg-pink-50/30 text-right text-pink-700 font-extrabold text-sm">
                    S/ {Number(item.monto).toFixed(2)}
                  </td>
                  <td className="py-2 px-4 text-black font-semibold">
                    {item.observaciones || '-'}
                  </td>
                  <td className="py-2 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 text-pink-600 hover:text-pink-800 hover:bg-pink-100 rounded-lg transition cursor-pointer"
                        title="Modificar en modal"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setItemToDelete(item)}
                        className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                        title="Eliminar gasto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {gastos.length > 0 && (
            <tfoot>
              <tr className="bg-pink-100/70 font-bold text-slate-900 border-t-2 border-pink-200">
                <td colSpan={3} className="py-3 px-4 text-right uppercase tracking-wider text-xs font-bold text-pink-950">
                  Total Gastos Calculado:
                </td>
                <td className="py-3 px-3 text-right text-pink-800 font-extrabold text-sm">
                  S/ {totalCalculado.toFixed(2)}
                </td>
                <td colSpan={2} className="py-3 px-4 text-xs text-slate-600 font-medium">
                  {totalGastosDeclarado && (
                    <span>
                      Total anotado en cuaderno (G&lt;): <b className="text-pink-900">S/ {totalGastosDeclarado.toFixed(2)}</b>
                    </span>
                  )}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* Modal de edición de gasto */}
      <EditGastoModal
        isOpen={isEditModalOpen}
        gasto={selectedGasto}
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
        title="¿Eliminar este gasto?"
        itemName={itemToDelete ? `Gasto: S/ ${itemToDelete.monto.toFixed(2)} (${itemToDelete.observaciones || 'Sin detalle'})` : undefined}
      />
    </div>
  );
};
