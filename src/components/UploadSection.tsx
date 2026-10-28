import React, { useRef, useState, useEffect } from 'react';
import { Upload, Camera, Image as ImageIcon, Sparkles, X, RefreshCw, AlertCircle } from 'lucide-react';

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

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Detener la cámara cuando se desmonte o desactive
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

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
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 md:p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Camera className="w-5 h-5 text-cyan-600" />
            Capturar o Subir Foto del Cuaderno
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Puedes tomar foto de la página izquierda (atenciones), la derecha (gastos/bancos) o ambas abiertas
          </p>
        </div>

        <button
          onClick={onLoadSampleData}
          disabled={isScanning}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-cyan-700 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200/80 px-3 py-1.5 rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Cargar Datos de Ejemplo (de la foto del cuaderno)
        </button>
      </div>

      {cameraError && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{cameraError}</span>
        </div>
      )}

      {/* Modo Cámara en Vivo */}
      {isCameraActive ? (
        <div className="relative rounded-xl overflow-hidden bg-black max-w-xl mx-auto aspect-4/3 flex flex-col justify-between p-4 shadow-inner">
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
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-slate-900 font-bold shadow-lg hover:scale-105 active:scale-95 transition cursor-pointer"
            >
              <Camera className="w-5 h-5 text-cyan-600" />
              Tomar Foto
            </button>
          </div>
        </div>
      ) : (
        /* Selector de imagen / Vista previa */
        <div>
          {!selectedImage ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={startCamera}
                className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 hover:border-cyan-500 hover:bg-cyan-50/40 rounded-xl transition cursor-pointer group text-center"
              >
                <div className="w-12 h-12 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center mb-2.5 group-hover:scale-110 transition">
                  <Camera className="w-6 h-6" />
                </div>
                <span className="text-sm font-semibold text-slate-700">Tomar foto con la cámara</span>
                <span className="text-xs text-slate-400 mt-0.5">Usa la cámara de tu celular o webcam</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/40 rounded-xl transition cursor-pointer group text-center"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2.5 group-hover:scale-110 transition">
                  <Upload className="w-6 h-6" />
                </div>
                <span className="text-sm font-semibold text-slate-700">Subir foto o escaneo</span>
                <span className="text-xs text-slate-400 mt-0.5">JPG, PNG o WEBP desde tus archivos</span>
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
            <div className="flex flex-col md:flex-row items-center gap-5 bg-slate-50 border border-slate-200/80 rounded-xl p-4">
              <div className="relative group shrink-0 w-full md:w-56 h-40 bg-slate-200 rounded-lg overflow-hidden border border-slate-300 flex items-center justify-center">
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
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                      Foto lista para procesar
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-700 mt-1.5">
                    Gemini Multimodal extraerá automáticamente las filas, columnas, doctoras, pacientes, montos y la columna <b>Observaciones</b>.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-4">
                  <button
                    onClick={handleStartScan}
                    disabled={isScanning}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold shadow-md shadow-cyan-600/20 active:scale-95 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isScanning ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>{scanProgress || 'Procesando manuscrito...'}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Escanear y Extraer con IA</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setSelectedImage(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    disabled={isScanning}
                    className="px-3 py-2 text-xs text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition cursor-pointer"
                  >
                    Elegir otra imagen
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
