export interface AtencionItem {
  id: string;
  fecha: string;
  boleta: string;
  doctora: string;
  paciente: string;
  tratamientо?: string; // fallback
  tratamiento: string;
  efectivo: number;
  banco: number;
  bancoTipo: string;
  doctoraAsignada: string;
  montoDoctora: number;
  observaciones: string;
}

export interface GastoItem {
  id: string;
  fecha: string;
  monto: number;
  medio: string;
  observaciones: string;
}

export interface CuadreCaja {
  totalIngresosEfectivo: number;
  totalIngresosBanco: number;
  totalIngresos: number;
  totalGastos: number;
  saldoCajaEfectivo: number;
  totalComisionesDoctoras: number;
  totalGastosDeclarado?: number;
  saldoCajaDeclarado?: number;
}

export interface ExtractionResponse {
  atenciones: AtencionItem[];
  gastos: GastoItem[];
  totalGastosDeclarado?: number;
  saldoCajaDeclarado?: number;
  observacionesGenerales?: string;
  rawJson?: string;
}
