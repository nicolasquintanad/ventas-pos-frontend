import { useEffect } from "react";
import { Modal, Form, Input,Checkbox } from "antd";
const days = [
  { label: "Lunes", name: "VISITA_LUNES" },
  { label: "Martes", name: "VISITA_MARTES" },
  { label: "Miércoles", name: "VISITA_MIERCOLES" },
  { label: "Jueves", name: "VISITA_JUEVES" },
  { label: "Viernes", name: "VISITA_VIERNES" },
  { label: "Sábado", name: "VISITA_SABADO" },
  { label: "Domingo", name: "VISITA_DOMINGO" },
];

export default function ProveedorModal({ open, proveedor, onSubmit, onClose }) {
  const [form] = Form.useForm();

  
  // Cuando se abre el modal, decide si cargar datos o limpiar
  // useEffect(() => {
  //   if (open) {
  //     if (proveedor) {
  //       // EDITAR — carga los datos
  //       form.setFieldsValue({
  //         nombre: proveedor.nombre,
  //         telefono: proveedor.telefono,
  //         correo: proveedor.correo,
  //         direccion: proveedor.direccion,
  //         ciudad: proveedor.ciudad
  //       });
  //     } else {
  //       // NUEVO — limpia campos
  //       form.resetFields();
  //     }
  //   }
  // }, [open, proveedor]);

  useEffect(() => {
    if (open) {
      if (proveedor) form.setFieldsValue(proveedor);
      else form.resetFields();
    }
  }, [open, proveedor]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSubmit(values);
      form.resetFields();
    });
  };

  return (
    <Modal
      open={open}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      destroyOnClose   // 👈 Importante para limpiar el modal al cerrar
      title={proveedor ? "Editar Proveedor" : "Nuevo Proveedor"}
      onOk={handleOk}
      okText="Guardar"
      cancelText="Cancelar"
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          name="nombre"
          label="Nombre"
          rules={[{ required: true, message: "Ingrese nombre" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="telefono" label="Teléfono">
          <Input />
        </Form.Item>

        <Form.Item name="correo" label="Correo">
          <Input type="email" />
        </Form.Item>

        <Form.Item name="direccion" label="Dirección">
          <Input />
        </Form.Item>

        <Form.Item name="ciudad" label="Ciudad">
          <Input />
        </Form.Item>
        <Form.Item label="Días de visita">
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {days.map((d) => (
              <Form.Item key={d.name} name={d.name} valuePropName="checked" noStyle>
                <Checkbox>{d.label}</Checkbox>
              </Form.Item>
            ))}
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
}