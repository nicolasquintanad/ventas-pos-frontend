import { useEffect, useState } from "react";
import {
  Button,
  Table,
  Space,
  Popconfirm,
  message,
  Card,
  Tag,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import ProductModal from "../../components/modals/ProductModal";
import ModalKardex from "../../components/ModalKardex";
import { getKardexByProduct } from "../../api/kardex";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../api/products";
import api from "../../api/axios";

export default function Products() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [openKardex, setOpenKardex] = useState(false);
  const [kardexData, setKardexData] = useState([]);


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
        ID_TIPO_PRODUCTO: values.typeId ?? null
      };
      await createProduct(payload);
      message.success("Producto creado");
      setModalOpen(false);
      loadData();
    } catch {
      message.error("Error al crear producto");
    }
  };

  // Editar producto
  const onEdit = async (values) => {
    try {
      await updateProduct(editingProduct.id, values);
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

      <Table
        style={{ marginTop: 20 }}
        loading={loading}
        dataSource={products}
        columns={columns}
        rowKey="id"
      />

      {/* Modal */}
      <ProductModal
        open={modalOpen}
        product={editingProduct}
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
  );
}
