import XLSX from 'xlsx-js-style';
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

  // Estilos de cabecera Morado y Rosa
  const headerStylePurple = {
    fill: { fgColor: { rgb: '581C87' } }, // Morado profundo (Purple 900)
    font: { name: 'Calibri', sz: 11, bold: true, color: { rgb: 'FFFFFF' } },
    alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
    border: {
      top: { style: 'thin', color: { rgb: 'D8B4FE' } },
      bottom: { style: 'medium', color: { rgb: '3B0764' } },
      left: { style: 'thin', color: { rgb: 'D8B4FE' } },
      right: { style: 'thin', color: { rgb: 'D8B4FE' } }
    }
  };

  const headerStylePink = {
    fill: { fgColor: { rgb: '9D174D' } }, // Rosa profundo (Pink 900)
    font: { name: 'Calibri', sz: 11, bold: true, color: { rgb: 'FFFFFF' } },
    alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
    border: {
      top: { style: 'thin', color: { rgb: 'FBCFE8' } },
      bottom: { style: 'medium', color: { rgb: '831843' } },
      left: { style: 'thin', color: { rgb: 'FBCFE8' } },
      right: { style: 'thin', color: { rgb: 'FBCFE8' } }
    }
  };

  const totalRowStylePurple = {
    fill: { fgColor: { rgb: 'F3E8FF' } }, // Morado suave
    font: { name: 'Calibri', sz: 11, bold: true, color: { rgb: '3B0764' } },
    alignment: { vertical: 'center' },
    border: {
      top: { style: 'thin', color: { rgb: 'A855F7' } },
      bottom: { style: 'double', color: { rgb: '581C87' } }
    }
  };

  const totalRowStylePink = {
    fill: { fgColor: { rgb: 'FCE7F3' } }, // Rosa suave
    font: { name: 'Calibri', sz: 11, bold: true, color: { rgb: '831843' } },
    alignment: { vertical: 'center' },
    border: {
      top: { style: 'thin', color: { rgb: 'EC4899' } },
      bottom: { style: 'double', color: { rgb: '9D174D' } }
    }
  };

  const dataStyleText = {
    font: { name: 'Calibri', sz: 10, color: { rgb: '000000' } },
    alignment: { vertical: 'center' }
  };

  const dataStyleNumber = {
    font: { name: 'Calibri', sz: 10, bold: true, color: { rgb: '000000' } },
    alignment: { horizontal: 'right', vertical: 'center' },
    numFmt: '#,##0.00'
  };

  // 1. Hoja ATENCIONES
  const atencionesHeaders = [
    'N°', 'FECHA', 'BOLETA', 'DOCTORA', 'PACIENTE', 'TRATAMIENTO',
    'EFECTIVO (S/)', 'BANCO (S/)', 'MEDIO BANCO', 'DOCTORA ASIGNADA',
    'COMISIÓN DOCTORA (S/)', 'OBSERVACIONES'
  ];

  const atencionesRows: any[][] = [];
  atenciones.forEach((a, idx) => {
    atencionesRows.push([
      idx + 1,
      a.fecha,
      a.boleta,
      a.doctora,
      a.paciente,
      a.tratamiento,
      Number(a.efectivo) || 0,
      Number(a.banco) || 0,
      a.bancoTipo,
      a.doctoraAsignada,
      Number(a.montoDoctora) || 0,
      a.observaciones
    ]);
  });

  // Fila Total
  atencionesRows.push([
    '', '', '', '', 'TOTALES', '',
    cuadre.totalIngresosEfectivo,
    cuadre.totalIngresosBanco,
    '', '',
    cuadre.totalComisionesDoctoras,
    ''
  ]);

  const wsAtenciones = XLSX.utils.aoa_to_sheet([atencionesHeaders, ...atencionesRows]);

  // Aplicar estilos a Atenciones
  const rangeAtn = XLSX.utils.decode_range(wsAtenciones['!ref'] || 'A1:L1');
  for (let C = rangeAtn.s.c; C <= rangeAtn.e.c; ++C) {
    const headerCell = XLSX.utils.encode_cell({ r: 0, c: C });
    if (wsAtenciones[headerCell]) {
      wsAtenciones[headerCell].s = headerStylePurple;
    }

    const lastRowIndex = rangeAtn.e.r;
    const totalCell = XLSX.utils.encode_cell({ r: lastRowIndex, c: C });
    if (wsAtenciones[totalCell]) {
      wsAtenciones[totalCell].s = totalRowStylePurple;
      if (C === 6 || C === 7 || C === 10) {
        wsAtenciones[totalCell].s = { ...totalRowStylePurple, ...dataStyleNumber };
      }
    }

    for (let R = 1; R < lastRowIndex; ++R) {
      const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
      if (wsAtenciones[cellRef]) {
        if (C === 6 || C === 7 || C === 10) {
          wsAtenciones[cellRef].s = dataStyleNumber;
        } else {
          wsAtenciones[cellRef].s = dataStyleText;
        }
      }
    }
  }

  wsAtenciones['!cols'] = [
    { wch: 5 },  // N°
    { wch: 9 },  // FECHA
    { wch: 9 },  // BOLETA
    { wch: 14 }, // DOCTORA
    { wch: 24 }, // PACIENTE
    { wch: 30 }, // TRATAMIENTO
    { wch: 14 }, // EFECTIVO
    { wch: 14 }, // BANCO
    { wch: 14 }, // MEDIO BANCO
    { wch: 18 }, // DOCTORA ASIG
    { wch: 22 }, // COMISION
    { wch: 32 }  // OBSERVACIONES
  ];

  XLSX.utils.book_append_sheet(wb, wsAtenciones, 'Atenciones');

  // 2. Hoja GASTOS
  const gastosHeaders = ['N°', 'FECHA', 'MEDIO', 'MONTO (S/)', 'OBSERVACIONES / DETALLE DEL GASTO'];
  const gastosRows: any[][] = [];
  gastos.forEach((g, idx) => {
    gastosRows.push([
      idx + 1,
      g.fecha,
      g.medio,
      Number(g.monto) || 0,
      g.observaciones
    ]);
  });

  gastosRows.push(['', '', 'TOTAL GASTOS', cuadre.totalGastos, '']);

  const wsGastos = XLSX.utils.aoa_to_sheet([gastosHeaders, ...gastosRows]);
  const rangeGst = XLSX.utils.decode_range(wsGastos['!ref'] || 'A1:E1');
  for (let C = rangeGst.s.c; C <= rangeGst.e.c; ++C) {
    const headerCell = XLSX.utils.encode_cell({ r: 0, c: C });
    if (wsGastos[headerCell]) {
      wsGastos[headerCell].s = headerStylePink;
    }

    const lastRowIndex = rangeGst.e.r;
    const totalCell = XLSX.utils.encode_cell({ r: lastRowIndex, c: C });
    if (wsGastos[totalCell]) {
      wsGastos[totalCell].s = totalRowStylePink;
      if (C === 3) {
        wsGastos[totalCell].s = { ...totalRowStylePink, ...dataStyleNumber };
      }
    }

    for (let R = 1; R < lastRowIndex; ++R) {
      const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
      if (wsGastos[cellRef]) {
        if (C === 3) {
          wsGastos[cellRef].s = dataStyleNumber;
        } else {
          wsGastos[cellRef].s = dataStyleText;
        }
      }
    }
  }

  wsGastos['!cols'] = [
    { wch: 6 },
    { wch: 12 },
    { wch: 15 },
    { wch: 16 },
    { wch: 45 }
  ];

  XLSX.utils.book_append_sheet(wb, wsGastos, 'Gastos');

  // 3. Hoja CUADRE Y RESUMEN
  const resumenHeaders = ['CONCEPTO FINANCIERO', 'MONTO (S/)'];
  const resumenRows: any[][] = [
    ['Total Atenciones en Efectivo', cuadre.totalIngresosEfectivo],
    ['Total Pagos por Bancos (BCP / Interbank / Yape)', cuadre.totalIngresosBanco],
    ['TOTAL GENERAL INGRESOS', cuadre.totalIngresos],
    ['TOTAL GASTOS REALIZADOS', cuadre.totalGastos],
    ['SALDO NETO EN CAJA (Efectivo - Gastos)', cuadre.saldoCajaEfectivo],
    ['Total Liquidación / Comisiones Doctoras', cuadre.totalComisionesDoctoras]
  ];

  if (cuadre.totalGastosDeclarado !== undefined) {
    resumenRows.push(['Total Gastos Anotado en Cuaderno (G<)', cuadre.totalGastosDeclarado]);
  }
  if (cuadre.saldoCajaDeclarado !== undefined) {
    resumenRows.push(['Saldo en Caja Anotado en Cuaderno (CAJA)', cuadre.saldoCajaDeclarado]);
  }

  const wsResumen = XLSX.utils.aoa_to_sheet([resumenHeaders, ...resumenRows]);
  const rangeRes = XLSX.utils.decode_range(wsResumen['!ref'] || 'A1:B1');
  for (let C = rangeRes.s.c; C <= rangeRes.e.c; ++C) {
    const headerCell = XLSX.utils.encode_cell({ r: 0, c: C });
    if (wsResumen[headerCell]) {
      wsResumen[headerCell].s = headerStylePurple;
    }
    for (let R = 1; R <= rangeRes.e.r; ++R) {
      const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
      if (wsResumen[cellRef]) {
        if (C === 1) {
          wsResumen[cellRef].s = dataStyleNumber;
        } else {
          wsResumen[cellRef].s = dataStyleText;
        }
      }
    }
  }

  wsResumen['!cols'] = [{ wch: 42 }, { wch: 20 }];
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

  // Encabezado con Morado elegante de nuestra paleta
  doc.setFillColor(88, 28, 135); // Morado profundo (Purple 900)
  doc.rect(0, 0, 842, 48, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text('CLÍNICA DENTAL — CONTROL DIARIO DE ATENCIONES Y CAJA', 30, 30);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Fecha: ${fechaReporte}`, 720, 30);

  // Tarjetas KPI con diseño claro, alto contraste y nuestra paleta de rosas y morados
  let currentY = 62;

  // Card 1: TOTAL INGRESOS (Morado claro con texto negro puro)
  doc.setFillColor(245, 243, 255); // purple-50
  doc.setDrawColor(216, 180, 254); // purple-300
  doc.setLineWidth(1.2);
  doc.roundedRect(30, currentY, 175, 46, 5, 5, 'FD');

  doc.setTextColor(88, 28, 135); // purple-900
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL INGRESOS', 42, currentY + 16);

  doc.setTextColor(0, 0, 0); // NEGRO PURO
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`S/ ${cuadre.totalIngresos.toFixed(2)}`, 42, currentY + 36);

  // Card 2: TOTAL GASTOS (Rosa suave con texto rosa/negro de alto contraste)
  doc.setFillColor(255, 241, 242); // rose-50
  doc.setDrawColor(254, 205, 211); // rose-300
  doc.roundedRect(220, currentY, 175, 46, 5, 5, 'FD');

  doc.setTextColor(159, 18, 57); // rose-800
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL GASTOS', 232, currentY + 16);

  doc.setTextColor(190, 18, 60); // rose-700
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`S/ ${cuadre.totalGastos.toFixed(2)}`, 232, currentY + 36);

  // Card 3: SALDO EN CAJA EFECTIVO (Morado intenso con letras blancas y número en negro puro sobre recuadro)
  doc.setFillColor(250, 245, 255); // fuchsia-50
  doc.setDrawColor(192, 38, 211); // fuchsia-600
  doc.roundedRect(410, currentY, 175, 46, 5, 5, 'FD');

  doc.setTextColor(112, 26, 117); // fuchsia-900
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('SALDO EN CAJA (EFECTIVO)', 422, currentY + 16);

  doc.setTextColor(0, 0, 0); // NEGRO PURO
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`S/ ${cuadre.saldoCajaEfectivo.toFixed(2)}`, 422, currentY + 36);

  // Card 4: LIQUIDACIÓN DOCTORAS
  doc.setFillColor(243, 232, 255); // violet-100
  doc.setDrawColor(168, 85, 247); // purple-500
  doc.roundedRect(600, currentY, 212, 46, 5, 5, 'FD');

  doc.setTextColor(107, 33, 168); // purple-800
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('LIQUIDACIÓN / DOCTORAS', 612, currentY + 16);

  doc.setTextColor(88, 28, 135);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`S/ ${cuadre.totalComisionesDoctoras.toFixed(2)}`, 612, currentY + 36);

  currentY += 60;

  // 1. Tabla de Atenciones Clínicas
  doc.setTextColor(59, 7, 100);
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
    a.efectivo ? `S/ ${Number(a.efectivo).toFixed(2)}` : '-',
    a.banco ? `S/ ${Number(a.banco).toFixed(2)} (${a.bancoTipo})` : '-',
    a.doctoraAsignada ? `${a.doctoraAsignada}: S/ ${a.montoDoctora}` : '-',
    a.observaciones || '-'
  ]);

  // Fila Total
  atencionesRows.push([
    '',
    '',
    '',
    '',
    'TOTALES',
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
      fontSize: 8.5,
      cellPadding: 3.5,
      valign: 'middle',
      textColor: [0, 0, 0], // TEXTO NEGRO PURO EN CELDAS
      lineColor: [226, 232, 240],
      lineWidth: 0.6
    },
    headStyles: {
      fillColor: [88, 28, 135], // Morado profundo (Purple 900)
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5
    },
    alternateRowStyles: {
      fillColor: [252, 250, 255] // Fila alterna en lila sutil
    },
    columnStyles: {
      0: { cellWidth: 20, halign: 'center' },
      1: { cellWidth: 38 },
      2: { cellWidth: 35 },
      3: { cellWidth: 62 },
      4: { cellWidth: 115 },
      5: { cellWidth: 140 },
      6: { cellWidth: 55, halign: 'right' },
      7: { cellWidth: 65, halign: 'right' },
      8: { cellWidth: 80 },
      9: { cellWidth: 'auto' }
    },
    margin: { left: 30, right: 30 },
    didParseCell: (data) => {
      // Fila de totales en negrita y color destacado
      if (data.row.index === atencionesRows.length - 1) {
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.fillColor = [243, 232, 255];
        data.cell.styles.textColor = [0, 0, 0];
      }
    }
  });

  const finalY = (doc as any).lastAutoTable.finalY + 25;

  // 2. Tabla de Gastos
  if (finalY > 480) {
    doc.addPage();
    currentY = 40;
  } else {
    currentY = finalY;
  }

  doc.setTextColor(157, 23, 77); // Rosa profundo
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('2. Gastos y Egresos Diarios', 30, currentY);

  const gastosRows = gastos.map((g, i) => [
    (i + 1).toString(),
    g.fecha || '-',
    g.medio || 'Efectivo',
    `S/ ${Number(g.monto).toFixed(2)}`,
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
    head: [['#', 'Fecha', 'Medio', 'Monto S/', 'Observaciones / Detalle del Gasto']],
    body: gastosRows,
    theme: 'grid',
    styles: {
      fontSize: 8.5,
      cellPadding: 3.5,
      textColor: [0, 0, 0], // TEXTO NEGRO PURO
      lineColor: [226, 232, 240],
      lineWidth: 0.6
    },
    headStyles: {
      fillColor: [157, 23, 77], // Rosa profundo (Pink 900)
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5
    },
    alternateRowStyles: {
      fillColor: [255, 248, 250] // Fila alterna en rosa sutil
    },
    columnStyles: {
      0: { cellWidth: 25, halign: 'center' },
      1: { cellWidth: 50 },
      2: { cellWidth: 70 },
      3: { cellWidth: 75, halign: 'right' },
      4: { cellWidth: 'auto' }
    },
    margin: { left: 30, right: 30 },
    didParseCell: (data) => {
      if (data.row.index === gastosRows.length - 1) {
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.fillColor = [252, 231, 243];
        data.cell.styles.textColor = [0, 0, 0];
      }
    }
  });

  const cleanDate = fechaReporte.replace(/[\/\\]/g, '-');
  doc.save(`Cuaderno_Dental_${cleanDate}.pdf`);
}
