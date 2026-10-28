import React, { useRef, useState, useEffect } from 'react';
import { Upload, Camera, X, RefreshCw, AlertCircle, FileCheck, BookOpen, RotateCcw } from 'lucide-react';

interface UploadSectionProps {
  onScanImage: (base64: string, mimeType: string) => Promise<void>;
  isScanning: boolean;
  scanProgress: string;
  onLoadSampleData: () => void;
}

export const UploadSection: React.FC<UploadSectionProps> = ({
  onScanImage,
  isScanning,
  scanProgress,
  onLoadSampleData
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [progressPercent, setProgressPercent] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Animación de la barra de progreso mientras escanea
  useEffect(() => {
    let interval: any = null;
    if (isScanning) {
      setProgressPercent(15);
      interval = setInterval(() => {
        setProgressPercent((prev) => {
          if (prev < 40) return prev + 8;
          if (prev < 75) return prev + 5;
          if (prev < 92) return prev + 2;
          return prev;
        });
      }, 300);
    } else {
      setProgressPercent(0);
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isScanning]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMimeType(file.type || 'image/jpeg');
    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleStartScan = async () => {
    if (!selectedImage) return;
    await onScanImage(selectedImage, mimeType);
  };

  const openNativeCamera = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.value = '';
      cameraInputRef.current.click();
    }
  };

  const openFilePicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-purple-100 shadow-xs p-4 sm:p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-700" />
            <span>Digitalizar Hoja de Cuaderno</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Toma una foto clara a la página de atenciones, a la de gastos o a ambas páginas abiertas
          </p>
        </div>

        <button
          onClick={onLoadSampleData}
          disabled={isScanning}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer self-start sm:self-auto active:scale-95"
        >
          <FileCheck className="w-3.5 h-3.5 text-purple-600" />
          <span>Cargar Datos de Muestra (del Cuaderno)</span>
        </button>
      </div>

      {/* Inputs nativos para cámara libre en pantalla completa y subida de archivos */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Botones de acción principales o Vista previa */}
      {!selectedImage ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Botón Cámara Libre (Abre la cámara nativa en pantalla completa con flash y zoom del celular) */}
          <button
            type="button"
            onClick={openNativeCamera}
            className="flex flex-row sm:flex-col items-center p-4 sm:p-7 bg-gradient-to-br from-purple-50 via-purple-100/60 to-fuchsia-50/50 border-2 border-dashed border-purple-300 hover:border-purple-600 hover:from-purple-100 hover:to-fuchsia-100/80 rounded-2xl transition-all duration-200 cursor-pointer group text-left sm:text-center shadow-xs hover:shadow-md hover:shadow-purple-600/10 active:scale-[0.98]"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-purple-700 to-indigo-600 text-white flex items-center justify-center shrink-0 mr-3.5 sm:mr-0 sm:mb-3 group-hover:scale-105 transition-transform shadow-md shadow-purple-600/25">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <span className="text-sm font-bold text-purple-950 block">Tomar foto con la cámara</span>
              <span className="text-xs text-purple-700/80 font-medium mt-0.5 block">
                Cámara en pantalla completa con enfoque y flash
              </span>
            </div>
          </button>

          {/* Botón Subir Archivo */}
          <button
            type="button"
            onClick={openFilePicker}
            className="flex flex-row sm:flex-col items-center p-4 sm:p-7 bg-gradient-to-br from-pink-50 via-pink-100/60 to-rose-50/50 border-2 border-dashed border-pink-300 hover:border-pink-600 hover:from-pink-100 hover:to-rose-100/80 rounded-2xl transition-all duration-200 cursor-pointer group text-left sm:text-center shadow-xs hover:shadow-md hover:shadow-pink-600/10 active:scale-[0.98]"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-500 text-white flex items-center justify-center shrink-0 mr-3.5 sm:mr-0 sm:mb-3 group-hover:scale-110 transition-transform shadow-md shadow-pink-600/25">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <span className="text-sm font-bold text-pink-950 block">Subir foto o escaneo</span>
              <span className="text-xs text-pink-700/80 font-medium mt-0.5 block">
                Seleccionar desde la galería o archivos
              </span>
            </div>
          </button>
        </div>
      ) : (
        /* Vista Previa de la Foto Capturada */
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 bg-purple-50/50 border border-purple-100 rounded-2xl p-4">
            <div className="relative group shrink-0 w-full sm:w-52 h-44 sm:h-36 bg-slate-900 rounded-xl overflow-hidden border border-purple-200 shadow-sm flex items-center justify-center">
              <img
                src={selectedImage}
                alt="Cuaderno capturado"
                className="w-full h-full object-contain bg-black/40"
              />
              <button
                onClick={() => setSelectedImage(null)}
                disabled={isScanning}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 hover:bg-rose-600 text-white transition cursor-pointer"
                title="Cambiar foto"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 w-full flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-900 border border-purple-200 inline-block">
                  Foto lista para digitalizar
                </span>
                <p className="text-xs sm:text-sm font-medium text-slate-700 mt-2 leading-relaxed">
                  El sistema transcribirá automáticamente las filas de atenciones, pacientes, montos, gastos y la columna de observaciones.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 mt-4">
                <button
                  onClick={handleStartScan}
                  disabled={isScanning}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-700 to-pink-600 hover:from-purple-800 hover:to-pink-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-purple-700/25 active:scale-95 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isScanning ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Procesando...</span>
                    </>
                  ) : (
                    <>
                      <BookOpen className="w-4 h-4" />
                      <span>Procesar y Digitalizar Cuaderno</span>
                    </>
                  )}
                </button>

                <button
                  onClick={openNativeCamera}
                  disabled={isScanning}
                  className="px-3.5 py-2 text-xs font-semibold text-purple-700 hover:bg-purple-100/70 border border-purple-200 rounded-xl transition cursor-pointer"
                >
                  Volver a tomar foto
                </button>
              </div>
            </div>
          </div>

          {/* Barra de Progreso Activa durante el Escaneo */}
          {isScanning && (
            <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-50 via-white to-pink-50 border-2 border-purple-200 rounded-2xl shadow-sm animate-in fade-in duration-300">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center animate-spin shrink-0">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-purple-950 uppercase tracking-wider block">
                      Digitalización en curso
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-slate-800">
                      {scanProgress || 'Transcribiendo escritura manuscrita del cuaderno...'}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-black text-purple-900 bg-purple-100 px-2.5 py-1 rounded-lg">
                  {progressPercent}%
                </span>
              </div>

              {/* Barra de progreso animada */}
              <div className="w-full h-3 bg-purple-100/70 rounded-full overflow-hidden p-0.5 border border-purple-200/80">
                <div
                  className="h-full bg-gradient-to-r from-purple-700 via-fuchsia-600 to-pink-500 rounded-full transition-all duration-300 shadow-xs"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 font-medium">
                <span>Reconociendo columnas y pacientes</span>
                <span>Consolidando gastos y caja</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
