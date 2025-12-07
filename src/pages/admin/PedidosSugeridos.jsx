import { useEffect, useState } from "react";
import { Card, Table, Button, Tabs, message } from "antd";
import { ReloadOutlined, MailOutlined } from "@ant-design/icons";

import {
  getSugerenciasByDate,
  sendSugerenciasHoyEmail
} from "../../api/proveedores";

export default function PedidosSugeridos() {
  const [diaSeleccionado, setDiaSeleccionado] = useState(0); // 0 = lunes
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const days = [
    { key: 1, label: "Lunes" },
    { key: 2, label: "Martes" },
    { key: 3, label: "Miércoles" },
    { key: 4, label: "Jueves" },
    { key: 5, label: "Viernes" },
    { key: 6, label: "Sábado" },
    { key: 0, label: "Domingo" },
  ];

  const calcularFechaPorDia = (targetDay) => {
    const hoy = new Date();
    const diff = (targetDay + 7 - hoy.getDay()) % 7;
    const fecha = new Date(hoy);
    fecha.setDate(hoy.getDate() + diff);
    return fecha.toISOString().split("T")[0];
  };

  const loadData = async (day) => {
    try {
      setLoading(true);
      const fecha = calcularFechaPorDia(day);
      const resp = await getSugerenciasByDate(fecha);
      setData(resp);
    } catch {
      message.error("Error al cargar sugerencias");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(diaSeleccionado);
  }, [diaSeleccionado]);

  const handleSendEmail = async () => {
    try {
      setSending(true);
      const resp = await sendSugerenciasHoyEmail();
      message.success(resp || "Correo enviado");
    } catch {
      message.error("Error enviando correo");
    } finally {
      setSending(false);
    }
  };

  return (
    <Card
      title="Pedidos sugeridos por día"
      extra={
        <>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => loadData(diaSeleccionado)}
            style={{ marginRight: 8 }}
          >
            Actualizar
          </Button>

          {/* <Button
            type="primary"
            icon={<MailOutlined />}
            loading={sending}
            onClick={handleSendEmail}
          >
            Enviar correo (solo hoy)
          </Button> */}
        </>
      }
      style={{ margin: 20 }}
    >
      {/* Tabs por día */}
      <Tabs
        activeKey={diaSeleccionado.toString()}
        onChange={(key) => setDiaSeleccionado(Number(key))}
        items={days.map((d) => ({
          key: d.key.toString(),
          label: d.label,
        }))}
      />

      {/* Listado de proveedores */}
      {data.length === 0 ? (
        <p>No hay sugerencias de compra para este día.</p>
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
                { title: "Stock", dataIndex: "STOCK", align: "right" },
                { title: "Vendido período", dataIndex: "VendidoPeriodo", align: "right" },
                { title: "Promedio diario", dataIndex: "PromedioDiario", align: "right", render: (v) => v.toFixed(2) },
                { title: "Demanda próxima visita", dataIndex: "DemandaEsperadaHorizonte", align: "right", render: (v) => v.toFixed(2) },
                {
                  title: "Sugerido comprar",
                  dataIndex: "CantidadSugerida",
                  align: "right",
                  render: (v) => (
                    <b style={{ color: v > 0 ? "red" : "green" }}>{v > 0 ? v : "OK"}</b>
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