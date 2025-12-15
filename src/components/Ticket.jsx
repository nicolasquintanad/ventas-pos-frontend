import "./ticket.css";
import { message } from "antd";
import { imprimirVentaLocal } from "../api/impresionLocal";

export default function Ticket({ data, user, caja, onClose }) {
  if (!data) return null;

  const { items, total } = data;

  const ticketVenta = {
    Empresa: "AMANDA MINIMARKET Y BOTILLERIA",
    Rut: "77.721.465-9",
    Direccion: "BARROS ARANA #139",
    Caja: caja.caja ?? caja.NOMBRE,
    Fecha: new Date().toLocaleString("es-CL", {
      timeZone: "America/Santiago",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }),
    Items: items.map(i => ({
      Cantidad: i.cantidad,
      Nombre: i.nombre,
      Subtotal: i.subtotal
    })),
    Total: total
  };

  const onImprimir = async () => {
    try {
      await imprimirVentaLocal(ticketVenta,caja.ID_CAJA);
      message.success("Ticket enviado a impresión");
      onClose();
      
    } catch (e) {
      console.error(e);
      message.error("Error al imprimir ticket");
    }
  };

  return (
    <div className="ticket-modal">
      <div className="ticket-box">
        <div className="ticket-center">
          <img src="/Amandalogo.png" alt="logo" className="ticket-logo" />
        </div>

        <div className="ticket-center">
          <b>AMANDA MINIMARKET Y BOTILLERÍA</b>
        </div>

        <div className="ticket-center small">RUT: 77.721.465-9</div>
        <div className="ticket-center small">DIRECCIÓN : BARROS ARANA #139</div>

        <hr />

        <div className="small">
          Caja: <b>{caja.caja ?? caja.NOMBRE}</b>
        </div>
        <div className="small">
          Fecha: {new Date().toLocaleString("es-CL")}
        </div>

        <hr />

        {items.map((i, idx) => (
          <div key={idx} className="item-row">
            <div>{i.cantidad} x {i.nombre}</div>
            <div>${i.subtotal.toLocaleString("es-CL")}</div>
          </div>
        ))}

        <hr />

        <div className="item-row total">
          <div><b>TOTAL</b></div>
          <div><b>${total.toLocaleString("es-CL")}</b></div>
        </div>

        <hr />

        <div className="ticket-center small">
          ¡Gracias por su compra!
        </div>
      </div>

      <div className="ticket-actions">
        <button onClick={onClose}>Cerrar</button>
        <button onClick={onImprimir}>Imprimir</button>
      </div>
    </div>
  );
}