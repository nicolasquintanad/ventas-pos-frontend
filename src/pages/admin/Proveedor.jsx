import { useEffect, useState } from "react";
import { Card, Table, Button, Space, Popconfirm, message, Input } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

import ProveedorModal from "../../components/modals/ProveedorModal";
import {
  getProveedores,
  createProveedores,
  updateProveedores,
  deleteProveedores
} from "../../api/proveedores";

export default function Proveedor() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [search, setSearch] = useState("");

  const loadData = async () => {
    try {
      const data = await getProveedores();
      setProviders(data);
    } catch {
      message.error("Error al cargar proveedores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const s = search.toLowerCase();

const filtered = providers.filter(p =>
  (p.nombre || "").toLowerCase().includes(s) ||
  (p.ciudad || "").toLowerCase().includes(s) ||
  (p.correo || "").toLowerCase().includes(s) ||
  (p.telefono || "").toLowerCase().includes(s)
);

  const onCreate = async (values) => {
    try {
      const payload = {
        NOMBRE: values.nombre,
        TELEFONO: values.telefono,
        CORREO: values.correo,
        DIRECCION: values.direccion,
        CIUDAD: values.ciudad,
      
        VISITA_LUNES: values.VISITA_LUNES ?? false,
        VISITA_MARTES: values.VISITA_MARTES ?? false,
        VISITA_MIERCOLES: values.VISITA_MIERCOLES ?? false,
        VISITA_JUEVES: values.VISITA_JUEVES ?? false,
        VISITA_VIERNES: values.VISITA_VIERNES ?? false,
        VISITA_SABADO: values.VISITA_SABADO ?? false,
        VISITA_DOMINGO: values.VISITA_DOMINGO ?? false,
      };

      await createProveedores(values);
      message.success("Proveedor creado");
      setModalOpen(false);
      loadData();
    } catch {
      /* popup ya manejado globalmente */
    }
  };

  const onEdit = async (values) => {
    try {
      const payload = {
        NOMBRE: values.nombre,
        TELEFONO: values.telefono,
        CORREO: values.correo,
        DIRECCION: values.direccion,
        CIUDAD: values.ciudad,
      
        VISITA_LUNES: values.VISITA_LUNES ?? false,
        VISITA_MARTES: values.VISITA_MARTES ?? false,
        VISITA_MIERCOLES: values.VISITA_MIERCOLES ?? false,
        VISITA_JUEVES: values.VISITA_JUEVES ?? false,
        VISITA_VIERNES: values.VISITA_VIERNES ?? false,
        VISITA_SABADO: values.VISITA_SABADO ?? false,
        VISITA_DOMINGO: values.VISITA_DOMINGO ?? false,
      };
      await updateProveedores(editing.id, values);
      message.success("Proveedor actualizado");
      setModalOpen(false);
      setEditing(null);
      loadData();
    } catch {}
  };

  const onDelete = async (id) => {
    try {
      await deleteProveedores(id);
      message.success("Proveedor eliminado");
      loadData();
    } catch {}
  };

  const columns = [
    { title: "Nombre", dataIndex: "nombre" },
    { title: "Teléfono", dataIndex: "telefono" },
    { title: "Correo", dataIndex: "correo" },
    { title: "Dirección", dataIndex: "direccion" },
    { title: "Ciudad", dataIndex: "ciudad" },
    {
      title: "Visitas",
      render: (_, p) => {
        const dias = [];
    
        if (p.VISITA_LUNES) dias.push("Lun");
        if (p.VISITA_MARTES) dias.push("Mar");
        if (p.VISITA_MIERCOLES) dias.push("Mié");
        if (p.VISITA_JUEVES) dias.push("Jue");
        if (p.VISITA_VIERNES) dias.push("Vie");
        if (p.VISITA_SABADO) dias.push("Sáb");
        if (p.VISITA_DOMINGO) dias.push("Dom");
    
        return dias.length === 0 ? "—" : dias.join(", ");
      }
    },
    {
      title: "Acciones",
      render: (_, row) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditing(row);
              setModalOpen(true);
            }}
          />
          <Popconfirm
            title="¿Eliminar proveedor?"
            onConfirm={() => onDelete(row.id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
    
  ];

  return (
    <Card title="Proveedores" style={{ margin: 20 }}>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => { setEditing(null); setModalOpen(true); }}
      >
        Nuevo Proveedor
      </Button>

      <Input
        placeholder="Buscar proveedor..."
        style={{ width: 250, marginLeft: 20 }}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Table
        scroll={{ x: "max-content" }}
        style={{ marginTop: 20 }}
        loading={loading}
        dataSource={filtered}
        columns={columns}
        rowKey="id"
      />

<ProveedorModal
  open={modalOpen}
  proveedor={editing} // 👈 CAMBIO: debe llamarse igual que en el modal
  onClose={() => { 
    setModalOpen(false); 
    setEditing(null);   // Limpia la edición
  }}
  onSubmit={editing ? onEdit : onCreate}
/>
    </Card>
  );
}