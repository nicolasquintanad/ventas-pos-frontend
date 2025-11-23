import { useState,useEffect } from "react";
import { Card, DatePicker, Table, Button, Select, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { getReporteProductos, getFiltrosReporteProductos  } from "../../api/reportes";
import { generarPDFProductos } from "../../utils/reporteProductosPDF";
import {
    BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer
  } from "recharts";


export default function ReportesProductos() {
  const { RangePicker } = DatePicker;

  const [data, setData] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const d = await getFiltrosReporteProductos();
        setProductos(d.productos);
        setProveedores(d.proveedores);
      } catch {
        message.error("No se pudieron cargar los filtros.");
      }
    };
    loadFilters();
  }, []);

  const [filtros, setFiltros] = useState({
    fecha: null,
    idProveedor: null,
    idProducto: null,
  });

  const columnas = [
    { title: "Producto", dataIndex: "Producto" },
    { title: "Proveedor", dataIndex: "Proveedor" },
    { title: "Cantidad Total", dataIndex: "CantidadTotal", render: v => v?.toLocaleString("es-CL") },
    { title: "Subtotal Total", dataIndex: "SubTotalTotal", render: v => `$${v?.toLocaleString("es-CL")}` },
    { title: "Precio Promedio", dataIndex: "PrecioPromedio", render: v => `$${v?.toLocaleString("es-CL")}` },
  ];

  const buscar = async () => {
    if (!filtros.fecha) return message.warning("Seleccione un rango de fechas");

    const [inicio, fin] = filtros.fecha;
    const params = {
      inicio,
      fin,
      idProveedor: filtros.idProveedor,
      idProducto: filtros.idProducto
    };

    try {
      const resp = await getReporteProductos(params);
      setData(resp.detalle);
    } catch {
      message.error("No se pudo obtener el reporte");
    }
  };

  return (
    <Card title="Reporte Consolidado de Productos Vendidos">
      <div style={{ display: "flex", gap: 10, marginBottom: 15 }}>
        <RangePicker showTime onChange={(v) => setFiltros({ ...filtros, fecha: v })} />

        <Select placeholder="Proveedor" style={{ width: 200 }}
          onChange={(v) => setFiltros({ ...filtros, idProveedor: v })}
          options={[{ value: null, label: "Todos" }, ...proveedores.map(p => ({
            value: p.id,
            label: p.name
          }))]} />

        <Select placeholder="Producto" style={{ width: 200 }}
          onChange={(v) => setFiltros({ ...filtros, idProducto: v })}
          options={[{ value: null, label: "⏺ Todos" }, ...productos.map(p => ({
            value: p.id,
            label: p.name
          }))]} />

        <Button type="primary" icon={<SearchOutlined />} onClick={buscar}>Buscar</Button>
        {/* <Button type="default" onClick={() => generarPDFProductos(data, filtros.fecha ? `${filtros.fecha[0].format("DD/MM/YYYY")} - ${filtros.fecha[1].format("DD/MM/YYYY")}` : "-")}>
            PDF Ticket
        </Button> */}
        <Button onClick={() => setFiltros({ fecha: null, idProveedor: null, idProducto: null })}>
            Limpiar Filtros
        </Button>
      </div>

      <Table dataSource={data} columns={columnas} rowKey={(r, i) => i} />
      <h3 style={{ marginTop: 30 }}>📈 Gráfico Mix: Cantidad vs Total</h3>
<div style={{ width: "100%", height: 350 }}>
  <ResponsiveContainer>
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="Producto" />
      <YAxis yAxisId="left" orientation="left" label={{ value: 'Cantidad', angle: -90, position: 'insideLeft' }} />
      <YAxis yAxisId="right" orientation="right" label={{ value: 'Subtotal', angle: 90, position: 'insideRight' }} />
      <Tooltip />
      <Legend />

      <Bar yAxisId="left" dataKey="CantidadTotal" fill="#4287f5" name="Cantidad Vendida" />

      <Line yAxisId="right" type="monotone" dataKey="SubTotalTotal" stroke="#ff7300" name="Subtotal ($)" />
    </BarChart>
  </ResponsiveContainer>
</div>
    </Card>
    
  );
  
}