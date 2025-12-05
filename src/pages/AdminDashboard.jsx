import { Button, Card, Space, Tag, Table, Input  } from "antd";
import AdminLayout from "../Layouts/AdminLayout";
import { BarChartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getProductosCriticos } from "../api/products";
import { useEffect, useState } from "react";
import { getAlertColor } from "../utils/alertColors";
import { alertPriority } from "../utils/alertOrder";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [criticos, setCriticos] = useState([]);
  const [resumen, setResumen] = useState([]);
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");

  const filtered = rows.filter(p =>
    (p.nombre ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (p.sku ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (p.nivel ?? "").toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    load();
  }, []);
  const load = async () => {
    const data = await getProductosCriticos();

    // Ordenar por prioridad → crítico > alto > medio > bajo
    const sorted = data.sort((a, b) =>
      alertPriority[b.nivel.toLowerCase()] - alertPriority[a.nivel.toLowerCase()]
    );

    // Agregar columna "faltan"
    const withMissing = sorted.map((p) => ({
      ...p,
      falta: p.minimo - p.stock
    }));

    setRows(withMissing);
  };
  const columns = [
    {
      title: "Nivel",
      dataIndex: "nivel",
      render: (nivel) => (
        <Tag color={getAlertColor(nivel)} style={{ fontWeight: "bold" }}>
          {nivel.toUpperCase()}
        </Tag>
      ),
      sorter: (a, b) =>
        alertPriority[b.nivel.toLowerCase()] - alertPriority[a.nivel.toLowerCase()],
      defaultSortOrder: "descend"
    },
    {
      title: "Producto",
      dataIndex: "nombre",
      render: (v) => <b>{v}</b>,
      sorter: (a, b) => a.nombre.localeCompare(b.nombre)
    },
    { title: "SKU", dataIndex: "sku" },
    {
      title: "Stock",
      dataIndex: "stock",
      align: "center",
      sorter: (a, b) => a.stock - b.stock
    },
    {
      title: "Mínimo",
      dataIndex: "minimo",
      align: "center",
      sorter: (a, b) => a.minimo - b.minimo
    },
    {
      title: "Faltan",
      dataIndex: "falta",
      align: "center",
      render: (v) => (
        <b style={{ color: v > 0 ? "red" : "green" }}>
          {v > 0 ? v : "OK"}
        </b>
      ),
      sorter: (a, b) => a.falta - b.falta
    }
  ];

  return (
    <>
      {/* <Card title="Productos Críticos">
  {criticos.length === 0 ? (
    <p>No hay productos críticos</p>
  ) : (
    criticos.map((p) => (
      <Card key={p.id} style={{ marginBottom: 10 }}>
        <b>{p.nombre}</b>  
        <br />
        Stock actual: {p.stock}
        <br />
        Mínimo permitido: {p.minimo}
        <br />
        <Tag color={getAlertColor(p.nivel)}>{p.nivel}</Tag>
      </Card>
    ))
  )}
</Card> */}
<Card title="Estado de Stock por Nivel de Alerta" style={{ marginTop: 20 }}>
<Input.Search
  placeholder="Buscar por nombre, SKU o nivel..."
  allowClear
  onChange={(e) => setSearch(e.target.value)}
  style={{ marginBottom: 12, maxWidth: 350 }}
/>
      <Table
        size="small"
        dataSource={filtered}
        columns={columns}
        rowKey="id"
        pagination={false}
        scroll={{ x: "max-content" }}
      />
    </Card>

      <Card title="Reportes Rápidos">
        <Space direction="vertical" style={{ width: "100%" }}>
          <Button
            type="primary"
            icon={<BarChartOutlined />}
            onClick={() => navigate("/admin/reporte-productos")}
            block
          >
            Reporte Consolidado de Productos Vendidos
          </Button>
        </Space>
      </Card>
      </>
  );
}