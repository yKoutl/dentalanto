import { AtencionItem, GastoItem, ExtractionResponse } from '../types';

const PROJECT_ID = import.meta.env.VITE_FIREBASE_PROJECT_ID || '';
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

interface ModelAttempt {
  name: string;
  isPlatform: boolean;
}

const CANDIDATE_MODELS: ModelAttempt[] = [
  { name: 'gemini-3.5-flash-lite', isPlatform: true },
  { name: 'gemini-3.5-flash', isPlatform: true },
  { name: 'gemini-3.8-flash', isPlatform: true },
  { name: 'gemini-2.5-flash', isPlatform: true },
  { name: 'gemini-1.5-flash', isPlatform: false },
  { name: 'gemini-2.0-flash', isPlatform: false }
];

const PROMPT_DENTAL = `Eres un asistente experto en digitalización de cuadernos de registros contables y clínicos de clínicas dentales (odontología).
La imagen contiene una o dos páginas de un cuaderno manuscrito a cuadros con columnas hechas a mano:

1. PÁGINA IZQUIERDA (ATENCIONES / INGRESOS):
- Columnas:
  * FECHA: Día/mes (ej. 21/10, 22/10, etc.)
  * BOLETA: Número de boleta o recibo (ej. 600, 601, 602, etc.)
  * DOCTORA: Nombre de la doctora que atiende (ej. Vanessa, Yoselyn, Dania, etc.)
  * PACIENTE: Nombre y apellidos del paciente (ej. Angelly Torres, Cristina Bolivar, etc.)
  * TRATAMIENTO: Procedimiento realizado (ej. Control de orto, Limpieza, Extracción, Rx pza 46, Corona metal porcelana, Endodoncia, 2 curaciones, Reconstrucción, etc.)
  * EFECTIVO / MONTO: Monto pagado en efectivo para esa atención.
  * OBSERVACIONES: Notas adicionales del tratamiento (ej. "cancela tratamiento", "Adelanto endodoncia pza 21", "Rx + Extracción (110)", "Pendiente", número de piezas, etc.)

2. PÁGINA DERECHA (PAGOS, COMISIONES Y GASTOS):
- Columnas de Doctoras / Comisiones (ej. Dania, Vanessa, Yoselyn, Elizabeth) y Bancos (BCP, Interbank, Yape).
  * Si una atención tiene pago por banco o comisión a una doctora en esa misma fila, asígnalo:
    banco: monto
    bancoTipo: "BCP", "Interbank", "Yape", etc.
    doctoraAsignada: nombre de la doctora (ej. "Yoselyn", "Elizabeth")
    montoDoctora: monto que recibe la doctora
- SECCIÓN GASTOS (a la derecha de la página):
  * EFECTIVO / MONTO: Monto del gasto (ej. 30, 5.90, 247, 10, 120, 1.90, 5.80, 2.50, 50, etc.)
  * OBSERVACIONES: Detalle o concepto del gasto (ej. "Anillos", "Elásticos", "Papel Toalla", "Volanteo aduana", "Copias", "Técnico Jesús x2", "Limpiatipo", "Pos compra", etc.)
  * FECHA: Si se indica fecha específica del gasto.
- TOTALES DECLARADOS:
  * Si hay notas de cierre como "G < 900" (Total Gastos) o "CAJA 201.1" (Saldo Caja), extráelos en totalGastosDeclarado y saldoCajaDeclarado.

INSTRUCCIÓN DE SALIDA:
Responde ÚNICAMENTE con un JSON válido con esta estructura exacta:
{
  "atenciones": [
    {
      "fecha": "21/10",
      "boleta": "600",
      "doctora": "Vanessa",
      "paciente": "Angelly Torres",
      "tratamiento": "Control de orto",
      "efectivo": 100,
      "banco": 0,
      "bancoTipo": "",
      "doctoraAsignada": "Yoselyn",
      "montoDoctora": 100,
      "observaciones": ""
    }
  ],
  "gastos": [
    {
      "fecha": "21/10",
      "monto": 30,
      "medio": "Efectivo",
      "observaciones": "Anillos"
    }
  ],
  "totalGastosDeclarado": 900,
  "saldoCajaDeclarado": 201.1,
  "observacionesGenerales": ""
}`;

export async function scanDentalNotebookImage(
  base64Data: string,
  mimeType: string = 'image/jpeg',
  onProgress?: (msg: string) => void
): Promise<ExtractionResponse> {
  const cleanBase64 = base64Data.includes(',') ? base64Data.split(',')[1] : base64Data;
  let lastError: any = null;

  for (const model of CANDIDATE_MODELS) {
    onProgress?.(`Analizando cuaderno con ${model.name}...`);
    try {
      let url: string;
      if (model.isPlatform) {
        url = `https://aiplatform.googleapis.com/v1beta1/projects/${PROJECT_ID}/locations/global/publishers/google/models/${model.name}:generateContent?key=${encodeURIComponent(API_KEY)}`;
      } else {
        url = `https://generativelanguage.googleapis.com/v1beta/models/${model.name}:generateContent?key=${encodeURIComponent(API_KEY)}`;
      }

      const payload = {
        contents: [
          {
            role: 'user',
            parts: [
              { text: PROMPT_DENTAL },
              {
                inlineData: {
                  mimeType,
                  data: cleanBase64
                }
              }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.1,
          maxOutputTokens: 8192
        }
      };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error?.message || `Error HTTP ${res.status}`);
      }

      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        throw new Error('No se recibió texto de respuesta del modelo.');
      }

      const parsed = JSON.parse(text);

      // Add unique IDs
      const atenciones: AtencionItem[] = (parsed.atenciones || []).map((a: any, idx: number) => ({
        id: `atn_${Date.now()}_${idx}`,
        fecha: a.fecha || '',
        boleta: a.boleta || '',
        doctora: a.doctora || '',
        paciente: a.paciente || '',
        tratamiento: a.tratamiento || a.tratamientо || '',
        efectivo: Number(a.efectivo) || 0,
        banco: Number(a.banco) || 0,
        bancoTipo: a.bancoTipo || '',
        doctoraAsignada: a.doctoraAsignada || '',
        montoDoctora: Number(a.montoDoctora) || 0,
        observaciones: a.observaciones || ''
      }));

      const gastos: GastoItem[] = (parsed.gastos || []).map((g: any, idx: number) => ({
        id: `gst_${Date.now()}_${idx}`,
        fecha: g.fecha || '',
        monto: Number(g.monto) || 0,
        medio: g.medio || 'Efectivo',
        observaciones: g.observaciones || ''
      }));

      return {
        atenciones,
        gastos,
        totalGastosDeclarado: parsed.totalGastosDeclarado ? Number(parsed.totalGastosDeclarado) : undefined,
        saldoCajaDeclarado: parsed.saldoCajaDeclarado ? Number(parsed.saldoCajaDeclarado) : undefined,
        observacionesGenerales: parsed.observacionesGenerales || '',
        rawJson: text
      };
    } catch (err: any) {
      console.warn(`[${model.name}] error:`, err.message || err);
      lastError = err;
    }
  }

  throw new Error(`No se pudo procesar la imagen del cuaderno: ${lastError?.message || 'Error desconocido'}`);
}
