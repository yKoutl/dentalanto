import React, { useState, useMemo, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Login } from './components/Login';
import { UploadSection } from './components/UploadSection';
import { AtencionesTable } from './components/AtencionesTable';
import { GastosTable } from './components/GastosTable';
import { CuadreCajaCard } from './components/CuadreCajaCard';
import { AtencionItem, GastoItem, CuadreCaja } from './types';
import { scanDentalNotebookImage } from './services/geminiScanner';
import { exportToExcel, exportToPdf } from './services/exportService';
import { SAMPLE_ATENCIONES, SAMPLE_GASTOS } from './data/sampleData';
import { Users, Receipt, Wallet } from 'lucide-react';

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('chaski_dental_auth') === 'true';
  });

  const [atenciones, setAtenciones] = useState<AtencionItem[]>(SAMPLE_ATENCIONES);
  const [gastos, setGastos] = useState<GastoItem[]>(SAMPLE_GASTOS);
  const [totalGastosDeclarado, setTotalGastosDeclarado] = useState<number | undefined>(900);
  const [saldoCajaDeclarado, setSaldoCajaDeclarado] = useState<number | undefined>(201.1);
  const [activeTab, setActiveTab] = useState<'atenciones' | 'gastos' | 'cuadre'>('atenciones');

  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleLogout = () => {
    localStorage.removeItem('chaski_dental_auth');
    setIsAuthenticated(false);
  };

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
    setScanProgress('Leyendo registros del cuaderno...');

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
        setSuccessMessage(`Se digitalizaron ${result.atenciones.length} atenciones y ${result.gastos.length} gastos correctamente.`);
      } else {
        setErrorMessage('No se pudieron leer registros claros en la foto. Intenta con una toma más iluminada o cercana.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Error al procesar la fotografía.');
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
    setSuccessMessage('Archivo Excel (.xlsx) generado con nuestro estilo de diseño.');
  };

  const handleExportPdf = () => {
    exportToPdf(atenciones, gastos, cuadre);
    setSuccessMessage('Reporte PDF formal generado con éxito.');
  };

  // Si no ha iniciado sesión, mostrar pantalla de bloqueo / login
  if (!isAuthenticated) {
    return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50/80 flex flex-col">
      <Navbar
        onExportExcel={handleExportExcel}
        onExportPdf={handleExportPdf}
        onLogout={handleLogout}
        hasData={atenciones.length > 0 || gastos.length > 0}
        totalAtenciones={atenciones.length}
        totalGastos={gastos.length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Notificaciones */}
        {errorMessage && (
          <div className="mb-4 p-4 bg-rose-50 border border-rose-200 text-rose-900 rounded-xl text-sm flex items-center justify-between shadow-xs">
            <span className="font-medium">{errorMessage}</span>
            <button onClick={() => setErrorMessage(null)} className="font-bold ml-2 text-rose-700 hover:text-rose-900">×</button>
          </div>
        )}
        {successMessage && (
          <div className="mb-4 p-4 bg-purple-50 border border-purple-200 text-purple-900 rounded-xl text-sm flex items-center justify-between shadow-xs">
            <span className="font-medium">{successMessage}</span>
            <button onClick={() => setSuccessMessage(null)} className="font-bold ml-2 text-purple-700 hover:text-purple-900">×</button>
          </div>
        )}

        {/* Carga y Captura */}
        <UploadSection
          onScanImage={handleScanImage}
          isScanning={isScanning}
          scanProgress={scanProgress}
          onLoadSampleData={handleLoadSample}
        />

        {/* Navegación Segmentada Estilizada en Morado y Rosa */}
        <div className="flex items-center justify-start mb-6 overflow-x-auto pb-1">
          <div className="inline-flex p-1.5 bg-slate-200/60 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-inner gap-1.5">
            <button
              onClick={() => setActiveTab('atenciones')}
              className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                activeTab === 'atenciones'
                  ? 'bg-white text-purple-950 shadow-sm border border-purple-100 scale-[1.01]'
                  : 'text-slate-600 hover:text-purple-900 hover:bg-white/50'
              }`}
            >
              <div className={`p-1.5 rounded-lg transition-colors ${
                activeTab === 'atenciones' ? 'bg-purple-100 text-purple-700' : 'bg-slate-300/40 text-slate-500'
              }`}>
                <Users className="w-4 h-4" />
              </div>
              <span>Atenciones y Pacientes</span>
              <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full transition-colors ${
                activeTab === 'atenciones'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'bg-slate-300/70 text-slate-700'
              }`}>
                {atenciones.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('gastos')}
              className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                activeTab === 'gastos'
                  ? 'bg-white text-pink-950 shadow-sm border border-pink-100 scale-[1.01]'
                  : 'text-slate-600 hover:text-pink-900 hover:bg-white/50'
              }`}
            >
              <div className={`p-1.5 rounded-lg transition-colors ${
                activeTab === 'gastos' ? 'bg-pink-100 text-pink-700' : 'bg-slate-300/40 text-slate-500'
              }`}>
                <Receipt className="w-4 h-4" />
              </div>
              <span>Gastos Diarios</span>
              <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full transition-colors ${
                activeTab === 'gastos'
                  ? 'bg-pink-600 text-white shadow-xs'
                  : 'bg-slate-300/70 text-slate-700'
              }`}>
                {gastos.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('cuadre')}
              className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                activeTab === 'cuadre'
                  ? 'bg-white text-purple-950 shadow-sm border border-fuchsia-100 scale-[1.01]'
                  : 'text-slate-600 hover:text-purple-900 hover:bg-white/50'
              }`}
            >
              <div className={`p-1.5 rounded-lg transition-colors ${
                activeTab === 'cuadre' ? 'bg-fuchsia-100 text-fuchsia-700' : 'bg-slate-300/40 text-slate-500'
              }`}>
                <Wallet className="w-4 h-4" />
              </div>
              <span>Cuadre de Caja</span>
              <span className={`text-[11px] font-extrabold px-3 py-0.5 rounded-full transition-colors ${
                activeTab === 'cuadre'
                  ? 'bg-gradient-to-r from-purple-800 to-pink-700 text-white shadow-xs'
                  : 'bg-slate-300/70 text-slate-700'
              }`}>
                S/ {cuadre.saldoCajaEfectivo.toFixed(2)}
              </span>
            </button>
          </div>
        </div>

        {/* Vista activa */}
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
