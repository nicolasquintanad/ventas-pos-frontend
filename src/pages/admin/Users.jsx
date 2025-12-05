import { useEffect, useState } from "react";
import { Button, Table, Space, Popconfirm, message, Card, Modal, Form, Input, Select, Switch } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import UserModal from "../../components/modals/UserModal";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../api/users";
import { getUsuarios, crearUsuario, editarUsuario, cambiarEstadoUsuario } from "../../api/usuarios";

export default function Users() {
  const [usuarios, setUsuarios] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form] = Form.useForm();

  const roles = [
    { label: "Administrador", value: "admin" },
    { label: "Cajero", value: "cajero" },
    { label: "Pedido", value: "pedido" }
  ];

  const load = async () => {
    const data = await getUsuarios();
    setUsuarios(data);
  };

  useEffect(() => {
    load();
  }, []);

  const abrirCrear = () => {
    setEditando(null);
    form.resetFields();
    setModalOpen(true);
  };

  const abrirEditar = (record) => {
    setEditando(record);
  
    form.setFieldsValue({
      Nombre: record.NOMBRE,
      Username: record.USERNAME,
      Correo: record.CORREO,
      Rut: record.RUT,
      Rol: record.rol,
      Password: "" // vacío siempre al editar
    });
  
    setModalOpen(true);
  };

  const enviar = async () => {
    try {
      const values = await form.validateFields();

      if (editando) {
        await editarUsuario(editando.ID_USUARIO, values);
        message.success("Usuario actualizado");
      } else {
        await crearUsuario(values);
        message.success("Usuario creado");
      }

      setModalOpen(false);
      load();
    } catch (err) {
      message.error(err.response?.data || "Error en la operación");
    }
  };

  const cambiarEstado = async (record) => {
    await cambiarEstadoUsuario(record.ID_USUARIO);
    message.info("Estado actualizado");
    load();
  };

  const columnas = [
    { title: "Nombre", dataIndex: "NOMBRE" },
    { title: "Usuario", dataIndex: "USERNAME" },
    { title: "Correo", dataIndex: "CORREO" },
    { title: "RUT", dataIndex: "RUT" },
    { title: "Rol", dataIndex: "rol", render: (r) => r.toUpperCase() },
    {
      title: "Estado",
      dataIndex: "ACTIVO",
      render: (_, record) => (
        <Switch checked={record.ACTIVO} onChange={() => cambiarEstado(record)} />
      ),
    },
    {
      title: "Acciones",
      render: (_, record) => (
        <Button type="link" onClick={() => abrirEditar(record)}>
          Editar
        </Button>
      ),
    },
  ];

  return (
    <>
      <Button type="primary" style={{ marginBottom: 10 }} onClick={abrirCrear}>
        Nuevo Usuario
      </Button>

      <Table scroll={{ x: "max-content" }} columns={columnas} dataSource={usuarios} rowKey="ID_USUARIO" />

      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={enviar}
        title={editando ? "Editar Usuario" : "Nuevo Usuario"}
      >
        <Form layout="vertical" form={form}>
          <Form.Item label="Nombre" name="Nombre" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Usuario" name="Username" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Correo" name="Correo">
            <Input />
          </Form.Item>

          <Form.Item label="RUT" name="Rut">
            <Input />
          </Form.Item>

          <Form.Item label="Contraseña" name="Password"
            rules={editando ? [] : [{ required: true, message: "Ingrese contraseña" }]}>
            <Input.Password placeholder={editando ? "Dejar en blanco para no cambiar" : ""} />
          </Form.Item>

          <Form.Item label="Rol" name="Rol" rules={[{ required: true }]}>
            <Select options={roles} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}