import { useEffect, useState } from "react";
import { Card, Table, Button, Space, Popconfirm, message } from "antd";
import {
  getProductproductTypes,
  createProductType,
  updateProductType,
  deleteProductType
} from "../../api/products";

import TipoProductoModal from "../../components/modals/TipoProductoModal";

export default function TipoProducto() {
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const data = await getProductproductTypes();
      setLista(data);
    } catch {
      message.error("Error al cargar tipos de producto");
    }
    setLoading(false);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const columns = [
    { title: "ID", dataIndex: "id", width: 80 },
    { title: "Nombre", dataIndex: "name" },
    {
      title: "Cigarrillo",
      dataIndex: "cigarrillo",
      render: (v) => (v ? "Sí" : "No"),
    },
    {
      title: "Acciones",
      render: (_, row) => (
        <Space>
          <Button type="primary" onClick={() => { setEditing(row); setModalOpen(true); }}>
            Editar
          </Button>

          <Popconfirm
            title="¿Eliminar este tipo de producto?"
            onConfirm={async () => {
              try {
                await deleteProductType(row.id);
                message.success("Eliminado correctamente");
                cargarDatos();
              } catch {
                message.error("No se pudo eliminar");
              }
            }}
          >
            <Button danger>Eliminar</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const abrirNuevo = () => {
    setEditing(null);
    setModalOpen(true);
  };

  return (
    <Card title="Mantenedor de Tipo de Producto">
      <Button type="primary" style={{ marginBottom: 15 }} onClick={abrirNuevo}>
        Nuevo Tipo
      </Button>

      <Table
        scroll={{ x: "max-content" }}
        columns={columns}
        dataSource={lista}
        loading={loading}
        rowKey="id"
      />

      <TipoProductoModal
        key={editing ? editing.id : "nuevo"}
        open={modalOpen}
        initial={editing}
        onCancel={() => setModalOpen(false)}
        onOk={async (values) => {
          try {
            if (editing) {
              await updateProductType(editing.id, values);
              message.success("Actualizado correctamente");
            } else {
              await createProductType(values);
              message.success("Creado correctamente");
            }
            setModalOpen(false);
            cargarDatos();
          } catch {
            message.error("Error al guardar");
          }
        }}
      />
    </Card>
  );
}