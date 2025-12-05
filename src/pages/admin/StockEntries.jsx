import { useEffect, useState } from "react";
import {
  Card,
  Form,
  Select,
  DatePicker,
  InputNumber,
  Button,
  Table,
  Space,
  message,
} from "antd";
import dayjs from "dayjs";
import { getProducts } from "../../api/products";
import {
  getProveedores,
  getStockEntries,
  createStockEntry,
} from "../../api/stock";
import { useAuth } from "../../context/AuthContext";
import { anularEntradaStock } from "../../api/stock";
import { Popconfirm } from "antd";
import { getStockProducto } from "../../api/products";
import QuickProductModal from "../../components/modals/QuickProductModal";
import { createProduct } from "../../api/products";


const { RangePicker } = DatePicker;

export default function StockEntries() {
  const [formFiltros] = Form.useForm();
  const [formEntrada] = Form.useForm();

  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [entradas, setEntradas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  const [stockActual, setStockActual] = useState(null);

  const { user } = useAuth(); // debe tener user.id

  const [showModalNuevo, setShowModalNuevo] = useState(false);
const [nuevoSKU, setNuevoSKU] = useState(null);
const [loadingNuevoProd, setLoadingNuevoProd] = useState(false);

  const cargarCombos = async () => {
    try {
      const [prod, prov] = await Promise.all([
        getProducts(),
        getProveedores(),
      ]);
      setProductos(prod);
      setProveedores(prov);
    } catch {
      message.error("Error al cargar productos/proveedores");
    }
  };

  const cargarEntradas = async (filtros = {}) => {
    try {
      setLoading(true);
      const data = await getStockEntries(filtros);
      setEntradas(data);
    } catch {
      message.error("Error al cargar entradas de stock");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCombos();
    cargarEntradas();
  }, []);

  const onBuscar = () => {
    const values = formFiltros.getFieldsValue();
    const filtros = {};

    if (values.rangoFechas && values.rangoFechas.length === 2) {
      filtros.desde = values.rangoFechas[0].format("YYYY-MM-DD");
      filtros.hasta = values.rangoFechas[1].format("YYYY-MM-DD");
    }

    if (values.idProducto) filtros.idProducto = values.idProducto;
    if (values.idProveedor) filtros.idProveedor = values.idProveedor;

    cargarEntradas(filtros);
  };

  const onRegistrarEntrada = async (values) => {
    if (!user || !user.id) {
      message.error("No se encontró el usuario logueado");
      return;
    }

    const payload = {
        ID_PRODUCTO: values.idProducto,
        ID_PROVEEDOR: values.idProveedor,
        CANTIDAD: values.cantidad,
        ID_USUARIO: user.id
      };

    try {
      setLoadingSave(true);
      await createStockEntry(payload);
      message.success("Entrada registrada y stock actualizado");
      formEntrada.resetFields();
      cargarEntradas();
    } catch {
      message.error("Error al registrar entrada");
    } finally {
      setLoadingSave(false);
    }
  };

  const columns = [
    {
        title: "Fecha",
        dataIndex: "fecha",
        render: (val, row) => (
          <span style={{ color: row.anulada ? "red" : "inherit" }}>
            {dayjs(val).format("DD-MM-YYYY HH:mm")}
          </span>
        ),
    },
    { title: "Producto", dataIndex: "producto" },
    { title: "Proveedor", dataIndex: "proveedor" },
    {
      title: "Cantidad",
      dataIndex: "cantidad",
    },
    { title: "Usuario", dataIndex: "usuario" },
    {
        title: "Acciones",
        render: (row) =>
          !row.anulada && user.role === "admin" ? (
            <Popconfirm
              title="¿Anular entrada?"
              onConfirm={async () => {
                try {
                  await anularEntradaStock(row.id, user.id);
                  message.success("Entrada anulada");
                  cargarEntradas();
                } catch {
                  message.error("No autorizado o error en anulación");
                }
              }}
              okText="Sí"
              cancelText="No"
            >
              <Button danger size="small">Anular</Button>
            </Popconfirm>
          ) : row.anulada ? (
            <span style={{ color: "red" }}>ANULADA</span>
          ) : null,
      }
  ];

  return (
    <Card title="Entrada de Stock" style={{ margin: 20 }}>
      {/* Filtros */}
      <Card
        size="small"
        title="Filtros"
        style={{ marginBottom: 20 }}
      >
        <Form
          layout="inline"
          form={formFiltros}
          initialValues={{
            rangoFechas: [],
          }}
        >
          
          <Form.Item name="idProducto" label="Producto">
            <Select
              allowClear
              style={{ width: 200 }}
              placeholder="Seleccione producto"
              options={productos.map((p) => ({
                value: p.id,
                label: p.name,
              }))}
            />
          </Form.Item>

          <Form.Item name="idProveedor" label="Proveedor">
            <Select
              allowClear
              style={{ width: 200 }}
              placeholder="Seleccione proveedor"
              options={proveedores.map((p) => ({
                value: p.id,
                label: p.nombre,
              }))}
            />
          </Form.Item>

          <Form.Item name="rangoFechas" label="Rango fechas">
            <RangePicker format="DD-MM-YYYY" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" onClick={onBuscar}>
                Buscar
              </Button>
              <Button
                onClick={() => {
                  formFiltros.resetFields();
                  cargarEntradas();
                }}
              >
                Limpiar
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      {/* Formulario de entrada */}
      <Card
        size="small"
        title="Registrar nueva entrada"
        style={{ marginBottom: 20 }}
      >
        <Form
          layout="inline"
          form={formEntrada}
          onFinish={onRegistrarEntrada}
        >
          <Form.Item 
          name="sku"
          label="SKU" 
          rules={[{ required: true, message: "Ingrese SKU" }]}
          >
  <input
  autoComplete="off"
  autoCorrect="off"
  autoSave="off"
  spellCheck="false"
    placeholder="Escanear/Ingresar SKU"
    style={{ width: 180, padding: 5 }}
    onKeyDown={async (e) => {
      if (e.key === "Enter") {
        const sku = e.target.value.trim();
        if (!sku) return;

        // Buscar si existe
        const producto = productos.find(p => p.sku === sku);

        if (producto) {
          formEntrada.setFieldsValue({ idProducto: producto.id });
          const data = await getStockProducto(producto.id);
          setStockActual(data.stock);
        } else {
          // 👉 No existe, mostrar modal
          setNuevoSKU(sku);
          setShowModalNuevo(true);
        }

        e.target.value = "";
      }
    }}
  />
</Form.Item>
          <Form.Item
            name="idProducto"
            label="Producto"
            rules={[{ required: true, message: "Seleccione producto" }]}
          >
            <Select
  showSearch
  placeholder="Producto"
  style={{ width: 220 }}
  optionFilterProp="label"
  filterOption={(input, option) =>
    option.label.toLowerCase().includes(input.toLowerCase()) ||
    option.sku?.toLowerCase().includes(input.toLowerCase())
  }
  options={productos.map(p => ({
    value: p.id,
    label: `${p.name} (${p.sku})`,
    sku: p.sku
  }))}
  onChange={async (idProducto) => {
    const prod = productos.find(p => p.id === idProducto);

    // 📌 Setear SKU automáticamente
    formEntrada.setFieldsValue({ sku: prod.sku });

    // 📌 Obtener stock actual
    try {
      const data = await getStockProducto(idProducto);
      setStockActual(data.stock);
    } catch {
      setStockActual(null);
    }
  }}
/>
          </Form.Item>
          {stockActual !== null && (
  <div style={{ marginTop: 5, fontWeight: "bold", color: "#1890ff" }}>
    Stock actual: {stockActual}
  </div>
)}
          <Form.Item
            name="idProveedor"
            label="Proveedor"
            rules={[{ required: true, message: "Seleccione proveedor" }]}
          >
            <Select
              style={{ width: 220 }}
              placeholder="Proveedor"
              options={proveedores.map((p) => ({
                value: p.id,
                label: p.nombre,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="cantidad"
            label="Cantidad"
            rules={[{ required: true, message: "Ingrese cantidad" }]}
          >
            <InputNumber
              min={0}
              step={0.001}
              style={{ width: 120 }}
            />
          </Form.Item>
          
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loadingSave}
            >
              Registrar
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* Tabla historial */}
      <Table
        scroll={{ x: "max-content" }}
        loading={loading}
        dataSource={entradas}
        columns={columns}
        rowKey="id"
      />
      <QuickProductModal
  open={showModalNuevo}
  sku={nuevoSKU}
  onClose={() => setShowModalNuevo(false)}
  onSubmit={async (values) => {
    try {
      setLoadingNuevoProd(true);
      const nuevo = await createProduct({
        SKU: values.sku,
        NOMBRE: values.name,
        DESCRIPCION: values.description,
        PRECIO: values.priceUnit,
        STOCK: 0, // 👈 No llega stock aquí
        EXCENTO_IVA: values.exempt,
        ID_TIPO_PRODUCTO: values.typeId,
      });

      message.success("Producto creado");

      setShowModalNuevo(false);

      // Recargar combos y preseleccionar el nuevo producto
      await cargarCombos();
      formEntrada.setFieldsValue({ idProducto: nuevo.id });

      // Mostrar stock actual = 0
      setStockActual(0);

    } catch (e) {
      console.log(e);
      message.error("Error al crear producto nuevo");
    } finally {
      setLoadingNuevoProd(false);
    }
  }}
/>
    </Card>
    
  );
  
}