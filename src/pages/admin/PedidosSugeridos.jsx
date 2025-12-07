import { useEffect, useState } from "react";
import { Card, Table, Button, message } from "antd";
import { MailOutlined, ReloadOutlined } from "@ant-design/icons";
import { getSugerenciasHoy, sendSugerenciasHoyEmail } from "../../api/proveedores";

export default function PedidosSugeridos() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const resp = await getSugerenciasHoy();
      setData(resp);
    } catch {
      message.error("Error al cargar sugerencias de pedido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSendEmail = async () => {
    try {
      setSending(true);
      const resp = await sendSugerenciasHoyEmail();
      message.success(resp || "Correo enviado");
    } catch {
      message.error("Error al enviar el correo");
    } finally {
      setSending(false);
    }
  };

  return (
    <Card
      title="Pedidos sugeridos para hoy"
      extra={
        <>
          <Button
            icon={<ReloadOutlined />}
            onClick={loadData}
            style={{ marginRight: 8 }}
          >
            Actualizar
          </Button>
          <Button
            type="primary"
            icon={<MailOutlined />}
            loading={sending}
            onClick={handleSendEmail}
          >
            Enviar por correo
          </Button>
        </>
      }
      style={{ margin: 20 }}
    >
      {data.length === 0 ? (
        <p>No hay sugerencias de compra para hoy.</p>
      ) : (
        data.map((prov) => (
          <Card
            key={prov.idProveedor}
            title={`Proveedor: ${prov.proveedor}`}
            style={{ marginBottom: 16 }}
          >
            <Table
              size="small"
              pagination={false}
              rowKey="ID_PRODUCTO"
              dataSource={prov.sugerencias}
              columns={[
                { title: "SKU", dataIndex: "SKU" },
                { title: "Producto", dataIndex: "NOMBRE" },
                {
                  title: "Stock",
                  dataIndex: "STOCK",
                  align: "right",
                },
                {
                  title: "Vendido período",
                  dataIndex: "VendidoPeriodo",
                  align: "right",
                },
                {
                  title: "Promedio diario",
                  dataIndex: "PromedioDiario",
                  align: "right",
                  render: (v) => v.toFixed(2),
                },
                {
                  title: "Demanda próxima visita",
                  dataIndex: "DemandaEsperadaHorizonte",
                  align: "right",
                  render: (v) => v.toFixed(2),
                },
                {
                  title: "Sugerido comprar",
                  dataIndex: "CantidadSugerida",
                  align: "right",
                  render: (v) => (
                    <b style={{ color: v > 0 ? "red" : "green" }}>
                      {v > 0 ? v : "OK"}
                    </b>
                  ),
                },
              ]}
            />
          </Card>
        ))
      )}
    </Card>
  );
}