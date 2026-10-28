import React from 'react';
import { CuadreCaja, AtencionItem } from '../types';
import { Wallet, TrendingUp, TrendingDown, Users, AlertCircle, CheckCircle2 } from 'lucide-react';

interface CuadreCajaCardProps {
  cuadre: CuadreCaja;
  atenciones: AtencionItem[];
}

export const CuadreCajaCard: React.FC<CuadreCajaCardProps> = ({ cuadre, atenciones }) => {
  // Agrupar por doctoras
  const comisionesPorDoctora: { [doc: string]: number } = {};
  atenciones.forEach((item) => {
    if (item.doctoraAsignada && item.montoDoctora) {
      comisionesPorDoctora[item.doctoraAsignada] = (comisionesPorDoctora[item.doctoraAsignada] || 0) + item.montoDoctora;
    }
  });

  return (
    <div className="space-y-6">
      {/* Tarjetas KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Ingresos Efectivo */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Ingresos en Efectivo
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            S/ {cuadre.totalIngresosEfectivo.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            + S/ {cuadre.totalIngresosBanco.toFixed(2)} por Bancos / Yape
          </div>
        </div>

        {/* Total Gastos */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Gastos
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-rose-600">
            S/ {cuadre.totalGastos.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {cuadre.totalGastosDeclarado
              ? `Declarado en cuaderno: S/ ${cuadre.totalGastosDeclarado.toFixed(2)}`
              : 'Egresos e insumos dentales'}
          </div>
        </div>

        {/* Saldo Caja */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs bg-gradient-to-br from-white to-cyan-50/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-cyan-800 uppercase tracking-wider">
              Saldo Efectivo en Caja
            </span>
            <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-cyan-900">
            S/ {cuadre.saldoCajaEfectivo.toFixed(2)}
          </div>
          <div className="text-[11px] text-cyan-600 mt-1 font-medium">
            (Efectivo Cobrado - Gastos Realizados)
          </div>
        </div>

        {/* Comisiones Doctoras */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Liquidación Doctoras
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-purple-900">
            S/ {cuadre.totalComisionesDoctoras.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {Object.keys(comisionesPorDoctora).length} doctoras asignadas
          </div>
        </div>
      </div>

      {/* Desglose por Doctora */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
          <Users className="w-4 h-4 text-purple-600" />
          <span>Distribución y Liquidación por Doctora</span>
        </h4>
        {Object.keys(comisionesPorDoctora).length === 0 ? (
          <p className="text-xs text-slate-400">
            No se han asignado montos específicos por doctora en las atenciones.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(comisionesPorDoctora).map(([doc, monto]) => (
              <div key={doc} className="p-3 bg-purple-50/50 rounded-xl border border-purple-100">
                <span className="text-xs font-semibold text-purple-900 block truncate">
                  Dra. {doc}
                </span>
                <span className="text-base font-extrabold text-purple-700 mt-1 block">
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
