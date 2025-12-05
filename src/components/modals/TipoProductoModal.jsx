import { Modal, Form, Input, Switch } from "antd";
import { useEffect } from "react";

export default function TipoProductoModal({ open, initial, onCancel, onOk }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      if (initial) {
        form.setFieldsValue(initial); // ← cargar datos al editar
      } else {
        form.resetFields(); // ← limpiar al crear uno nuevo
      }
    }
  }, [open, initial, form]);

  return (
    <Modal
      open={open}
      title={initial ? "Editar Tipo de Producto" : "Nuevo Tipo de Producto"}
      okText="Guardar"
      cancelText="Cancelar"
      onCancel={onCancel}
      onOk={() => form.submit()}
    >
      <Form
        layout="vertical"
        form={form}
        initialValues={initial}
        onFinish={onOk}
      >
        <Form.Item
          label="Nombre"
          name="NOMBRE"
          rules={[{ required: true, message: "El nombre es obligatorio" }]}
        >
          <Input placeholder="Ej: Bebidas, Abarrotes, Snacks" />
        </Form.Item>

        <Form.Item
          label="Es Cigarrillo"
          name="cigarrillo"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
}