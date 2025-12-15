import { useEffect, useState, useRef } from "react";
import {
  Card,
  Table,
  Button,
  Select,
  InputNumber,
  message,
  Space,
  Modal,
  Tag,
  Divider,
} from "antd";
import {
  ShoppingCartOutlined,
  PlusCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import { getProducts } from "../../api/products";
import { getPacks } from "../../api/packs";
import { useAuth } from "../../context/AuthContext";
import { createSale } from "../../api/sales";
import Ticket from "../../components/Ticket";
import { getCajaActiva } from "../../api/caja";

export default function Sales() {
  const [productos, setProductos] = useState([]);
  const [idSeleccion, setIdSeleccion] = useState(null);
  const [cantidad, setCantidad] = useState(null);
  const [carrito, setCarrito] = useState([]);
  const [cajaActiva, setCajaActiva] = useState(null);
  const [ticket, setTicket] = useState(null);
  const [procesandoVenta, setProcesandoVenta] = useState(false);
  const [modalConfirmar, setModalConfirmar] = useState(false);

  const { user } = useAuth();
  const barcodeRef = useRef(null);
  const selectRef = useRef(null);

  // ===============================
  // LOAD DATA
  // ===============================
  const loadData = async () => {
    try {
      const [p, pk] = await Promise.all([getProducts(), getPacks()]);

      const allItems = [
        ...p.map(x => ({
          tipo: "producto",
          id: x.id,
          sku: x.sku,
          nombre: x.name,
          precio: x.priceUnit,
          exento: x.exempt ?? x.excentoIva,
          esPack: false,
          typeName: x.typeName,
          stockUnits: x.stockUnits,
        })),
        ...pk.map(x => ({
          tipo: "pack",
          id: x.ID_PACK,
          sku: x.SKU_PACK,
          nombre: x.NOMBRE_PACK,
          precio: x.PRECIO_PACK,
          exento: x.EXCENTO_IVA,
          esPack: true,
          typeName: x.typeName,
          stockPack: x.STOCK_PACK || 0,
        })),
      ];

      setProductos(allItems);
    } catch {
      message.error("Error cargando productos o packs");
    }
  };

  useEffect(() => {
    loadData();
    getCajaActiva(user.id).then(setCajaActiva);
    setTimeout(() => barcodeRef.current?.focus(), 300);

    const handleClick = (e) => {
      const tag = e.target.tagName.toLowerCase();
      if (["input", "textarea", "select", "button", "svg", "path"].includes(tag)) return;
      barcodeRef.current?.focus();
    };

    window.addEventListener("click", handleClick);
    window.onbeforeunload = () => true;

    return () => {
      window.removeEventListener("click", handleClick);
      window.onbeforeunload = null;
    };
  }, []);

  // ===============================
  // SCAN
  // ===============================
  const handleScan = (e) => {
    if (e.key !== "Enter") return;

    const sku = e.target.value.trim();
    e.target.value = "";

    if (!sku) return;

    const encontrado = productos.find(p => p.sku === sku);
    if (!encontrado) {
      message.error("Producto no encontrado");
      return;
    }

    agregarManualConCantidad(encontrado, 1);
    barcodeRef.current?.focus();
  };

  // ===============================
  // AGREGAR AL CARRITO
  // ===============================
  const agregarManualConCantidad = (itemSel, qty) => {
    const existe = carrito.find(i => i.id === itemSel.id && i.tipo === itemSel.tipo);

    if (existe) {
      existe.cantidad += qty;
      existe.subtotal = existe.cantidad * existe.precio;
      setCarrito([...carrito]);
      return;
    }

    setCarrito([
      ...carrito,
      {
        tipo: itemSel.tipo,
        id: itemSel.id,
        nombre: itemSel.nombre,
        precio: itemSel.precio,
        exento: itemSel.exento,
        typeName: itemSel.typeName,
        cantidad: qty,
        subtotal: qty * itemSel.precio,
      },
    ]);
  };

  const agregarAlCarrito = () => {
    if (!cajaActiva) return message.warning("Debe abrir caja para vender.");
    if (!idSeleccion) return message.warning("Seleccione un item");

    const itemSel = productos.find((x) => x.sku === idSeleccion);
    if (!itemSel) return message.error("No encontrado");

    let qty = cantidad;
    if (!qty || qty <= 0) qty = itemSel.typeName === "granel" ? 0.001 : 1;

    agregarManualConCantidad(itemSel, qty);

    setIdSeleccion(null);
    setCantidad(null);
    selectRef.current?.focus();
  };

  // ===============================
  // ACTUALIZAR / ELIMINAR
  // ===============================
  const actualizarCantidad = (index, nuevaCantidad) => {
    if (!nuevaCantidad || nuevaCantidad <= 0) return;

    const nuevo = [...carrito];
    nuevo[index].cantidad = nuevaCantidad;
    nuevo[index].subtotal = nuevaCantidad * nuevo[index].precio;
    setCarrito(nuevo);
  };

  const eliminarItem = (i) => {
    const nuevo = [...carrito];
    nuevo.splice(i, 1);
    setCarrito(nuevo);
  };

  // ===============================
  // TOTAL
  // ===============================
  const total = carrito.reduce((acc, item) => acc + item.subtotal, 0);

  // ===============================
  // COLUMNAS ESTILIZADAS
  // ===============================
  const columnas = [
    {
      title: "Item",
      dataIndex: "nombre",
      render: (_, r) => (
        <div>
          <b>{r.nombre}</b>
          <br />
          <Tag color={r.tipo === "pack" ? "blue" : r.typeName === "granel" ? "green" : "purple"}>
            {r.tipo === "pack" ? "PACK" : r.typeName.toUpperCase()}
          </Tag>
        </div>
      ),
    },
    {
      title: "Cant.",
      dataIndex: "cantidad",
      width: 130,
      render: (_, record, idx) => (
        <InputNumber
          min={record.typeName === "granel" ? 0.001 : 1}
          step={record.typeName === "granel" ? 0.001 : 1}
          value={record.cantidad}
          onChange={(val) => actualizarCantidad(idx, val)}
        />
      ),
    },
    {
      title: "Precio",
      render: (v, r) => `$${r.precio.toLocaleString("es-CL")}`,
    },
    {
      title: "Subtotal",
      render: (v, r) => (
        <b style={{ color: "#1677ff" }}>
          ${r.subtotal.toLocaleString("es-CL")}
        </b>
      ),
    },
    {
      title: "",
      width: 80,
      render: (_, __, idx) => (
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={() => eliminarItem(idx)}
        />
      ),
    },
  ];

  // ===============================
  // CONFIRMAR VENTA
  // ===============================
  const confirmarVenta = async () => {
    if (procesandoVenta) return;
    if (carrito.length === 0) return message.warning("No hay productos en el carrito.");

    setProcesandoVenta(true);

    const payload = {
      IdUsuario: user.id,
      IdCaja: cajaActiva?.ID_CAJA,
      DescuentoAplicado: 0,
      Items: carrito.map((i) => ({
        Tipo: i.tipo,
        Id: i.id,
        Cantidad: i.cantidad,
        PrecioUnitario: i.precio,
        ExcentoIva: i.exento,
      })),
    };

    try {
      const resp = await createSale(payload);
      message.success(`Venta realizada: $${resp.total.toLocaleString("es-CL")}`);
      setTicket({ items: carrito, total: resp.total });
      setCarrito([]);
      setModalConfirmar(false);
    } catch {
      message.error("No se pudo registrar la venta");
    } finally {
      setProcesandoVenta(false);
      loadData();
    }
  };

  // ===============================
  // UI MODERNO
  // ===============================
  return (
    <div style={{ padding: 0 }}>
      <Card
  bordered={false}
  style={{ borderRadius: 8 }}
  bodyStyle={{ padding: 12 }}   // 👈 CLAVE
>
  <h2 style={{ margin: "0 0 8px 0" }}>
    <ShoppingCartOutlined /> Punto de Venta
  </h2>

        {/* Invisible Input para escáner */}
        <input
          ref={barcodeRef}
          onKeyDown={handleScan}
          style={{ opacity: 0, position: "absolute", left: -9999 }}
        />

        {/* BUSCADOR */}
        <Card
  size="small"
  style={{
    marginBottom: 6,
    background: "#fafafa",
    borderRadius: 3,
  }}
  bodyStyle={{ padding: 10 }}   // 👈 reduce bordes
>
  <h3 style={{ margin: "0 0 8px 0" }}>Agregar producto</h3>
          <Space wrap>

            <Select
              ref={selectRef}
              showSearch
              value={idSeleccion}
              placeholder="Buscar producto..."
              style={{ width: 330 }}
              optionFilterProp="label"
              onChange={setIdSeleccion}
              options={productos.map(x => ({
                value: x.sku,
                label: `${x.nombre}${x.esPack ? " (Pack)" : ""}`,
              }))}
            />

            <InputNumber
              style={{ width: 150 }}
              placeholder="Cantidad"
              min={0.001}
              value={cantidad}
              step={
                productos.find(x => x.sku === idSeleccion)?.typeName === "granel"
                  ? 0.001
                  : 1
              }
              onChange={setCantidad}
            />

            <Button
              type="primary"
              size="middle"
              icon={<PlusCircleOutlined />}
              onClick={agregarAlCarrito}
            >
              Agregar
            </Button>

          </Space>
        </Card>

        {/* TABLA DE CARRITO */}
        <Table
  columns={columnas}
  dataSource={carrito}
  pagination={false}
  rowKey={(r, i) => i}
  style={{ marginBottom: 60 }}  // solo para footer flotante
/>

        {/* FOOTER FLOTANTE */}
        <div
          style={{
            position: "fixed",
            bottom: 0,
            right: 0,
            left: 0,
            padding: "8px 20px",
            background: "#ffffff",
            boxShadow: "0 -2px 8px rgba(0,0,0,0.1)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <h2
  style={{
    margin: 0,
    width: "100%",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "1.4rem",
  }}
>
  Total:{" "}
  <span style={{ color: "#1677ff", fontSize: "1.6rem" }}>
    ${total.toLocaleString("es-CL")}
  </span>
</h2>

          <Space>
            <Button danger size="middle" disabled={!carrito.length} onClick={() => setCarrito([])}>
              Cancelar Venta
            </Button>

            <Button
              type="primary"
              size="middle"
              loading={procesandoVenta}
              disabled={!cajaActiva}
              onClick={() => setModalConfirmar(true)}
            >
              Confirmar
            </Button>
          </Space>
        </div>

      </Card>

      {ticket && (
        <Ticket data={ticket} user={user} caja={cajaActiva} onClose={() => setTicket(null)} />
      )}

      {/* MODAL DE CONFIRMACION */}
      <Modal
        open={modalConfirmar}
        title="Confirmar Venta"
        okText="Confirmar"
        cancelText="Cancelar"
        onOk={confirmarVenta}
        onCancel={() => setModalConfirmar(false)}
      >
        <h3>Detalle:</h3>
        <ul>
          {carrito.map((i, idx) => (
            <li key={idx}>
              {i.cantidad} × {i.nombre} — ${i.subtotal.toLocaleString("es-CL")}
            </li>
          ))}
        </ul>
        <Divider />
        <h2>Total: ${total.toLocaleString("es-CL")}</h2>
      </Modal>
    </div>
  );
}