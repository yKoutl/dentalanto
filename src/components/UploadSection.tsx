import React, { useRef, useState, useEffect } from 'react';
import { Upload, Camera, X, RefreshCw, AlertCircle, FileCheck, BookOpen, Layers } from 'lucide-react';

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
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [progressPercent, setProgressPercent] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Animación suave de la barra de progreso mientras escanea
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

  const startCamera = async () => {
    setCameraError(null);
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 } },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error('Error abriendo cámara:', err);
      setCameraError('No se pudo acceder a la cámara. Por favor verifica los permisos o sube una foto.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 1280;
    canvas.height = videoRef.current.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setSelectedImage(dataUrl);
    setMimeType('image/jpeg');
    stopCamera();
  };

  const handleStartScan = async () => {
    if (!selectedImage) return;
    await onScanImage(selectedImage, mimeType);
  };

  return (
    <div className="bg-white rounded-2xl border border-purple-100 shadow-xs p-4 sm:p-6 mb-6">
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
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer self-start sm:self-auto active:scale-95"
        >
          <FileCheck className="w-3.5 h-3.5 text-purple-600" />
          <span>Cargar Datos de Muestra (del Cuaderno)</span>
        </button>
      </div>

      {cameraError && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{cameraError}</span>
        </div>
      )}

      {/* Modo Cámara en Vivo */}
      {isCameraActive ? (
        <div className="relative rounded-2xl overflow-hidden bg-black max-w-xl mx-auto aspect-4/3 flex flex-col justify-between p-4 shadow-xl border-2 border-purple-400">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="relative z-10 flex justify-end">
            <button
              onClick={stopCamera}
              className="p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative z-10 flex justify-center pb-2">
            <button
              onClick={capturePhoto}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-lg hover:scale-105 active:scale-95 transition cursor-pointer"
            >
              <Camera className="w-5 h-5" />
              <span>Tomar Foto</span>
            </button>
          </div>
        </div>
      ) : (
        /* Selector o Preview */
        <div>
          {!selectedImage ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={startCamera}
                className="flex flex-col items-center justify-center p-7 bg-gradient-to-br from-purple-50 via-purple-100/60 to-fuchsia-50/50 border-2 border-dashed border-purple-300 hover:border-purple-600 hover:from-purple-100 hover:to-fuchsia-100/80 rounded-2xl transition-all duration-200 cursor-pointer group text-center shadow-xs hover:shadow-md hover:shadow-purple-600/10 active:scale-[0.99]"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-700 to-indigo-600 text-white flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-md shadow-purple-600/25">
                  <Camera className="w-6 h-6" />
                </div>
                <span className="text-sm font-bold text-purple-950">Tomar foto con la cámara</span>
                <span className="text-xs text-purple-700/80 font-medium mt-1">Cámara de tu celular o tablet</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center p-7 bg-gradient-to-br from-pink-50 via-pink-100/60 to-rose-50/50 border-2 border-dashed border-pink-300 hover:border-pink-600 hover:from-pink-100 hover:to-rose-100/80 rounded-2xl transition-all duration-200 cursor-pointer group text-center shadow-xs hover:shadow-md hover:shadow-pink-600/10 active:scale-[0.99]"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-500 text-white flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-md shadow-pink-600/25">
                  <Upload className="w-6 h-6" />
                </div>
                <span className="text-sm font-bold text-pink-950">Subir foto o escaneo</span>
                <span className="text-xs text-pink-700/80 font-medium mt-1">Archivos JPG, PNG o WEBP</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row items-center gap-5 bg-purple-50/40 border border-purple-100 rounded-2xl p-4">
                <div className="relative group shrink-0 w-full md:w-56 h-40 bg-slate-200 rounded-xl overflow-hidden border border-purple-200 flex items-center justify-center shadow-xs">
                  <img
                    src={selectedImage}
                    alt="Cuaderno capturado"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setSelectedImage(null)}
                    disabled={isScanning}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/70 hover:bg-rose-600 text-white transition cursor-pointer"
                    title="Cambiar foto"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 w-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                        Imagen cargada
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-700 mt-1.5 leading-relaxed">
                      El sistema transcribirá automáticamente las filas, columnas, doctoras, pacientes, montos y la columna de <b>Observaciones</b>.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mt-4">
                    <button
                      onClick={handleStartScan}
                      disabled={isScanning}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-700 to-pink-600 hover:from-purple-800 hover:to-pink-700 text-white text-sm font-bold shadow-md shadow-purple-700/25 active:scale-95 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
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
                      onClick={() => {
                        setSelectedImage(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      disabled={isScanning}
                      className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-purple-700 hover:bg-purple-100/50 rounded-xl transition cursor-pointer"
                    >
                      Elegir otra imagen
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

                  {/* Barra de progreso */}
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
      )}
    </div>
  );
};
