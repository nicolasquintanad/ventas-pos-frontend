import { useEffect, useState } from "react";
import { Card, Select, DatePicker, Button, Table, message, Row, Col } from "antd";
import { SearchOutlined, FilePdfOutlined } from "@ant-design/icons";
import { getReporteVentas, exportReporteExcel, exportReportePdf } from "../../api/reportes";
import { getUsuarios } from "../../api/usuarios";
import { getCajas } from "../../api/caja";
import { getProveedores } from "../../api/proveedores";
import { getProducts } from "../../api/products";
import dayjs from "dayjs";

export default function Reportes() {
  const [usuarios, setUsuarios] = useState([]);
  const [cajas, setCajas] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);

  const [filtros, setFiltros] = useState({
    fecha: null,
    idUsuario: null,
    idCaja: null,
    idProveedor: null,
    idProducto: null,
  });

  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const { RangePicker } = DatePicker;

  const buildParams = () => {
    if (!filtros.fecha) return null;
  
    const [inicio, fin] = filtros.fecha;
    return {
      inicio,
      fin,
      idUsuario: filtros.idUsuario,
      idCaja: filtros.idCaja,
      idProducto: filtros.idProducto,
      idProveedor: filtros.idProducto ? null : filtros.idProveedor,
    };
  };
  
  const handleExportExcel = async () => {
    const params = buildParams();
    if (!params) {
      return message.warning("Seleccione un rango de fechas antes de exportar");
    }
  
    try {
      const res = await exportReporteExcel(params);
      const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ReporteVentas.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      message.error("No se pudo exportar a Excel");
    }
  };
  
  const handleExportPdf = async () => {
    const params = buildParams();
    if (!params) {
      return message.warning("Seleccione un rango de fechas antes de exportar");
    }
  
    try {
      const res = await exportReportePdf(params);
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ReporteVentas.pdf";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      message.error("No se pudo exportar a PDF");
    }
  };


  const loadFilters = async () => {
    try {
      const usuarios = await getUsuarios();
      const cajas = await getCajas();
      const productos = await getProducts();
      const proveedores = await getProveedores();
  
      setUsuarios(usuarios);
      setCajas(cajas);
      setProductos(productos);
      setProveedores(proveedores);
    } catch {
      message.error("Error cargando filtros");
    }
  };

  useEffect(() => {
    loadFilters();
  }, []);

  const buscar = async () => {
    if (!filtros.fecha)
      return message.warning("Seleccione un rango de fechas");
  
    const [inicio, fin] = filtros.fecha;
    const params = {
      inicio,
      fin,
      idUsuario: filtros.idUsuario,
      idCaja: filtros.idCaja,
      idProducto: filtros.idProducto,
      idProveedor: filtros.idProducto ? null : filtros.idProveedor,
    };
  
    try {
      const resp = await getReporteVentas(params);
  
      setData(resp.detalle.map(r => ({
        fecha: r.FECHA,
        usuario: r.Usuario,
        caja: r.Caja,
        producto: r.Producto,
        proveedor: r.Proveedor,
        cantidad: r.Cantidad,
        precio: r.PrecioUnitario,
        subTotal: r.SubTotal
      })));
  
      setTotal(resp.total);
  
    } catch {
      message.error("No se pudo obtener el reporte");
    }
  };

  const columnas = [
    { title: "Fecha", dataIndex: "fecha", render: v => (v === null || v === undefined || v === "" ? "-" : v) },
    { title: "Usuario", dataIndex: "usuario", render: v => (v === null || v === undefined || v === "" ? "-" : v) },
    { title: "Caja", dataIndex: "caja", render: v => (v === null || v === undefined || v === "" ? "-" : v) },
    { title: "Producto", dataIndex: "producto", render: v => (v === null || v === undefined || v === "" ? "-" : v) },
    { title: "Proveedor", dataIndex: "proveedor", render: v => (v === null || v === undefined || v === "" ? "-" : v) },
    { title: "Cantidad", dataIndex: "cantidad", render: v => v ?? 0 },
    {
      title: "SubTotal",
      dataIndex: "subTotal",
      render: (v) => `$${parseInt(v ?? 0).toLocaleString("es-CL")}`
    }
  ];

  return (
    <Card title="Reporte de Ventas">
      <Row gutter={16}>
        <Col span={6}>
        <RangePicker
  showTime
  style={{ width: "100%" }}
  value={filtros.fecha}
  onChange={(v) => setFiltros({ ...filtros, fecha: v })}
/>
        </Col>

        <Col span={4}>
        <Select
  placeholder="Usuario"
  style={{ width: "100%" }}
  value={filtros.idUsuario}
  onChange={(v) => setFiltros({ ...filtros, idUsuario: v })}
  allowClear
  options={usuarios.map(u => ({ value: u.id, label: u.name }))}
/>
        </Col>

        <Col span={4}>
        <Select
  placeholder="Caja"
  style={{ width: "100%" }}
  value={filtros.idCaja}
  onChange={(v) => setFiltros({ ...filtros, idCaja: v })}
  allowClear
  options={cajas.map(c => ({ value: c.ID_CAJA, label: c.NOMBRE }))}
/>
        </Col>

        <Col span={4}>
        <Select
  placeholder="Producto"
  style={{ width: "100%" }}
  value={filtros.idProducto}
  onChange={(v) => setFiltros({ ...filtros, idProducto: v })}
  allowClear
  options={productos.map(p => ({ value: p.id, label: p.name }))}
/>
        </Col>

        <Col span={4}>
        <Select
  placeholder="Proveedor"
  style={{ width: "100%" }}
  value={filtros.idProveedor}
  onChange={(v) => setFiltros({ ...filtros, idProveedor: v })}
  disabled={!!filtros.idProducto}
  allowClear
  options={(proveedores ?? []).map(p => ({
    value: p.id,
    label: p.nombre
  }))}
/>
        </Col>

        <Col span={4}>
          <Button type="primary" icon={<SearchOutlined />} onClick={buscar} style={{ width: "100%" }}>
            Buscar
          </Button>
        </Col>
        <Col span={4}>
  <Button
    icon={<FilePdfOutlined />}
    onClick={handleExportPdf}
    style={{ width: "100%" }}
  >
    Exportar PDF
  </Button>
</Col>

<Col span={4}>
  <Button
    onClick={handleExportExcel}
    style={{ width: "100%" }}
  >
    Exportar Excel
  </Button>
</Col>
        <Col span={4}>
        <Button
            style={{ width: "100%" }}
            danger
            onClick={() => {
            setFiltros({
                fecha: null,
                idUsuario: null,
                idCaja: null,
                idProveedor: null,
                idProducto: null,
            });
            setData([]);
            setTotal(0);
        }}
>
  Limpiar
</Button>
        </Col>
      </Row>

      <Table dataSource={data} scroll={{ x: "max-content" }} columns={columnas} rowKey={(_, i) => i} style={{ marginTop: 20 }} />

      <h2 style={{ textAlign: "right" }}>
  Total Ventas: ${ (total ?? 0).toLocaleString("es-CL") }
</h2>

    </Card>
  );
}