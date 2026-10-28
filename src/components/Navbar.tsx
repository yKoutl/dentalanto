import React from 'react';
import { FileSpreadsheet, FileText, ClipboardList, LogOut, RotateCcw } from 'lucide-react';

interface NavbarProps {
  onExportExcel: () => void;
  onExportPdf: () => void;
  onClearData: () => void;
  onLogout: () => void;
  hasData: boolean;
  totalAtenciones: number;
  totalGastos: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onExportExcel,
  onExportPdf,
  onClearData,
  onLogout,
  hasData,
  totalAtenciones,
  totalGastos
}) => {
  return (
    <header className="bg-white border-b border-purple-100 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-700 via-fuchsia-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-purple-600/25">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                Chaski Dental <span className="text-purple-700 font-semibold text-sm">| Control Clínico y Caja</span>
              </h1>
            </div>
            <p className="text-xs text-slate-500">
              Digitalización y gestión de atenciones, pacientes y gastos diarios
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {hasData && (
            <div className="hidden sm:flex items-center gap-2 mr-1 text-xs text-purple-900 bg-purple-50/80 px-3 py-1.5 rounded-xl border border-purple-200">
              <span><b>{totalAtenciones}</b> atenciones</span>
              <span className="text-purple-300">•</span>
              <span><b>{totalGastos}</b> gastos</span>
            </div>
          )}

          <button
            onClick={onExportExcel}
            disabled={!hasData}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all shadow-xs ${
              hasData
                ? 'bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white shadow-purple-700/20 active:scale-95 cursor-pointer'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
            }`}
            title="Descargar en formato Excel (.xlsx)"
          >
            <FileSpreadsheet className="w-4 h-4 text-purple-200" />
            <span>Excel</span>
          </button>

          <button
            onClick={onExportPdf}
            disabled={!hasData}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all shadow-xs ${
              hasData
                ? 'bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-700 hover:to-pink-700 text-white shadow-pink-600/20 active:scale-95 cursor-pointer'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
            }`}
            title="Descargar en formato PDF formal"
          >
            <FileText className="w-4 h-4 text-pink-200" />
            <span>PDF</span>
          </button>

          {hasData && (
            <button
              onClick={onClearData}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-rose-700 bg-slate-100 hover:bg-rose-50 border border-slate-200/90 hover:border-rose-200 shadow-xs transition-all active:scale-95 cursor-pointer group"
              title="Vaciar tabla y empezar nueva jornada"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500 group-hover:text-rose-600 transition-colors" />
              <span>Empezar de cero</span>
            </button>
          )}

          <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

          <button
            onClick={onLogout}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
            title="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
