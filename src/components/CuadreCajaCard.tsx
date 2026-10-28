import React from 'react';
import { CuadreCaja, AtencionItem } from '../types';
import { Wallet, TrendingUp, TrendingDown, Users } from 'lucide-react';

interface CuadreCajaCardProps {
  cuadre: CuadreCaja;
  atenciones: AtencionItem[];
}

export const CuadreCajaCard: React.FC<CuadreCajaCardProps> = ({ cuadre, atenciones }) => {
  const comisionesPorDoctora: { [doc: string]: number } = {};
  atenciones.forEach((item) => {
    if (item.doctoraAsignada && item.montoDoctora) {
      comisionesPorDoctora[item.doctoraAsignada] = (comisionesPorDoctora[item.doctoraAsignada] || 0) + item.montoDoctora;
    }
  });

  return (
    <div className="space-y-6">
      {/* Tarjetas KPI en Rosas y Morados con alto contraste */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Ingresos */}
        <div className="bg-gradient-to-br from-white via-purple-50/40 to-purple-100/30 rounded-2xl border-2 border-purple-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-purple-900 uppercase tracking-wider">
              Total Ingresos
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-black">
            S/ {cuadre.totalIngresos.toFixed(2)}
          </div>
          <div className="text-xs text-purple-700 font-semibold mt-1.5 flex items-center gap-1.5">
            <span>Efectivo: S/ {cuadre.totalIngresosEfectivo.toFixed(2)}</span>
            <span>•</span>
            <span>Banco: S/ {cuadre.totalIngresosBanco.toFixed(2)}</span>
          </div>
        </div>

        {/* Total Gastos */}
        <div className="bg-gradient-to-br from-white via-pink-50/40 to-pink-100/30 rounded-2xl border-2 border-pink-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-pink-900 uppercase tracking-wider">
              Total Gastos
            </span>
            <div className="w-9 h-9 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-pink-700">
            S/ {cuadre.totalGastos.toFixed(2)}
          </div>
          <div className="text-xs text-pink-800 font-semibold mt-1.5">
            {cuadre.totalGastosDeclarado
              ? `Declarado en cuaderno (G<): S/ ${cuadre.totalGastosDeclarado.toFixed(2)}`
              : 'Egresos e insumos dentales'}
          </div>
        </div>

        {/* Saldo en Caja */}
        <div className="bg-gradient-to-br from-purple-900 to-indigo-950 text-white rounded-2xl border border-purple-800 p-5 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-purple-200 uppercase tracking-wider">
              Saldo Efectivo en Caja
            </span>
            <div className="w-9 h-9 rounded-xl bg-white/10 text-pink-300 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            S/ {cuadre.saldoCajaEfectivo.toFixed(2)}
          </div>
          <div className="text-xs text-purple-200 font-medium mt-1.5">
            (Efectivo Cobrado - Gastos Realizados)
          </div>
        </div>

        {/* Liquidación Doctoras */}
        <div className="bg-gradient-to-br from-white via-fuchsia-50/40 to-fuchsia-100/30 rounded-2xl border-2 border-fuchsia-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-fuchsia-900 uppercase tracking-wider">
              Liquidación Doctoras
            </span>
            <div className="w-9 h-9 rounded-xl bg-fuchsia-100 text-fuchsia-700 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-fuchsia-950">
            S/ {cuadre.totalComisionesDoctoras.toFixed(2)}
          </div>
          <div className="text-xs text-fuchsia-700 font-semibold mt-1.5">
            {Object.keys(comisionesPorDoctora).length} doctoras comisionistas
          </div>
        </div>
      </div>

      {/* Desglose por Doctora */}
      <div className="bg-white rounded-2xl border border-purple-100 p-5 sm:p-6 shadow-xs">
        <h4 className="text-sm font-bold text-slate-900 mb-3.5 flex items-center gap-2">
          <Users className="w-4 h-4 text-purple-700" />
          <span>Distribución y Liquidación por Doctora</span>
        </h4>
        {Object.keys(comisionesPorDoctora).length === 0 ? (
          <p className="text-xs text-slate-400">
            No se han asignado montos específicos por doctora en las atenciones.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(comisionesPorDoctora).map(([doc, monto]) => (
              <div key={doc} className="p-3.5 bg-gradient-to-br from-purple-50 to-pink-50/30 rounded-xl border border-purple-200">
                <span className="text-xs font-bold text-purple-900 block truncate">
                  Dra. {doc}
                </span>
                <span className="text-lg font-extrabold text-black mt-1 block">
                  S/ {monto.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
