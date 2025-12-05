import { Modal, Form, Input, InputNumber, Select, Switch } from "antd";
import { useEffect, useState } from "react";
import { getProductproductTypes, getAlertasStock } from "../../api/products";

export default function ProductModal({ open, onClose, onSubmit, product,productos }) {
  const [form] = Form.useForm();
  const [types, setTypes] = useState([]);
  const [alertas, setAlertas] = useState([]);

  useEffect(() => {
    getProductproductTypes().then(setTypes);
    getAlertasStock().then(setAlertas)
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
      destroyOnClose
      maskClosable={false}
      onOk={() => {
        form.validateFields().then(values => onSubmit(values));
      }}
    >
       <Form form={form} layout="vertical">
        
       <Form.Item
  label="SKU"
  name="sku"
  rules={[
    { required: true, message: "Ingrese SKU" },
    ({ getFieldValue }) => ({
      async validator(_, value) {
        if (!value) return Promise.resolve();

        // 🚨 Validación de SKU repetido (excepto cuando edita y conserva el suyo)
        const exists = productos?.some(
          (p) => p.sku?.toLowerCase() === value.toLowerCase() &&
                 p.id !== (product?.id ?? null)
        );

        return exists
          ? Promise.reject("⚠️ Este SKU ya existe")
          : Promise.resolve();
      }
    })
  ]}
>
  <Input placeholder="Ej: 1122334455" />
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
        <Form.Item
          label="Nivel de alerta de stock"
          name="ID_ALERTA"
          rules={[{ required: true, message: "Seleccione un nivel de alerta" }]}
        >
          <Select placeholder="Seleccione nivel">
            {alertas.map(a => (
              <Select.Option key={a.id} value={a.id}>
                {a.nombre} ({a.unidades} unidades)
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

      </Form>
    </Modal>
  );
}