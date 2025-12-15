import api from "./axios";

/**
 * Imprimir Ticket de Venta
 * @param {number} idCaja
 * @param {object} ticketVentaDto
 */
export const imprimirVenta = async (idCaja, ticketVentaDto) => {
  const payload = {
    IdCaja: idCaja,
    Tipo: 1, // TipoImpresion.Venta
    Data: ticketVentaDto,
  };

  const res = await api.post("api/impresion/print", payload);
  return res.data;
};

/**
 * Imprimir Ticket de Cierre
 * @param {number} idCaja
 * @param {object} ticketCierreDto
 */
export const imprimirCierre = async (idCaja, ticketCierreDto) => {
  const payload = {
    IdCaja: idCaja,
    Tipo: 2, // TipoImpresion.Cierre
    Data: ticketCierreDto,
  };

  const res = await api.post("api/impresion/print", payload);
  return res.data;
};
