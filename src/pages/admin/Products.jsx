import { useEffect, useState, useRef  } from "react";
import { Button, Table, Space, Popconfirm, message, Card, Tag, Input,Row, Col, Select, Spin } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined,} from "@ant-design/icons";

import { getAlertColor } from "../../utils/alertColors";
import ProductModal from "../../components/modals/ProductModal";
import ModalKardex from "../../components/ModalKardex";
import { getKardexByProduct } from "../../api/kardex";
import { getProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  getAlertasResumen, 
  getProductproductTypes, 
  getProveedores,
  getProductsPaged,
  exportProductsExcel 
  } from "../../api/products";
import api from "../../api/axios";

export default function Products() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [openKardex, setOpenKardex] = useState(false);
  const [kardexData, setKardexData] = useState([]);
  const [search, setSearch] = useState("");
  const [resumen, setResumen] = useState([]);
  const [tipoProductoId, setTipoProductoId] = useState(null);
const [proveedorId, setProveedorId] = useState(null);
const [tiposProducto, setTiposProducto] = useState([]);
const [proveedores, setProveedores] = useState([]);
const [page, setPage] = useState(1);
const [pageSize, setPageSize] = useState(10);
const [total, setTotal] = useState(0);
const [sortField, setSortField] = useState("NOMBRE");
const [sortOrder, setSortOrder] = useState("asc");
const cacheRef = useRef({});
const [isSearching, setIsSearching] = useState(false);
const [hasSearched, setHasSearched] = useState(false);


  //Filtro busqueda productos
  // const filteredProducts = products.filter(p =>
  //   p.name?.toLowerCase().includes(search.toLowerCase()) ||
  //   p.sku?.toLowerCase().includes(search.toLowerCase())
  // );
  

  // Cargar datos
  const loadData = async (
    pageCurrent = page,
    pageSizeCurrent = pageSize
  ) => {
    try {
      setLoading(true);
      setIsSearching(true);
      const cacheKey = JSON.stringify({
        search,
        tipoProductoId,
        proveedorId,
        page: pageCurrent,
        pageSize: pageSizeCurrent,
        sortField,
        sortOrder
      });

      if (cacheRef.current[cacheKey]) {
        const cached = cacheRef.current[cacheKey];
      
        setProducts(cached.data);
        setTotal(cached.total);
        setPage(pageCurrent);
        setPageSize(pageSizeCurrent);
      
        return; // NO llamar backend
      }
     
  
      const resp = await getProductsPaged({
        search,
        tipoId: tipoProductoId,
        proveedorId,
        page: pageCurrent,
        pageSize: pageSizeCurrent,
        sortField,
        sortOrder
      });
  
      setProducts(resp.data);
      setTotal(resp.total);
      setPage(resp.page);
      setPageSize(resp.pageSize);
  
      cacheRef.current[cacheKey] = {
        data: resp.data,
        total: resp.total
      };

    } catch {
      message.error("Error al obtener productos");
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  const verHistorial = async (idProducto) => {
    if (!idProducto) return message.error("Producto no válido");
    const data = await getKardexByProduct(idProducto);
    setKardexData(data);
    setOpenKardex(true);
  };

  useEffect(() => {
    getAlertasResumen().then(setResumen);
    getProductproductTypes().then(setTiposProducto);
    getProveedores().then(setProveedores);
  }, []);

  useEffect(() => {
    if (!search && !tipoProductoId && !proveedorId) {
      setHasSearched(false);
      setProducts([]);
      setTotal(0);
      return;
    }
  
    const timer = setTimeout(() => {
      setHasSearched(true);   // 🔥 CLAVE
      loadData(1, pageSize);
    }, 400);
  
    return () => clearTimeout(timer);
  }, [search, tipoProductoId, proveedorId, sortField, sortOrder]);

  // Crear producto
  const onCreate = async (values) => {
    try {
      const payload = {
        SKU: values.sku,
        NOMBRE: values.name,
        DESCRIPCION: values.description ?? "",
        PRECIO: values.priceUnit,
        STOCK: values.stockUnits,
        EXCENTO_IVA: values.exempt ?? false,
        ID_TIPO_PRODUCTO: values.typeId ?? null,
        ID_ALERTA: values.ID_ALERTA,
        ID_PROVEEDOR: values.ID_PROVEEDOR
      };
  
      await createProduct(payload);
      message.success("Producto creado");
      setModalOpen(false);
      cacheRef.current = {};
      loadData();
  
    } catch (error) {
      // ❗ NO hacemos message.error aquí
      // el interceptor ya lo mostró
    }
  };
  
  //EXCEL
  const exportarExcel = async () => {
    try {
      const resp = await exportProductsExcel({
        search,
        tipoId: tipoProductoId,
        proveedorId,
        sortField,
        sortOrder
      });
  
      const blob = new Blob([resp.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      });
  
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Productos.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
  
    } catch {
      message.error("Error al exportar Excel");
    }
  };

  // Editar producto
  const onEdit = async (values) => {
    try {
        const payload = {
          SKU: values.sku,
          NOMBRE: values.name,
          DESCRIPCION: values.description ?? "",
          PRECIO: values.priceUnit,
          STOCK: values.stockUnits,
          EXCENTO_IVA: values.exempt ?? false,
          ID_TIPO_PRODUCTO: values.typeId ?? null,
          ID_ALERTA: values.ID_ALERTA,  // ← 🔥 FALTABA
          ID_PROVEEDOR: values.ID_PROVEEDOR
        };
      await updateProduct(editingProduct.id, payload);

      message.success("Producto actualizado");
      setModalOpen(false);
      setEditingProduct(null);
      cacheRef.current = {};
      loadData();
    } catch {
      message.error("Error al actualizar producto");
    }
  };

  // Eliminar producto
  const onDelete = async (id) => {
    try {
      await deleteProduct(id);
      message.success("Producto eliminado");
      cacheRef.current = {};
      loadData();
    } catch {
      message.error("Error al eliminar producto");
    }
  };

  // Columnas de la tabla
  const columns = [
    { title: "SKU", dataIndex: "sku", sorter: true },
    { title: "Nombre", dataIndex: "name", sorter: true },
    {
      title: "Precio",
      dataIndex: "priceUnit",
      sorter: true,
      render: (val) => `$${val.toLocaleString("es-CL")}`,
    },
    { title: "Stock (U)", dataIndex: "stockUnits", sorter: true },
    {
      title: "Tipo",
      dataIndex: "typeName",
      render: (text) =>
        text ? <Tag color="blue">{text}</Tag> : <Tag>Sin tipo</Tag>,
    },
    {
      title: "Exento IVA",
      dataIndex: "exempt",
      render: (val) =>
        val ? <Tag color="green">Sí</Tag> : <Tag color="red">No</Tag>,
    },
    {
      title: "Alerta Stock",
      dataIndex: "alertaNombre",
      render: (value) =>
        value ? (
          <Tag color={getAlertColor(value)} style={{ fontWeight: "bold" }}>
            {value}
          </Tag>
        ) : (
          <Tag>Sin nivel</Tag>
      ),
    },
    {
      title: "Proveedor",
      dataIndex: "proveedorNombre",
      render: (v) => v || "—"
    },
    {
      title: "Acciones",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingProduct(record);
              setModalOpen(true);
            }}
          />
          <Button onClick={() => verHistorial(record.id)} style={{ marginLeft: 5 }}>
            Historial
          </Button>
          <Popconfirm
            title="¿Eliminar producto?"
            okText="Si"
            cancelText="No"
            onConfirm={() => onDelete(record.id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
        
      ),
      
        // title: "Acciones",
        // render: (_, record) => (
        //   <div>
        //     console.log(record);
        //     <Button onClick={() => editarProducto(record)}>Editar</Button>
        //     <Button onClick={() => verHistorial(record.ID_PRODUCTO)} style={{ marginLeft: 5 }}>
        //       Historial
        //     </Button>
        //   </div>
        // )
      
    },
    
  ];

  return (
    <>
    <Card bodyStyle={{ padding: '7px' }}>
      <Row gutter={[2, 5]}>
        {resumen.map((r) => (
          <Col xs={4} md={3}  key={r.nivel}>
            <Card bodyStyle={{ padding: '7px' }}>
              <Tag color={getAlertColor(r.nivel)} style={{ fontSize: 8, fontWeight: "bold"}}>
                {r.nivel.toUpperCase()}
              </Tag>
              <div style={{ fontSize: 15, fontWeight: "bold" }}>
                {r.cantidad}
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
    <Card style={{ margin: 1 }}>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          setEditingProduct(null);
          setModalOpen(true);
        }}
      >
        Nuevo Producto
      </Button>
      <Row gutter={10} style={{ marginTop: 5 }}>
      <Col>
    <Input
      allowClear
      placeholder="Buscar (SKU, nombre, proveedor, tipo...)"
      style={{ width: 260 }}
      onChange={(e) => setSearch(e.target.value)}
      suffix={isSearching ? <Spin size="small" /> : null}
    />
  </Col>

  <Col>
    <Select
      allowClear
      placeholder="Tipo producto"
      style={{ width: 150 }}
      options={tiposProducto.map(t => ({
        value: t.id,
        label: t.name
      }))}
      onChange={setTipoProductoId}
    />
  </Col>

  <Col>
    <Select
      allowClear
      placeholder="Proveedor"
      style={{ width: 200 }}
      options={proveedores.map(p => ({
        value: p.id,
        label: p.nombre
      }))}
      onChange={setProveedorId}
    />
  </Col>
</Row>
      {/* <Input
  placeholder="Buscar por SKU o nombre..."
  style={{ width: 300, marginTop: 20 }}
  onChange={(e) => setSearch(e.target.value)}
/> */}
<Button
  style={{ marginLeft: 10 }}
  onClick={exportarExcel}
>
  Exportar Excel
</Button>
<Table
  loading={loading}
  dataSource={hasSearched ? products : []}
  columns={columns}
  rowKey="id"
  locale={{
    emptyText: hasSearched
      ? "No se encontraron productos"
      : "Ingrese un criterio de búsqueda o filtro"
  }}
  onChange={(pagination, filters, sorter) => {
    if (sorter && sorter.field) {
      setSortField(
        sorter.field === "priceUnit" ? "PRECIO" :
        sorter.field === "stockUnits" ? "STOCK" :
        sorter.field === "sku" ? "SKU" :
        "NOMBRE"
      );
      setSortOrder(sorter.order === "descend" ? "desc" : "asc");
    }
  }}
  pagination={{
    current: page,
    pageSize,
    total,
    showSizeChanger: true,
    onChange: (p, ps) => {
      if (!hasSearched) return;
      loadData(p, ps);
    }
  }}
/>
      
      {/* Modal */}
      <ProductModal
        open={modalOpen}
        maskClosable={false}
  destroyOnClose
        product={editingProduct}
        productos={products}
        onClose={() => {
          setModalOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={editingProduct ? onEdit : onCreate}
      />
      <ModalKardex
  visible={openKardex}
  onClose={() => setOpenKardex(false)}
  data={kardexData}
/>
    </Card>

    
    </>
  );
}
