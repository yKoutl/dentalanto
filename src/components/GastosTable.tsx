import React, { useState } from 'react';
import { GastoItem } from '../types';
import { Plus, Trash2, Search, Receipt } from 'lucide-react';

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

  const handleCellChange = (id: string, field: keyof GastoItem, value: any) => {
    const updated = gastos.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          [field]: field === 'monto' ? Number(value) || 0 : value
        };
      }
      return item;
    });
    onChange(updated);
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
  };

  const handleDeleteRow = (id: string) => {
    onChange(gastos.filter((item) => item.id !== id));
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
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Header Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-rose-600" />
              <span>💸 Gastos y Egresos Diarios</span>
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
              {gastos.length} gastos
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Página derecha del cuaderno: Insumos dentales, papel toalla, volanteo, pagos a técnicos, etc.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar insumo, concepto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 w-44 sm:w-56"
            />
          </div>

          <button
            onClick={handleAddRow}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Gasto</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <th className="py-2.5 px-3 text-center w-12">#</th>
              <th className="py-2.5 px-3 w-24">Fecha</th>
              <th className="py-2.5 px-3 w-32">Medio</th>
              <th className="py-2.5 px-3 text-right w-36 bg-rose-50/50">Monto S/</th>
              <th className="py-2.5 px-4 min-w-[220px]">Observaciones / Detalle del Gasto</th>
              <th className="py-2.5 px-3 text-center w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  No hay gastos registrados. Sube la foto del cuaderno o agrega un nuevo gasto.
                </td>
              </tr>
            ) : (
              filteredItems.map((item, index) => (
                <tr key={item.id} className="hover:bg-rose-50/30 transition-colors group">
                  <td className="py-2 px-3 text-center text-slate-400 font-medium">
                    {index + 1}
                  </td>
                  <td className="py-1 px-2">
                    <input
                      type="text"
                      value={item.fecha}
                      onChange={(e) => handleCellChange(item.id, 'fecha', e.target.value)}
                      className="w-full px-2 py-1.5 rounded bg-transparent hover:bg-white focus:bg-white border border-transparent focus:border-rose-400 focus:outline-none text-slate-800 font-medium"
                      placeholder="21/10"
                    />
                  </td>
                  <td className="py-1 px-2">
                    <select
                      value={item.medio}
                      onChange={(e) => handleCellChange(item.id, 'medio', e.target.value)}
                      className="w-full px-2 py-1.5 rounded bg-transparent hover:bg-white focus:bg-white border border-transparent focus:border-rose-400 focus:outline-none text-slate-700 font-medium cursor-pointer"
                    >
                      <option value="Efectivo">Efectivo</option>
                      <option value="BCP">BCP</option>
                      <option value="Interbank">Interbank</option>
                      <option value="Yape">Yape</option>
                      <option value="Plin">Plin</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </td>
                  <td className="py-1 px-2 bg-rose-50/20">
                    <input
                      type="number"
                      step="any"
                      value={item.monto === 0 ? '' : item.monto}
                      onChange={(e) => handleCellChange(item.id, 'monto', e.target.value)}
                      className="w-full px-2 py-1.5 rounded text-right bg-transparent hover:bg-white focus:bg-white border border-transparent focus:border-rose-400 focus:outline-none text-rose-700 font-bold"
                      placeholder="0.00"
                    />
                  </td>
                  <td className="py-1 px-3">
                    <input
                      type="text"
                      value={item.observaciones}
                      onChange={(e) => handleCellChange(item.id, 'observaciones', e.target.value)}
                      className="w-full px-2 py-1.5 rounded bg-transparent hover:bg-white focus:bg-white border border-transparent focus:border-rose-400 focus:outline-none text-slate-900 font-medium"
                      placeholder="Ej. Papel toalla, Técnico Jesús x2, Anillos, Volanteo..."
                    />
                  </td>
                  <td className="py-1 px-2 text-center">
                    <button
                      onClick={() => handleDeleteRow(item.id)}
                      className="p-1 text-slate-300 hover:text-rose-600 transition rounded hover:bg-rose-50 cursor-pointer"
                      title="Eliminar gasto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {gastos.length > 0 && (
            <tfoot>
              <tr className="bg-slate-100 font-bold text-slate-800 border-t-2 border-slate-300">
                <td colSpan={3} className="py-3 px-4 text-right uppercase tracking-wider text-xs">
                  Total Gastos Calculado:
                </td>
                <td className="py-3 px-3 text-right text-rose-700 font-extrabold text-sm bg-rose-50/60">
                  S/ {totalCalculado.toFixed(2)}
                </td>
                <td colSpan={2} className="py-3 px-4 text-xs text-slate-500">
                  {totalGastosDeclarado && (
                    <span>
                      Total anotado en cuaderno (G&lt;): <b>S/ {totalGastosDeclarado.toFixed(2)}</b>
                    </span>
                  )}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};
