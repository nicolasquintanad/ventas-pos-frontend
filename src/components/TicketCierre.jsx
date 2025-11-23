import { Modal, Button } from "antd";
import { PrinterOutlined } from "@ant-design/icons";

export default function TicketCierre({ data, onClose }) {
  if (!data) return null;

  return (
    <Modal
      open={true}
      footer={null}
      onCancel={onClose}
      centered
      width={300}
    >
      <div id="ticket" style={styles.ticket}>
        <h3 style={styles.center}>*** CIERRE DE CAJA ***</h3>
        <p style={styles.center}><b>Cierre #{data.idAperturaCierre}</b></p>
        
        <p><b>Caja:</b> {data.caja}</p>
        <p><b>Usuario:</b> {data.usuario}</p>
        <p><b>Apertura:</b> {formatDate(data.fechaApertura)}</p>
        <p><b>Cierre:</b> {formatDate(data.fechaCierre)}</p>

        <hr/>

        <p><b>Monto inicial:</b> ${formatNumber(data.montoInicial)}</p>
        <p><b>Ventas totales:</b> ${formatNumber(data.totalVentas)}</p>
        <p><b>Monto cigarrillos:</b> ${formatNumber(data.montoCigarros)}</p>
        <p style={styles.totalFinal}><b>MONTO FINAL:</b> {formatNumber(data.montoFinal)}</p>

        <hr/>

        <p><b>Transacciones:</b> {data.totalTransacciones}</p>
        <p><b>Productos vendidos:</b> {data.productosVendidos}</p>
        <p><b>Packs vendidos:</b> {data.packsVendidos}</p>
        <p><b>Cigarros vend:</b> {data.contieneCigarros ? "Sí" : "No"}</p>

        <hr />

        <div style={styles.buttons}>
          <Button 
            type="primary" 
            icon={<PrinterOutlined />} 
            onClick={() => window.print()}
            style={{ marginRight: 10 }}
          >
            Imprimir
          </Button>

          <Button onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function formatNumber(num) {
    if (!num) return "0";
    return `$ ${Number(num).toLocaleString("es-CL")}`;
  }

function formatDate(date) {
  return new Date(date).toLocaleString("es-CL");
}

const styles = {
  ticket: {
    width: "250px", // ancho ticket 80mm
    fontFamily: "monospace",
    padding: "5px",
    fontSize: "13px"
  },
  center: { textAlign: "center" },
  buttons: { marginTop: "10px", textAlign: "center" },
  totalFinal: {
    fontSize: "15px",
    fontWeight: "bold",
    borderTop: "1px dashed #000",
    borderBottom: "1px dashed #000",
    padding: "5px 0",
    margin: "8px 0",
    textAlign: "center"
  }
};