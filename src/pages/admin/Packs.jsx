import { useEffect, useState } from "react";
import {
  Card,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Checkbox,
  Select,
  Table,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { getProducts } from "../../api/products";
import { getPacks, createPack, getPackDetails } from "../../api/packs";

export default function Packs() {
  const [packs, setPacks] = useState([]);
  const [productos, setProductos] = useState([]);
  const [visibleModal, setVisibleModal] = useState(false);
  const [visibleDetalle, setVisibleDetalle] = useState(false);

  const [formPack] = Form.useForm();
  const [detallePack, setDetallePack] = useState([]);
  const [detalles, setDetalles] = useState([]);

  const loadData = async () => {
    try {
      const packData = await getPacks();
      setPacks(packData);

      const prodData = await getProducts();
      setProductos(prodData);
    } catch {
      message.error("Error al cargar datos");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Agregar detalle al pack (producto + cantidad)
  const agregarDetalle = () => {
    const values = formPack.getFieldsValue();

    if (!values.productoTemp || !values.cantidadTemp) {
      return message.warning("Seleccione producto y cantidad");
    }

    const prod = productos.find((p) => p.id === values.productoTemp);

    setDetalles([
      ...detalles,
      {
        idProducto: prod.id,
        nombre: prod.name,
        cantidad: values.cantidadTemp,
      },
    ]);

    // Limpiar los campos temporales
    formPack.setFieldsValue({ productoTemp: null, cantidadTemp: null });
  };

  // Crear el pack
  const onSubmit = async (values) => {
    if (detalles.length === 0) {
      return message.warning("Agregue al menos un producto");
    }

    const data = {
      SKU_PACK: values.sku || null,
      NOMBRE_PACK: values.nombre,
      PRECIO_PACK: values.precio,
      EXCENTO_IVA: values.iva || false,
      Detalles: detalles.map((d) => ({
        ID_PRODUCTO: d.idProducto,
        CANTIDAD_PRODUCTO: d.cantidad,
      })),
    };

    try {
      await createPack(data);
      message.success("Pack creado correctamente");

      formPack.resetFields();
      setDetalles([]);
      setVisibleModal(false);
      loadData();
    } catch {
      message.error("Error al crear pack");
    }
  };

  // Ver detalles del pack
  const verDetallesPack = async (pack) => {
    try {
      const data = await getPackDetails(pack.ID_PACK);
      setDetallePack(data);
      setVisibleDetalle(true);
    } catch {
      message.error("Error al cargar detalles");
    }
  };

  const columns = [
    { title: "SKU", dataIndex: "SKU_PACK" },
    { title: "Nombre", dataIndex: "NOMBRE_PACK" },
    { title: "Precio", dataIndex: "PRECIO_PACK" },
    {
      title: "IVA Exento",
      dataIndex: "EXCENTO_IVA",
      render: (val) => (val ? "Sí" : "No"),
    },
    {
      title: "Acciones",
      render: (row) => (
        <Button size="small" onClick={() => verDetallesPack(row)}>
          Ver productos
        </Button>
      ),
    },
  ];

  return (
    <Card
      title="Packs de productos"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setVisibleModal(true)}>
          Crear pack
        </Button>
      }
      style={{ margin: 20 }}
    >
      <Table dataSource={packs} columns={columns} rowKey="ID_PACK" />

      {/* Modal crear pack */}
      <Modal
        title="Crear pack"
        open={visibleModal}
        onCancel={() => setVisibleModal(false)}
        onOk={() => formPack.submit()}
        okText="Guardar"
      >
        <Form form={formPack} layout="vertical" onFinish={onSubmit}>
          <Form.Item label="Nombre del Pack" name="nombre" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="SKU del Pack (opcional)" name="sku">
            <Input placeholder="Escanear código del pack o dejar vacío" />
          </Form.Item>

          <Form.Item label="Precio Pack" name="precio" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="iva" valuePropName="checked">
            <Checkbox>Exento de IVA</Checkbox>
          </Form.Item>

          <hr />

          {/* Productos del pack */}
          <Form.Item label="Producto" name="productoTemp">
            <Select
              placeholder="Seleccione producto"
              options={productos.map((p) => ({ value: p.id, label: p.name }))}
            />
          </Form.Item>

          <Form.Item label="Cantidad" name="cantidadTemp">
            <InputNumber min={0} step={0.001} style={{ width: "100%" }} />
          </Form.Item>

          <Button type="dashed" onClick={agregarDetalle} block>
            Agregar producto al pack
          </Button>

          <h4 style={{ marginTop: 15 }}>Productos agregados:</h4>
          <Table
            size="small"
            dataSource={detalles}
            columns={[
              { title: "Producto", dataIndex: "nombre" },
              { title: "Cantidad", dataIndex: "cantidad" },
            ]}
            rowKey="idProducto"
            pagination={false}
          />
        </Form>
      </Modal>

      {/* Modal detalles del pack */}
      <Modal
        title="Detalle del pack"
        open={visibleDetalle}
        onCancel={() => setVisibleDetalle(false)}
        footer={null}
      >
        <Table
          size="small"
          dataSource={detallePack}
          columns={[
            { title: "SKU", dataIndex: "sku" },
            { title: "Producto", dataIndex: "producto" },
            { title: "Cantidad", dataIndex: "cantidad" },
          ]}
          rowKey="sku"
        />
      </Modal>
    </Card>
  );
}