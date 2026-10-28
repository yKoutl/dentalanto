import React, { useState } from 'react';
import { AtencionItem } from '../types';
import { Plus, Trash2, Search, DollarSign } from 'lucide-react';

interface AtencionesTableProps {
  atenciones: AtencionItem[];
  onChange: (items: AtencionItem[]) => void;
}

export const AtencionesTable: React.FC<AtencionesTableProps> = ({ atenciones, onChange }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleCellChange = (id: string, field: keyof AtencionItem, value: any) => {
    const updated = atenciones.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          [field]: (field === 'efectivo' || field === 'banco' || field === 'montoDoctora') ? Number(value) || 0 : value
        };
      }
      return item;
    });
    onChange(updated);
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
  };

  const handleDeleteRow = (id: string) => {
    onChange(atenciones.filter((item) => item.id !== id));
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
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Header Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-800">
              🦷 Registro de Atenciones y Pacientes
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800">
              {atenciones.length} registros
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Página izquierda del cuaderno: Boleta, Doctora, Paciente, Tratamiento, Pagos y Observaciones
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar paciente, boleta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 w-44 sm:w-56"
            />
          </div>

          <button
            onClick={handleAddRow}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Fila</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <th className="py-2.5 px-2.5 text-center w-10">#</th>
              <th className="py-2.5 px-2 w-16">Fecha</th>
              <th className="py-2.5 px-2 w-16">Boleta</th>
              <th className="py-2.5 px-2.5 w-24">Doctora</th>
              <th className="py-2.5 px-2.5 min-w-[130px]">Paciente</th>
              <th className="py-2.5 px-2.5 min-w-[160px]">Tratamiento</th>
              <th className="py-2.5 px-2.5 text-right w-24 bg-emerald-50/50">Efectivo S/</th>
              <th className="py-2.5 px-2.5 text-right w-28 bg-blue-50/50">Banco S/ (Medio)</th>
              <th className="py-2.5 px-2.5 w-32 bg-purple-50/40">Doctora / Comisión</th>
              <th className="py-2.5 px-2.5 min-w-[150px] bg-amber-50/40">Observaciones</th>
              <th className="py-2.5 px-2 text-center w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-8 text-center text-slate-400">
                  No hay registros de atenciones. Sube una foto del cuaderno o agrega una fila.
                </td>
              </tr>
            ) : (
              filteredItems.map((item, index) => (
                <tr key={item.id} className="hover:bg-cyan-50/30 transition-colors group">
                  <td className="py-1.5 px-2 text-center text-slate-400 font-medium">
                    {index + 1}
                  </td>
                  <td className="py-1 px-1.5">
                    <input
                      type="text"
                      value={item.fecha}
                      onChange={(e) => handleCellChange(item.id, 'fecha', e.target.value)}
                      className="w-full px-1.5 py-1 rounded bg-transparent hover:bg-white focus:bg-white border border-transparent focus:border-cyan-400 focus:outline-none text-slate-800 font-medium"
                      placeholder="21/10"
                    />
                  </td>
                  <td className="py-1 px-1.5">
                    <input
                      type="text"
                      value={item.boleta}
                      onChange={(e) => handleCellChange(item.id, 'boleta', e.target.value)}
                      className="w-full px-1.5 py-1 rounded bg-transparent hover:bg-white focus:bg-white border border-transparent focus:border-cyan-400 focus:outline-none text-slate-700"
                      placeholder="600"
                    />
                  </td>
                  <td className="py-1 px-1.5">
                    <input
                      type="text"
                      value={item.doctora}
                      onChange={(e) => handleCellChange(item.id, 'doctora', e.target.value)}
                      className="w-full px-1.5 py-1 rounded bg-transparent hover:bg-white focus:bg-white border border-transparent focus:border-cyan-400 focus:outline-none text-slate-800 font-medium"
                      placeholder="Vanessa"
                    />
                  </td>
                  <td className="py-1 px-1.5">
                    <input
                      type="text"
                      value={item.paciente}
                      onChange={(e) => handleCellChange(item.id, 'paciente', e.target.value)}
                      className="w-full px-1.5 py-1 rounded bg-transparent hover:bg-white focus:bg-white border border-transparent focus:border-cyan-400 focus:outline-none text-slate-900 font-semibold"
                      placeholder="Nombre paciente"
                    />
                  </td>
                  <td className="py-1 px-1.5">
                    <input
                      type="text"
                      value={item.tratamiento}
                      onChange={(e) => handleCellChange(item.id, 'tratamiento', e.target.value)}
                      className="w-full px-1.5 py-1 rounded bg-transparent hover:bg-white focus:bg-white border border-transparent focus:border-cyan-400 focus:outline-none text-slate-700"
                      placeholder="Tratamiento realizado"
                    />
                  </td>
                  <td className="py-1 px-1.5 bg-emerald-50/20">
                    <input
                      type="number"
                      step="any"
                      value={item.efectivo === 0 ? '' : item.efectivo}
                      onChange={(e) => handleCellChange(item.id, 'efectivo', e.target.value)}
                      className="w-full px-1.5 py-1 rounded text-right bg-transparent hover:bg-white focus:bg-white border border-transparent focus:border-emerald-400 focus:outline-none text-emerald-700 font-bold"
                      placeholder="0.00"
                    />
                  </td>
                  <td className="py-1 px-1.5 bg-blue-50/20">
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        step="any"
                        value={item.banco === 0 ? '' : item.banco}
                        onChange={(e) => handleCellChange(item.id, 'banco', e.target.value)}
                        className="w-16 px-1 py-1 rounded text-right bg-transparent hover:bg-white focus:bg-white border border-transparent focus:border-blue-400 focus:outline-none text-blue-700 font-bold"
                        placeholder="0.00"
                      />
                      <input
                        type="text"
                        value={item.bancoTipo}
                        onChange={(e) => handleCellChange(item.id, 'bancoTipo', e.target.value)}
                        className="w-14 px-1 py-1 rounded bg-transparent hover:bg-white focus:bg-white border border-transparent focus:border-blue-400 focus:outline-none text-slate-600 uppercase text-[10px]"
                        placeholder="BCP/Yape"
                      />
                    </div>
                  </td>
                  <td className="py-1 px-1.5 bg-purple-50/20">
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={item.doctoraAsignada}
                        onChange={(e) => handleCellChange(item.id, 'doctoraAsignada', e.target.value)}
                        className="w-16 px-1 py-1 rounded bg-transparent hover:bg-white focus:bg-white border border-transparent focus:border-purple-400 focus:outline-none text-purple-800 text-[11px]"
                        placeholder="Doctora"
                      />
                      <input
                        type="number"
                        step="any"
                        value={item.montoDoctora === 0 ? '' : item.montoDoctora}
                        onChange={(e) => handleCellChange(item.id, 'montoDoctora', e.target.value)}
                        className="w-12 px-1 py-1 rounded text-right bg-transparent hover:bg-white focus:bg-white border border-transparent focus:border-purple-400 focus:outline-none text-purple-700 font-semibold"
                        placeholder="0"
                      />
                    </div>
                  </td>
                  <td className="py-1 px-1.5 bg-amber-50/20">
                    <input
                      type="text"
                      value={item.observaciones}
                      onChange={(e) => handleCellChange(item.id, 'observaciones', e.target.value)}
                      className="w-full px-1.5 py-1 rounded bg-transparent hover:bg-white focus:bg-white border border-transparent focus:border-amber-400 focus:outline-none text-amber-900"
                      placeholder="Notas, pieza dental, canceló..."
                    />
                  </td>
                  <td className="py-1 px-1 text-center">
                    <button
                      onClick={() => handleDeleteRow(item.id)}
                      className="p-1 text-slate-300 hover:text-rose-600 transition rounded hover:bg-rose-50 cursor-pointer"
                      title="Eliminar fila"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {atenciones.length > 0 && (
            <tfoot>
              <tr className="bg-slate-100 font-bold text-slate-800 border-t-2 border-slate-300">
                <td colSpan={6} className="py-3 px-3 text-right uppercase tracking-wider text-xs">
                  Totales Atenciones:
                </td>
                <td className="py-3 px-2.5 text-right text-emerald-700 font-extrabold text-sm bg-emerald-50/60">
                  S/ {totalEfectivo.toFixed(2)}
                </td>
                <td className="py-3 px-2.5 text-right text-blue-700 font-extrabold text-sm bg-blue-50/60">
                  S/ {totalBanco.toFixed(2)}
                </td>
                <td className="py-3 px-2.5 text-purple-700 font-bold bg-purple-50/60">
                  S/ {totalDoctoras.toFixed(2)}
                </td>
                <td colSpan={2}></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};
