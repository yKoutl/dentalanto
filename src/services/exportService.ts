import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AtencionItem, GastoItem, CuadreCaja } from '../types';

export function exportToExcel(
  atenciones: AtencionItem[],
  gastos: GastoItem[],
  cuadre: CuadreCaja,
  fechaReporte: string = new Date().toLocaleDateString('es-PE')
) {
  const wb = XLSX.utils.book_new();

  // 1. Hoja ATENCIONES
  const atencionesData = atenciones.map((a, idx) => ({
    'N°': idx + 1,
    'FECHA': a.fecha,
    'BOLETA': a.boleta,
    'DOCTORA': a.doctora,
    'PACIENTE': a.paciente,
    'TRATAMIENTO': a.tratamiento,
    'EFECTIVO (S/)': Number(a.efectivo) || 0,
    'BANCO (S/)': Number(a.banco) || 0,
    'MEDIO BANCO': a.bancoTipo,
    'DOCTORA ASIGNADA': a.doctoraAsignada,
    'MONTO DOCTORA (S/)': Number(a.montoDoctora) || 0,
    'OBSERVACIONES': a.observaciones
  }));

  // Fila Total
  atencionesData.push({
    'N°': '',
    'FECHA': '',
    'BOLETA': '',
    'DOCTORA': '',
    'PACIENTE': 'TOTALES',
    'TRATAMIENTO': '',
    'EFECTIVO (S/)': cuadre.totalIngresosEfectivo,
    'BANCO (S/)': cuadre.totalIngresosBanco,
    'MEDIO BANCO': '',
    'DOCTORA ASIGNADA': '',
    'MONTO DOCTORA (S/)': cuadre.totalComisionesDoctoras,
    'OBSERVACIONES': ''
  } as any);

  const wsAtenciones = XLSX.utils.json_to_sheet(atencionesData);
  XLSX.utils.book_append_sheet(wb, wsAtenciones, 'Atenciones e Ingresos');

  // 2. Hoja GASTOS
  const gastosData = gastos.map((g, idx) => ({
    'N°': idx + 1,
    'FECHA': g.fecha,
    'MEDIO': g.medio,
    'MONTO (S/)': Number(g.monto) || 0,
    'OBSERVACIONES / CONCEPTO': g.observaciones
  }));

  // Fila Total Gastos
  gastosData.push({
    'N°': '',
    'FECHA': '',
    'MEDIO': 'TOTAL GASTOS',
    'MONTO (S/)': cuadre.totalGastos,
    'OBSERVACIONES / CONCEPTO': ''
  } as any);

  const wsGastos = XLSX.utils.json_to_sheet(gastosData);
  XLSX.utils.book_append_sheet(wb, wsGastos, 'Gastos');

  // 3. Hoja RESUMEN Y CUADRE
  const resumenData = [
    { 'CONCEPTO': 'Total Atenciones en Efectivo', 'MONTO (S/)': cuadre.totalIngresosEfectivo },
    { 'CONCEPTO': 'Total Pagos por Bancos/Transferencias', 'MONTO (S/)': cuadre.totalIngresosBanco },
    { 'CONCEPTO': 'TOTAL INGRESOS DEL PERIODO', 'MONTO (S/)': cuadre.totalIngresos },
    { 'CONCEPTO': 'TOTAL GASTOS REALIZADOS', 'MONTO (S/)': cuadre.totalGastos },
    { 'CONCEPTO': 'SALDO NETO EN CAJA (Efectivo - Gastos)', 'MONTO (S/)': cuadre.saldoCajaEfectivo },
    { 'CONCEPTO': 'Total Liquidado / Comisiones Doctoras', 'MONTO (S/)': cuadre.totalComisionesDoctoras }
  ];

  if (cuadre.totalGastosDeclarado !== undefined) {
    resumenData.push({ 'CONCEPTO': 'Total Gastos Escrito en Cuaderno (G<)', 'MONTO (S/)': cuadre.totalGastosDeclarado });
  }
  if (cuadre.saldoCajaDeclarado !== undefined) {
    resumenData.push({ 'CONCEPTO': 'Saldo Caja Escrito en Cuaderno (CAJA)', 'MONTO (S/)': cuadre.saldoCajaDeclarado });
  }

  const wsResumen = XLSX.utils.json_to_sheet(resumenData);
  XLSX.utils.book_append_sheet(wb, wsResumen, 'Cuadre de Caja');

  const cleanDate = fechaReporte.replace(/[\/\\]/g, '-');
  XLSX.writeFile(wb, `Cuaderno_Dental_${cleanDate}.xlsx`);
}

export function exportToPdf(
  atenciones: AtencionItem[],
  gastos: GastoItem[],
  cuadre: CuadreCaja,
  fechaReporte: string = new Date().toLocaleDateString('es-PE')
) {
  const doc = new jsPDF('landscape', 'pt', 'a4');

  // Encabezado
  doc.setFillColor(14, 116, 144); // Cyan oscuro
  doc.rect(0, 0, 842, 50, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('CLÍNICA DENTAL - REGISTRO DIARIO DE ATENCIONES Y CAJA', 30, 32);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Fecha del reporte: ${fechaReporte}`, 670, 32);

  // Tarjetas Resumen Superior
  let currentY = 70;
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);

  // Card 1: Ingresos
  doc.roundedRect(30, currentY, 175, 45, 4, 4, 'FD');
  doc.setTextColor(71, 85, 105);
  doc.setFontSize(9);
  doc.text('TOTAL INGRESOS', 40, currentY + 16);
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(`S/ ${cuadre.totalIngresos.toFixed(2)}`, 40, currentY + 36);

  // Card 2: Gastos
  doc.roundedRect(220, currentY, 175, 45, 4, 4, 'FD');
  doc.setTextColor(71, 85, 105);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('TOTAL GASTOS', 230, currentY + 16);
  doc.setTextColor(225, 29, 72);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(`S/ ${cuadre.totalGastos.toFixed(2)}`, 230, currentY + 36);

  // Card 3: Saldo Caja
  doc.roundedRect(410, currentY, 175, 45, 4, 4, 'FD');
  doc.setTextColor(71, 85, 105);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('SALDO EN CAJA (EFECTIVO)', 420, currentY + 16);
  doc.setTextColor(16, 185, 129);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(`S/ ${cuadre.saldoCajaEfectivo.toFixed(2)}`, 420, currentY + 36);

  // Card 4: Comisiones Doctoras
  doc.roundedRect(600, currentY, 210, 45, 4, 4, 'FD');
  doc.setTextColor(71, 85, 105);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('LIQUIDACIÓN / COMISIONES DOCTORAS', 610, currentY + 16);
  doc.setTextColor(99, 102, 241);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(`S/ ${cuadre.totalComisionesDoctoras.toFixed(2)}`, 610, currentY + 36);

  currentY += 60;

  // Tabla Atenciones
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('1. Registro de Pacientes y Atenciones Clínicas', 30, currentY);

  const atencionesRows = atenciones.map((a, i) => [
    (i + 1).toString(),
    a.fecha || '-',
    a.boleta || '-',
    a.doctora || '-',
    a.paciente || '-',
    a.tratamiento || '-',
    a.efectivo ? `S/ ${a.efectivo.toFixed(2)}` : '-',
    a.banco ? `S/ ${a.banco.toFixed(2)} (${a.bancoTipo})` : '-',
    a.doctoraAsignada ? `${a.doctoraAsignada}: S/ ${a.montoDoctora}` : '-',
    a.observaciones || '-'
  ]);

  // Fila Total
  atencionesRows.push([
    '',
    '',
    '',
    '',
    'TOTAL',
    '',
    `S/ ${cuadre.totalIngresosEfectivo.toFixed(2)}`,
    `S/ ${cuadre.totalIngresosBanco.toFixed(2)}`,
    `S/ ${cuadre.totalComisionesDoctoras.toFixed(2)}`,
    ''
  ]);

  autoTable(doc, {
    startY: currentY + 8,
    head: [['#', 'Fecha', 'Bol.', 'Doctora', 'Paciente', 'Tratamiento', 'Efectivo', 'Banco', 'Doctora Asig.', 'Observaciones']],
    body: atencionesRows,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 3,
      valign: 'middle'
    },
    headStyles: {
      fillColor: [14, 116, 144],
      textColor: 255,
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 38 },
      2: { cellWidth: 35 },
      3: { cellWidth: 60 },
      4: { cellWidth: 110 },
      5: { cellWidth: 140 },
      6: { cellWidth: 55, halign: 'right' },
      7: { cellWidth: 65, halign: 'right' },
      8: { cellWidth: 80 },
      9: { cellWidth: 'auto' }
    },
    margin: { left: 30, right: 30 }
  });

  const finalY = (doc as any).lastAutoTable.finalY + 25;

  // Tabla Gastos
  if (finalY > 480) {
    doc.addPage();
    currentY = 40;
  } else {
    currentY = finalY;
  }

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('2. Gastos y Egresos del Día', 30, currentY);

  const gastosRows = gastos.map((g, i) => [
    (i + 1).toString(),
    g.fecha || '-',
    g.medio || 'Efectivo',
    `S/ ${g.monto.toFixed(2)}`,
    g.observaciones || '-'
  ]);

  gastosRows.push([
    '',
    '',
    'TOTAL GASTOS',
    `S/ ${cuadre.totalGastos.toFixed(2)}`,
    ''
  ]);

  autoTable(doc, {
    startY: currentY + 8,
    head: [['#', 'Fecha', 'Medio', 'Monto', 'Observaciones / Detalle del Gasto']],
    body: gastosRows,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 3
    },
    headStyles: {
      fillColor: [225, 29, 72],
      textColor: 255,
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 50 },
      2: { cellWidth: 70 },
      3: { cellWidth: 70, halign: 'right' },
      4: { cellWidth: 'auto' }
    },
    margin: { left: 30, right: 30 }
  });

  const cleanDate = fechaReporte.replace(/[\/\\]/g, '-');
  doc.save(`Cuaderno_Dental_${cleanDate}.pdf`);
}
