import { useEffect, useState } from "react";
import { Button, Table, Space, Popconfirm, message, Card, Tag, Input,Row, Col} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined,} from "@ant-design/icons";

import { getAlertColor } from "../../utils/alertColors";
import ProductModal from "../../components/modals/ProductModal";
import ModalKardex from "../../components/ModalKardex";
import { getKardexByProduct } from "../../api/kardex";
import { getProducts, createProduct, updateProduct, deleteProduct, getAlertasResumen  } from "../../api/products";
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


  //Filtro busqueda productos
  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.sku?.toLowerCase().includes(search.toLowerCase())
  );


  // Cargar datos
  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (e) {
      message.error("Error al obtener productos");
    } finally {
      setLoading(false);
    }
  };

  const verHistorial = async (idProducto) => {
    if (!idProducto) return message.error("Producto no válido");
    const data = await getKardexByProduct(idProducto);
    setKardexData(data);
    setOpenKardex(true);
  };

  useEffect(() => {
    loadData();
    getAlertasResumen().then(setResumen);
  }, []);

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
      loadData();
  
    } catch (error) {
      // ❗ NO hacemos message.error aquí
      // el interceptor ya lo mostró
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
      loadData();
    } catch {
      message.error("Error al eliminar producto");
    }
  };

  // Columnas de la tabla
  const columns = [
    { title: "SKU", dataIndex: "sku" },
    { title: "Nombre", dataIndex: "name" },
    {
      title: "Precio",
      dataIndex: "priceUnit",
      render: (val) => `$${val.toLocaleString("es-CL")}`,
    },
    { title: "Stock (U)", dataIndex: "stockUnits" },
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
    <Card title="Alertas de Stock - Resumen">
      <Row gutter={[10, 10]}>
        {resumen.map((r) => (
          <Col xs={10} md={5} key={r.nivel}>
            <Card>
              <Tag color={getAlertColor(r.nivel)} style={{ fontSize: 14 }}>
                {r.nivel.toUpperCase()}
              </Tag>
              <div style={{ fontSize: 25, fontWeight: "bold" }}>
                {r.cantidad}
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
    <Card style={{ margin: 20 }}>
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
      <Input
  placeholder="Buscar por SKU o nombre..."
  style={{ width: 300, marginTop: 20 }}
  onChange={(e) => setSearch(e.target.value)}
/>
      <Table
        pagination={{ pageSize: 10 }}
        scroll={{ x: "max-content" }}
        style={{ marginTop: 20 }}
        loading={loading}
        dataSource={filteredProducts}
        columns={columns}
        rowKey="id"
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
