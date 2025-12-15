export const imprimirVentaLocal = async (ticket, impresora) => {
  await fetch("http://localhost:9100/print/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      Tipo: "VENTA",
      IdCaja: impresora,
      Data: ticket,
    }),
  });
};

export const imprimirCierreLocal = async (cierre, ID_CAJA) => {
  await fetch("http://localhost:9100/print", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      Tipo: "CIERRE",
      IdCaja: ID_CAJA,
      Impresora: "XP-80",
      Data: cierre,
    }),
  });
};
