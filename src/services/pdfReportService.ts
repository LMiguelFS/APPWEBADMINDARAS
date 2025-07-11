// utils/pdfReportGenerator.ts
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable: {
      finalY: number;
    };
  }
}

type ReportResponse = {
  start_date: string;
  end_date: string;
  updated_at: string;
  metrics: {
    total_orders: number;
    total_income: number;
    currency: string;
    products_sold: Record<string, { total_quantity: number; total_amount: number }>;
    top_product: number;
    payment_methods: Record<string, number>;
    order_statuses: Record<string, number>;
    time_metrics: {
      first_order: string;
      last_order: string;
    };
  };
};

export const generateSalesPDFReport = (data: ReportResponse) => {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text('Reporte de Ventas Personalizado', 14, 20);

  doc.setFontSize(10);
  doc.text(`Desde: ${new Date(data.start_date).toLocaleString()}`, 14, 28);
  doc.text(`Hasta: ${new Date(data.end_date).toLocaleString()}`, 14, 34);
  doc.text(`Generado: ${new Date(data.updated_at).toLocaleString()}`, 14, 40);

  const metrics = data.metrics;

  autoTable(doc, {
    startY: 46,
    head: [['Métrica', 'Valor']],
    body: [
      ['Total de Pedidos', metrics.total_orders],
      ['Ingreso Total', `S/ ${metrics.total_income}`],
      ['Moneda', metrics.currency],
      ['Producto Más Vendido (ID)', metrics.top_product],
      ['Primera Orden', new Date(metrics.time_metrics.first_order).toLocaleString()],
      ['Última Orden', new Date(metrics.time_metrics.last_order).toLocaleString()],
    ],
  });

  const productos = Object.entries(metrics.products_sold).map(([id, p]) => [
    id,
    p.total_quantity,
    `S/ ${p.total_amount}`,
  ]);
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    head: [['ID Producto', 'Cantidad Vendida', 'Monto Total']],
    body: productos,
  });

  const pagos = Object.entries(metrics.payment_methods).map(([metodo, count]) => [
    metodo,
    count,
  ]);
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    head: [['Método de Pago', 'Cantidad']],
    body: pagos,
  });

  const estados = Object.entries(metrics.order_statuses).map(([estado, count]) => [
    estado,
    count,
  ]);
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    head: [['Estado de Orden', 'Cantidad']],
    body: estados,
  });

  doc.save('reporte_ventas_personalizado.pdf');
};
