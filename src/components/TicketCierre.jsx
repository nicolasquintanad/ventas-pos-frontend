import { Modal, Button } from "antd";
import { PrinterOutlined } from "@ant-design/icons";
import { message } from "antd";
import { imprimirCierreLocal } from "../api/impresionLocal";

export default function TicketCierre({ data,ID_CAJA ,onClose }) {
  if (!data) return null;

  console.log(data);

  const ticketCierre = {
    IdCierre: data.idAperturaCierre,     // o el id real del cierre
    Caja: data.caja,
    Usuario: data.usuario,
  
    FechaApertura: data.fechaApertura,
    FechaCierre: data.fechaCierre,
  
    MontoInicial: data.montoInicial,
  
    TotalProductos: data.montoProductos ?? 0,
    TotalCigarros: data.montoCigarros ?? 0,
    TotalVentas: data.totalVentas ?? 0,
  
    MontoFinal: data.montoFinal,
  
    Transacciones: data.totalTransacciones ?? 0,
    ProductosVendidos: data.productosVendidos ?? 0,
    PacksVendidos: data.packsVendidos ?? 0,
  
    ContieneCigarros: data.contieneCigarros ?? false,
  };
  console.log("SI:");
console.log(ticketCierre);
  const onImprimirCierre = async () => {
    try {
      await imprimirCierreLocal(ticketCierre, ID_CAJA); // 🔥 LOCAL
      message.success("Cierre impreso correctamente");
      onClose();
    } catch (e) {
      console.error(e);
      message.error("Error al imprimir cierre");
    }
  };

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
        <p><b>Total productos:</b> ${formatNumber(data.montoProductos)}</p>
<p><b>Total cigarrillos:</b> ${formatNumber(data.montoCigarros)}</p>

<hr/>

<p><b>Ventas totales:</b> ${formatNumber(data.totalVentas)}</p>
<p style={styles.totalFinal}><b>MONTO FINAL:</b> ${formatNumber(data.montoFinal)}</p>

        <p><b>Transacciones:</b> {data.totalTransacciones}</p>
        <p><b>Productos vendidos:</b> {data.productosVendidos}</p>
        <p><b>Packs vendidos:</b> {data.packsVendidos}</p>
        <p><b>Cigarros vend:</b> {data.contieneCigarros ? "Sí" : "No"}</p>

        <hr />

        <div style={styles.buttons}>
          <Button 
            type="primary" 
            icon={<PrinterOutlined />} 
            onClick={onImprimirCierre}
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