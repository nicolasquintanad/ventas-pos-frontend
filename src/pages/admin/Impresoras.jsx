import { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Switch, message, Select } from "antd";
import api from "../../api/axios";

export default function Impresoras() {
  const [data, setData] = useState([]);
  const [cajas, setCajas] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  // 🔹 cargar impresoras
  const load = async () => {
    const res = await api.get("api/impresoras");
    setData(res.data);
  };

  // 🔹 cargar cajas
  const loadCajas = async () => {
    const res = await api.get("/caja");
    setCajas(res.data);
  };

  useEffect(() => {
    load();
    loadCajas();
  }, []);

  // --- NUEVA IMPRESORA ---
  const openNew = () => {
    setEditing(null);
    form.resetFields();
    setOpen(true);
  };

  // --- EDITAR IMPRESORA ---
  const openEdit = (record) => {
    setEditing(record);

    form.setFieldsValue({
      NombreWindows: record.NombreWindows,
      Tipo: record.Tipo,
      Activa: record.Activa,
      IdCaja: record.IdCaja ?? null
    });

    setOpen(true);
  };

  // --- CERRAR MODAL ---
  const closeModal = () => {
    setOpen(false);
    setEditing(null);
    form.resetFields();
  };

  // --- GUARDAR ---
  const save = async () => {
    const values = await form.validateFields();

    if (editing) {
      await api.put(`api/impresoras/${editing.IdImpresora}`, values);
      message.success("Impresora actualizada");
    } else {
      await api.post("api/impresoras", values);
      message.success("Impresora creada");
    }

    closeModal();
    load();
  };

  // --- COLUMNAS TABLA ---
  const columns = [
    { title: "Nombre Windows", dataIndex: "NombreWindows" },
    { title: "Tipo", dataIndex: "Tipo" },
    {
      title: "Caja asociada",
      dataIndex: "NombreCaja",
      render: v => v ?? <i>Sin asignar</i>
    },
    {
      title: "Activa",
      dataIndex: "Activa",
      render: v => v ? "Sí" : "No"
    },
    {
      title: "Acciones",
      render: (_, r) => (
        <Button size="small" onClick={() => openEdit(r)}>
          Editar
        </Button>
      )
    }
  ];

  return (
    <>
      <Button type="primary" onClick={openNew}>
        Nueva impresora
      </Button>

      <Table
        rowKey="IdImpresora"
        columns={columns}
        dataSource={data}
        style={{ marginTop: 20 }}
      />

      <Modal
        open={open}
        onCancel={closeModal}
        onOk={save}
        title={editing ? "Editar impresora" : "Nueva impresora"}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="NombreWindows"
            label="Nombre en Windows"
            rules={[{ required: true }]}
          >
            <Input placeholder="XP-80" />
          </Form.Item>

          <Form.Item
            name="Tipo"
            label="Tipo"
            rules={[{ required: true }]}
          >
            <Input placeholder="TERMICA" />
          </Form.Item>

          {/* 🔹 SELECT CAJA */}
          <Form.Item
            name="IdCaja"
            label="Caja asociada"
          >
            <Select
              allowClear
              placeholder="Seleccione una caja"
              options={cajas.map(c => ({
                value: c.ID_CAJA,
                label: c.NOMBRE
              }))}
            />
          </Form.Item>

          <Form.Item
            name="Activa"
            label="Activa"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}