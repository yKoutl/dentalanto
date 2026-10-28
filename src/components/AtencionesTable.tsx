import React, { useState } from 'react';
import { AtencionItem } from '../types';
import { Plus, Trash2, Search } from 'lucide-react';

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
    <div className="bg-white rounded-2xl border border-purple-100 shadow-xs overflow-hidden">
      {/* Header Bar */}
      <div className="p-4 sm:p-5 border-b border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-purple-50/70 to-pink-50/50">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">
              🦷 Registro de Pacientes y Atenciones
            </h3>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-200">
              {atenciones.length} registros
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Página izquierda del cuaderno: Fecha, Boleta, Doctora, Paciente, Tratamiento, Pagos y Observaciones
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar paciente, boleta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs pl-8 pr-3 py-2 rounded-xl border border-purple-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 w-48 sm:w-56 text-slate-800"
            />
          </div>

          <button
            onClick={handleAddRow}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nueva Fila</span>
          </button>
        </div>
      </div>

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
              <th className="py-3 px-2 text-center w-10"></th>
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
                <tr key={item.id} className="hover:bg-purple-50/50 transition-colors group">
                  <td className="py-2 px-2 text-center text-slate-400 font-medium">
                    {index + 1}
                  </td>
                  <td className="py-1 px-1.5">
                    <input
                      type="text"
                      value={item.fecha}
                      onChange={(e) => handleCellChange(item.id, 'fecha', e.target.value)}
                      className="w-full px-1.5 py-1 rounded bg-transparent hover:bg-white focus:bg-white border border-transparent focus:border-purple-500 focus:outline-none text-black font-semibold"
                      placeholder="21/10"
                    />
                  </td>
                  <td className="py-1 px-1.5">
                    <input
                      type="text"
                      value={item.boleta}
                      onChange={(e) => handleCellChange(item.id, 'boleta', e.target.value)}
                      className="w-full px-1.5 py-1 rounded bg-transparent hover:bg-white focus:bg-white border border-transparent focus:border-purple-500 focus:outline-none text-black font-medium"
                      placeholder="600"
                    />
                  </td>
                  <td className="py-1 px-1.5">
                    <input
                      type="text"
                      value={item.doctora}
                      onChange={(e) => handleCellChange(item.id, 'doctora', e.target.value)}
                      className="w-full px-1.5 py-1 rounded bg-transparent hover:bg-white focus:bg-white border border-transparent focus:border-purple-500 focus:outline-none text-purple-900 font-bold"
                      placeholder="Vanessa"
                    />
                  </td>
                  <td className="py-1 px-1.5">
                    <input
                      type="text"
                      value={item.paciente}
                      onChange={(e) => handleCellChange(item.id, 'paciente', e.target.value)}
                      className="w-full px-1.5 py-1 rounded bg-transparent hover:bg-white focus:bg-white border border-transparent focus:border-purple-500 focus:outline-none text-black font-bold"
                      placeholder="Nombre del paciente"
                    />
                  </td>
                  <td className="py-1 px-1.5">
                    <input
                      type="text"
                      value={item.tratamiento}
                      onChange={(e) => handleCellChange(item.id, 'tratamiento', e.target.value)}
                      className="w-full px-1.5 py-1 rounded bg-transparent hover:bg-white focus:bg-white border border-transparent focus:border-purple-500 focus:outline-none text-black"
                      placeholder="Tratamiento realizado"
                    />
                  </td>
                  <td className="py-1 px-1.5 bg-purple-50/30">
                    <input
                      type="number"
                      step="any"
                      value={item.efectivo === 0 ? '' : item.efectivo}
                      onChange={(e) => handleCellChange(item.id, 'efectivo', e.target.value)}
                      className="w-full px-1.5 py-1 rounded text-right bg-transparent hover:bg-white focus:bg-white border border-transparent focus:border-purple-500 focus:outline-none text-black font-extrabold"
                      placeholder="0.00"
                    />
                  </td>
                  <td className="py-1 px-1.5 bg-fuchsia-50/30">
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        step="any"
                        value={item.banco === 0 ? '' : item.banco}
                        onChange={(e) => handleCellChange(item.id, 'banco', e.target.value)}
                        className="w-16 px-1 py-1 rounded text-right bg-transparent hover:bg-white focus:bg-white border border-transparent focus:border-purple-500 focus:outline-none text-black font-extrabold"
                        placeholder="0.00"
                      />
                      <input
                        type="text"
                        value={item.bancoTipo}
                        onChange={(e) => handleCellChange(item.id, 'bancoTipo', e.target.value)}
                        className="w-14 px-1 py-1 rounded bg-transparent hover:bg-white focus:bg-white border border-transparent focus:border-purple-500 focus:outline-none text-purple-700 font-bold uppercase text-[10px]"
                        placeholder="BCP/Yape"
                      />
                    </div>
                  </td>
                  <td className="py-1 px-1.5 bg-pink-50/20">
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={item.doctoraAsignada}
                        onChange={(e) => handleCellChange(item.id, 'doctoraAsignada', e.target.value)}
                        className="w-16 px-1 py-1 rounded bg-transparent hover:bg-white focus:bg-white border border-transparent focus:border-purple-500 focus:outline-none text-purple-900 font-semibold text-[11px]"
                        placeholder="Doctora"
                      />
                      <input
                        type="number"
                        step="any"
                        value={item.montoDoctora === 0 ? '' : item.montoDoctora}
                        onChange={(e) => handleCellChange(item.id, 'montoDoctora', e.target.value)}
                        className="w-12 px-1 py-1 rounded text-right bg-transparent hover:bg-white focus:bg-white border border-transparent focus:border-purple-500 focus:outline-none text-pink-700 font-bold"
                        placeholder="0"
                      />
                    </div>
                  </td>
                  <td className="py-1 px-2 bg-pink-50/40">
                    <input
                      type="text"
                      value={item.observaciones}
                      onChange={(e) => handleCellChange(item.id, 'observaciones', e.target.value)}
                      className="w-full px-2 py-1 rounded bg-transparent hover:bg-white focus:bg-white border border-transparent focus:border-pink-500 focus:outline-none text-black font-medium"
                      placeholder="Notas, cancelación, pieza..."
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
    </div>
  );
};
