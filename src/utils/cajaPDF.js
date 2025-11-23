import jsPDF from "jspdf";
import "jspdf-autotable";

export const generarPDFCaja = (data) => {
  const doc = new jsPDF();

  // Logo
  const logo = "/Amandalogo.png"; // Asegúrate que existe en public/
  doc.addImage(logo, "PNG", 10, 5, 30, 30);

  doc.setFontSize(16);
  doc.text("Informe de Cierre de Caja", 60, 15);

  doc.setFontSize(12);
  doc.text(`Cajero: ${data.usuario}`, 10, 45);
  doc.text(`Caja: ${data.caja}`, 10, 52);

  doc.text(
    `Fecha Apertura: ${new Date(data.fechaApertura).toLocaleString()}`,
    10,
    60
  );
  doc.text(
    `Fecha Cierre: ${new Date(data.fechaCierre).toLocaleString()}`,
    10,
    68
  );

  doc.text(`Monto Inicial: $${data.montoInicial}`, 10, 78);
  doc.text(`Monto Final: $${data.montoFinal}`, 10, 86);
  doc.text(`Total Ventas: $${data.totalVentas}`, 10, 94);

  doc.text(`Transacciones: ${data.transacciones}`, 10, 104);
  doc.text(`Productos Vendidos: ${data.productosVendidos}`, 10, 112);
  doc.text(`Packs Vendidos: ${data.packsVendidos}`, 10, 120);

  doc.text(
    `Contiene cigarrillos en ventas: ${data.contieneCigarros ? "Sí" : "No"}`,
    10,
    128
  );

  doc.save("Cierre_Caja.pdf");
};
