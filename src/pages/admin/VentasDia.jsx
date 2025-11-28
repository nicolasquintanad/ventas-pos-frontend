import { useEffect, useState } from "react";
import { Card, Table, Button, message } from "antd";
import { PrinterOutlined } from "@ant-design/icons";
import { getVentasDelDia } from "../../api/sales";
import Ticket from "../../components/Ticket";

export default function VentasDia() {
  const [ventas, setVentas] = useState([]);
  const [ticket, setTicket] = useState(null);

  const loadData = async () => {
    try {
      const data = await getVentasDelDia();
      setVentas(data);
    } catch {
      message.error("Error al cargar ventas del día");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const columnas = [
    { title: "N° Venta", dataIndex: "ID_VENTA" },
    {
      title: "Fecha",
      dataIndex: "FECHA",
      render: (f) => new Date(f).toLocaleString("es-CL")
    },
    { title: "Caja", dataIndex: "Caja" },
    {
      title: "Monto Total",
      dataIndex: "TOTAL",
      render: (v) => `$${v.toLocaleString("es-CL")}`
    },
    {
      title: "Acción",
      render: (_, row) => (
        <Button
          icon={<PrinterOutlined />}
          type="primary"
          onClick={() => setTicket(row)} // Abre ticket para reimprimir
        >
          Reimprimir
        </Button>
      )
    }
  ];

  return (
    <Card style={{ margin: 20 }} title="Ventas del día">
      <Table
        dataSource={ventas}
        columns={columnas}
        rowKey="ID_VENTA"
        pagination={false}
      />

      {ticket && (
        <Ticket
          data={{ idVenta: ticket.ID_VENTA }}  // Se reimprime usando ID
          onClose={() => setTicket(null)}
          reimpresion
        />
      )}
    </Card>
  );
}