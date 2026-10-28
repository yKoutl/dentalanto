import React, { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { UploadSection } from './components/UploadSection';
import { AtencionesTable } from './components/AtencionesTable';
import { GastosTable } from './components/GastosTable';
import { CuadreCajaCard } from './components/CuadreCajaCard';
import { AtencionItem, GastoItem, CuadreCaja } from './types';
import { scanDentalNotebookImage } from './services/geminiScanner';
import { exportToExcel, exportToPdf } from './services/exportService';
import { SAMPLE_ATENCIONES, SAMPLE_GASTOS } from './data/sampleData';
import { Users, Receipt, Wallet, Sparkles } from 'lucide-react';

export function App() {
  const [atenciones, setAtenciones] = useState<AtencionItem[]>(SAMPLE_ATENCIONES);
  const [gastos, setGastos] = useState<GastoItem[]>(SAMPLE_GASTOS);
  const [totalGastosDeclarado, setTotalGastosDeclarado] = useState<number | undefined>(900);
  const [saldoCajaDeclarado, setSaldoCajaDeclarado] = useState<number | undefined>(201.1);
  const [activeTab, setActiveTab] = useState<'atenciones' | 'gastos' | 'cuadre'>('atenciones');

  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Cálculos reactivos de Caja
  const cuadre: CuadreCaja = useMemo(() => {
    const totalIngresosEfectivo = atenciones.reduce((acc, curr) => acc + (Number(curr.efectivo) || 0), 0);
    const totalIngresosBanco = atenciones.reduce((acc, curr) => acc + (Number(curr.banco) || 0), 0);
    const totalIngresos = totalIngresosEfectivo + totalIngresosBanco;
    const totalGastos = gastos.reduce((acc, curr) => acc + (Number(curr.monto) || 0), 0);
    const saldoCajaEfectivo = totalIngresosEfectivo - totalGastos;
    const totalComisionesDoctoras = atenciones.reduce((acc, curr) => acc + (Number(curr.montoDoctora) || 0), 0);

    return {
      totalIngresosEfectivo,
      totalIngresosBanco,
      totalIngresos,
      totalGastos,
      saldoCajaEfectivo,
      totalComisionesDoctoras,
      totalGastosDeclarado,
      saldoCajaDeclarado
    };
  }, [atenciones, gastos, totalGastosDeclarado, saldoCajaDeclarado]);

  const handleScanImage = async (base64: string, mimeType: string) => {
    setIsScanning(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    setScanProgress('Iniciando conexión con Gemini...');

    try {
      const result = await scanDentalNotebookImage(base64, mimeType, (msg) => {
        setScanProgress(msg);
      });

      if (result.atenciones.length > 0 || result.gastos.length > 0) {
        if (result.atenciones.length > 0) {
          setAtenciones(result.atenciones);
        }
        if (result.gastos.length > 0) {
          setGastos(result.gastos);
        }
        if (result.totalGastosDeclarado !== undefined) {
          setTotalGastosDeclarado(result.totalGastosDeclarado);
        }
        if (result.saldoCajaDeclarado !== undefined) {
          setSaldoCajaDeclarado(result.saldoCajaDeclarado);
        }
        setSuccessMessage(`¡Digitalización exitosa! Se extrajeron ${result.atenciones.length} atenciones y ${result.gastos.length} gastos.`);
      } else {
        setErrorMessage('La IA no pudo reconocer tablas en la imagen. Intenta con una toma más cercana e iluminada.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Error al procesar la foto con IA.');
    } finally {
      setIsScanning(false);
      setScanProgress('');
    }
  };

  const handleLoadSample = () => {
    setAtenciones(SAMPLE_ATENCIONES);
    setGastos(SAMPLE_GASTOS);
    setTotalGastosDeclarado(900);
    setSaldoCajaDeclarado(201.1);
    setSuccessMessage('Datos de muestra del cuaderno cargados.');
  };

  const handleExportExcel = () => {
    exportToExcel(atenciones, gastos, cuadre);
    setSuccessMessage('Archivo Excel (.xlsx) generado y descargado con éxito.');
  };

  const handleExportPdf = () => {
    exportToPdf(atenciones, gastos, cuadre);
    setSuccessMessage('Documento PDF generado y descargado con éxito.');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar
        onExportExcel={handleExportExcel}
        onExportPdf={handleExportPdf}
        hasData={atenciones.length > 0 || gastos.length > 0}
        totalAtenciones={atenciones.length}
        totalGastos={gastos.length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Notificaciones */}
        {errorMessage && (
          <div className="mb-4 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm flex items-center justify-between">
            <span>{errorMessage}</span>
            <button onClick={() => setErrorMessage(null)} className="font-bold ml-2">×</button>
          </div>
        )}
        {successMessage && (
          <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center justify-between">
            <span>{successMessage}</span>
            <button onClick={() => setSuccessMessage(null)} className="font-bold ml-2">×</button>
          </div>
        )}

        {/* Sección de Captura / Carga */}
        <UploadSection
          onScanImage={handleScanImage}
          isScanning={isScanning}
          scanProgress={scanProgress}
          onLoadSampleData={handleLoadSample}
        />

        {/* Navegación por Pestañas */}
        <div className="flex border-b border-slate-200 mb-6 gap-2 sm:gap-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('atenciones')}
            className={`flex items-center gap-2 pb-3 px-2 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'atenciones'
                ? 'border-cyan-600 text-cyan-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Atenciones y Pacientes</span>
            <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
              activeTab === 'atenciones' ? 'bg-cyan-100 text-cyan-800' : 'bg-slate-100 text-slate-600'
            }`}>
              {atenciones.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('gastos')}
            className={`flex items-center gap-2 pb-3 px-2 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'gastos'
                ? 'border-rose-600 text-rose-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Gastos Diarios</span>
            <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
              activeTab === 'gastos' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-600'
            }`}>
              {gastos.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('cuadre')}
            className={`flex items-center gap-2 pb-3 px-2 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'cuadre'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>Cuadre y Resumen de Caja</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
              S/ {cuadre.saldoCajaEfectivo.toFixed(2)}
            </span>
          </button>
        </div>

        {/* Contenido de la pestaña activa */}
        {activeTab === 'atenciones' && (
          <AtencionesTable atenciones={atenciones} onChange={setAtenciones} />
        )}

        {activeTab === 'gastos' && (
          <GastosTable
            gastos={gastos}
            onChange={setGastos}
            totalGastosDeclarado={totalGastosDeclarado}
          />
        )}

        {activeTab === 'cuadre' && (
          <CuadreCajaCard cuadre={cuadre} atenciones={atenciones} />
        )}
      </main>
    </div>
  );
}
export default App;
