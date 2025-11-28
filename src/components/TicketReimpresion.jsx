import "./ticket.css";

export default function TicketReimpresion({ data, onClose }) {
  if (!data) return null;

  const {
    fecha,
    total = 0,
    caja,
    items = [] // aseguramos que siempre sea una lista
  } = data;

  return (
    <div className="ticket-modal">
      <div className="ticket-box" id="ticket-print">

        {/* Logo */}
        <div className="ticket-center">
          <img src="/Amandalogo.png" alt="logo" className="ticket-logo" />
        </div>

        <div className="ticket-center">
          <b>AMANDA MINIMARKET Y BOTILLERÍA</b>
        </div>

        <div className="ticket-center small">
          RUT: 77.721.465-9
        </div>
        <div className="ticket-center small">
          DIRECCIÓN : BARROS ARANA #139
        </div>

        <hr />

        {/* Información venta */}
        <div className="small">
          Caja: <b>{caja}</b>
        </div>
        <div className="small">
          Fecha: {new Date(fecha).toLocaleString("es-CL")}
        </div>

        <hr />

        {/* Detalle */}
        {items.map((i, idx) => (
          <div key={idx} className="item-row">
            <div>
              {i.cantidad} x {i.nombre}
            </div>
            <div>
              ${Number(i.subtotal).toLocaleString("es-CL")}
            </div>
          </div>
        ))}

        <hr />

        {/* Total */}
        <div className="item-row total">
          <div><b>TOTAL</b></div>
          <div><b>${Number(total).toLocaleString("es-CL")}</b></div>
        </div>

        <hr />

        <div className="ticket-center small">
          ¡Gracias por su compra!
        </div>

      </div>

      <div className="ticket-actions">
        <button onClick={onClose}>Cerrar</button>
        <button onClick={() => window.print()}>Imprimir</button>
      </div>
    </div>
  );
}