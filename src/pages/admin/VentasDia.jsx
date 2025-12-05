import { useEffect, useState } from "react";
import { Card, Table, Button, message } from "antd";
import { PrinterOutlined } from "@ant-design/icons";
import { getVentasDelDia, getDetalleVenta } from "../../api/sales";
import TicketReimpresion from "../../components/TicketReimpresion";

export default function VentasDia() {
  const [ventas, setVentas] = useState([]);
  const [ticket, setTicket] = useState(null);  // ← ESTE ES EL TICKET A MOSTRAR

  const loadData = async () => {
    try {
      const data = await getVentasDelDia();
      setVentas(data);
    } catch {
      message.error("Error al cargar ventas del día");
    }
  };

  const onPrint = async (row) => {
    try {
      const resp = await getDetalleVenta(row.ID_VENTA);
  
      console.log("RESP DETALLE:", resp);
  
      setTicket({
        fecha: resp.FECHA,
        total: resp.TOTAL,
        caja: resp.caja,
        items: resp.detalle  // <-- ESTE ES EL ARRAY REAL
      });
  
    } catch {
      message.error("Error al obtener detalle de venta");
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
          onClick={() => onPrint(row)}
        >
          Reimprimir
        </Button>
      )
    }
  ];

  return (
    <Card style={{ margin: 20 }} title="Ventas del día">
      <Table
        scroll={{ x: "max-content" }}
        dataSource={ventas}
        columns={columnas}
        rowKey="ID_VENTA"
        pagination={false}
      />

      {/* Mostrar Ticket */}
      {ticket && (
        <TicketReimpresion
          data={ticket}
          onClose={() => setTicket(null)}
        />
      )}
    </Card>
  );
}