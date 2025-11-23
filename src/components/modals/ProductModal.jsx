import { Modal, Form, Input, InputNumber, Select, Switch } from "antd";
import { useEffect, useState } from "react";
import { getProductproductTypes } from "../../api/products";

export default function ProductModal({ open, onClose, onSubmit, product }) {
  const [form] = Form.useForm();
  const [types, setTypes] = useState([]);

  useEffect(() => {
    getProductproductTypes().then(setTypes);
  }, []);

  useEffect(() => {
    if (open) {
      if (product) {
        form.setFieldsValue(product); // editar
      } else {
        form.resetFields(); // nuevo producto
      }
    }
  }, [open, product]);
  return (
    <Modal
      open={open}
      title={product ? "Editar Producto" : "Nuevo Producto"}
      okText={product ? "Guardar" : "Crear"}
      cancelText="Cancelar"
      onCancel={onClose}
      onOk={() => {
        form.validateFields().then(values => onSubmit(values));
      }}
    >
       <Form form={form} layout="vertical">
        
        <Form.Item label="SKU" name="sku" rules={[{ required: true }]}>
          <Input autoComplete="off"
  autoCorrect="off"
  autoSave="off"
  spellCheck="false" disabled={!!product?.sku} />
        </Form.Item>

        <Form.Item label="Nombre" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Descripción" name="description">
          <Input />
        </Form.Item>

        <Form.Item label="Precio" name="priceUnit" rules={[{ required: true }]}>
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Stock (U)" name="stockUnits" rules={[{ required: true }]}>
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Exento IVA" name="exempt" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item label="Tipo Producto" name="typeId" rules={[{ required: true }]}>
          <Select
            placeholder="Seleccione tipo"
            options={types.map(t => ({
              value: t.ID_TIPO_PRODUCTO ?? t.id,
              label: t.NOMBRE ?? t.name
            }))}
          />
        </Form.Item>

      </Form>
    </Modal>
  );
}