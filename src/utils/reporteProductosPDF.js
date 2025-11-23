import jsPDF from "jspdf";
import "jspdf-autotable";

export function generarPDFProductos(data) {
  const doc = new jsPDF();

  doc.setFontSize(14);
  doc.text("Reporte Consolidado de Productos Vendidos", 10, 10);

  const tabla = data.map((item) => [
    item.Producto,
    item.Proveedor,
    item.CantidadTotal,
    `$${item.SubTotalTotal.toLocaleString("es-CL")}`,
    `$${item.PrecioPromedio.toLocaleString("es-CL")}`,
  ]);

  doc.autoTable({
    head: [
      ["Producto", "Proveedor", "Cantidad", "Subtotal", "Precio Promedio"],
    ],
    body: tabla,
    startY: 20,
  });

  doc.save("reporte_productos.pdf");
}
