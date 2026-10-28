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

        {/* Pestañas en Morado y Rosa */}
        <div className="flex border-b border-purple-200/80 mb-6 gap-2 sm:gap-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('atenciones')}
            className={`flex items-center gap-2 pb-3.5 px-3 text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'atenciones'
                ? 'border-purple-700 text-purple-900'
                : 'border-transparent text-slate-500 hover:text-purple-700'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Atenciones y Pacientes</span>
            <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold ${
              activeTab === 'atenciones' ? 'bg-purple-100 text-purple-900 border border-purple-200' : 'bg-slate-100 text-slate-600'
            }`}>
              {atenciones.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('gastos')}
            className={`flex items-center gap-2 pb-3.5 px-3 text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'gastos'
                ? 'border-pink-600 text-pink-900'
                : 'border-transparent text-slate-500 hover:text-pink-600'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Gastos Diarios</span>
            <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold ${
              activeTab === 'gastos' ? 'bg-pink-100 text-pink-900 border border-pink-200' : 'bg-slate-100 text-slate-600'
            }`}>
              {gastos.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('cuadre')}
            className={`flex items-center gap-2 pb-3.5 px-3 text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'cuadre'
                ? 'border-fuchsia-700 text-fuchsia-900'
                : 'border-transparent text-slate-500 hover:text-fuchsia-700'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>Cuadre de Caja</span>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-purple-900 text-white font-bold">
              S/ {cuadre.saldoCajaEfectivo.toFixed(2)}
            </span>
          </button>
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
