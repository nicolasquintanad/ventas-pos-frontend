import { Modal, Form, Input, Select } from "antd";
import { useEffect } from "react";

export default function UserModal({ open, onClose, onSubmit, user }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (user) form.setFieldsValue(user);
    else form.resetFields();
  }, [user]);

  return (
    <Modal
      open={open}
      title={user ? "Editar Usuario" : "Nuevo Usuario"}
      okText={user ? "Guardar" : "Crear"}
      cancelText="Cancelar"
      onCancel={onClose}
      onOk={() => {
        form
          .validateFields()
          .then((values) => onSubmit(values))
          .catch(() => {});
      }}
    >
      <Form form={form} layout="vertical">
        <Form.Item label="Nombre" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Correo" name="email" rules={[{ required: true }]}>
          <Input type="email" />
        </Form.Item>

        <Form.Item label="Rol" name="role" rules={[{ required: true }]}>
          <Select
            options={[
              { value: "admin", label: "Admin" },
              { value: "user", label: "Usuario" },
            ]}
          />
        </Form.Item>

        {!user && (
          <Form.Item
            label="Contraseña"
            name="password"
            rules={[{ required: true }]}
          >
            <Input.Password />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
}