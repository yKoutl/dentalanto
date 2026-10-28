import React from 'react';
import { Sparkles, FileSpreadsheet, FileText, Camera } from 'lucide-react';

interface NavbarProps {
  onExportExcel: () => void;
  onExportPdf: () => void;
  hasData: boolean;
  totalAtenciones: number;
  totalGastos: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onExportExcel,
  onExportPdf,
  hasData,
  totalAtenciones,
  totalGastos
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-cyan-600/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                Chaski Dental <span className="text-cyan-600 font-semibold text-sm">| Cuaderno Digital</span>
              </h1>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200">
                IA Multimodal
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Digitalización inteligente de cuadernos odontológicos a Excel y PDF
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {hasData && (
            <div className="hidden md:flex items-center gap-2 mr-2 text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              <span><b>{totalAtenciones}</b> atenciones</span>
              <span className="text-slate-300">•</span>
              <span><b>{totalGastos}</b> gastos</span>
            </div>
          )}

          <button
            onClick={onExportExcel}
            disabled={!hasData}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all shadow-xs ${
              hasData
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 active:scale-95 cursor-pointer'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
            }`}
            title="Descargar en formato Excel (.xlsx)"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Exportar Excel</span>
          </button>

          <button
            onClick={onExportPdf}
            disabled={!hasData}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all shadow-xs ${
              hasData
                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20 active:scale-95 cursor-pointer'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
            }`}
            title="Descargar en formato PDF formal"
          >
            <FileText className="w-4 h-4" />
            <span>Exportar PDF</span>
          </button>
        </div>
      </div>
    </header>
  );
};
