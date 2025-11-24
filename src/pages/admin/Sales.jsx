import { useEffect, useState, useRef } from "react";InputNumber
import {
  Card,
  Table,
  Button,
  Select,
  InputNumber,
  message,
  Space,
} from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
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

  const { user } = useAuth();

  const barcodeRef = useRef(null);
  const selectRef = useRef(null);

  // Buffer del escáner
  // let scanBuffer = "";
  // let lastTime = Date.now();

  // ===========================================
  // CARGA DE PRODUCTOS + PACKS UNIFICADOS
  // ===========================================
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
          typeName: x.typeName
        })),
        ...pk.map(x => ({
          tipo: "pack",
          id: x.ID_PACK,
          sku: x.SKU_PACK,
          nombre: x.NOMBRE_PACK,
          precio: x.PRECIO_PACK,
          exento: x.EXCENTO_IVA,
          esPack: true,
          typeName: x.typeName
        }))
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
  
    const handleClick = () => barcodeRef.current?.focus();
    window.addEventListener("click", handleClick);
  
    return () => window.removeEventListener("click", handleClick);
  }, []);

  // ===========================================
  // ESCÁNER DE BARRAS (SKU)
  // ===========================================
  // const handleScanKey = (e) => {
  //   const now = Date.now();

  //   if (now - lastTime < 40) scanBuffer += e.key;
  //   else scanBuffer = e.key;

  //   lastTime = now;

  //   setTimeout(() => {
  //     if (Date.now() - lastTime > 80) {
  //       const sku = scanBuffer.trim();
  //       scanBuffer = "";

  //       if (!sku || sku.length < 3) return;

  //       const encontrado = productos.find(p => p.sku === sku);
  //       if (!encontrado) return message.error("Producto no encontrado");

  //       agregarManualConCantidad(encontrado, 1);

  //       selectRef.current?.focus();
  //     }
  //   }, 100);
  // };

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
  
    agregarManualConCantidad(encontrado, 1 * 1);
  
    // vuelve a enfocar para el próximo escaneo
    barcodeRef.current?.focus();
  };


  // ===========================================
  // FUNCIONES DE AGREGADO
  // ===========================================
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
        subtotal: Number(qty) * Number(itemSel.precio)
      }
    ]);
  };

  const agregarAlCarrito = () => {
    if (!cajaActiva) return message.warning("Debe abrir caja antes de vender.");
    if (!idSeleccion) return message.warning("Seleccione un item");
    if (!cantidad || cantidad <= 0) return message.warning("Ingrese cantidad");

    const itemSel = productos.find((x) => x.sku === idSeleccion);
    if (!itemSel) return message.error("No encontrado");

    if (itemSel.typeName !== "granel" && cantidad % 1 !== 0)
      return message.warning("Los packs solo se venden en unidades enteras");

    agregarManualConCantidad(itemSel, cantidad);

    setIdSeleccion(null);
    setCantidad(null);
    selectRef.current?.focus();
  };

  // ===========================================
  // ACTUALIZAR / ELIMINAR
  // ===========================================
  const actualizarCantidad = (index, nuevaCantidad) => {
    if (!nuevaCantidad || nuevaCantidad <= 0) return;

    const nuevo = [...carrito];
    nuevo[index].cantidad = nuevaCantidad;
    nuevo[index].subtotal = Number(nuevaCantidad) * Number(nuevo[index].precio);
    setCarrito(nuevo);
  };

  const eliminarItem = (index) => {
    const nuevo = [...carrito];
    nuevo.splice(index, 1);
    setCarrito(nuevo);
  };

  // ===========================================
  // TOTAL
  // ===========================================
  const total = carrito.reduce((acc, item) => acc + item.subtotal, 0);

  // ===========================================
  // COLUMNAS
  // ===========================================
  const columnas = [
    { title: "Nombre", dataIndex: "nombre" },
    {
      title: "Cantidad",
      dataIndex: "cantidad",
      render: (_, record, idx) => (
        <InputNumber
          min={record.typeName === "granel" ? 0.001 : 1}
          step={record.typeName === "granel" ? 0.001 : 1}
          value={record.cantidad}
          onChange={(val) => actualizarCantidad(idx, val)}
        />
      )
    },
    {
      title: "Precio Unit.",
      dataIndex: "precio",
      render: (v) => `$${(v ?? 0).toLocaleString("es-CL")}`,
    },
    {
      title: "Subtotal",
      dataIndex: "subtotal",
      render: (v) => `$${(v ?? 0).toLocaleString("es-CL")}`,
    },
    {
      title: "Acciones",
      render: (_, __, idx) => (
        <Button danger onClick={() => eliminarItem(idx)}>
          Eliminar
        </Button>
      ),
    },
  ];

  // ===========================================
  // CONFIRMAR VENTA
  // ===========================================
  const confirmarVenta = async () => {
    if (carrito.length === 0)
      return message.warning("No hay productos en el carrito.");

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
      message.success(`Venta realizada: Total $${resp.total.toLocaleString("es-CL")}`);

      setTicket({
        items: carrito,
        total: resp.total
      });

      setCarrito([]);
    } catch {
      message.error("No se pudo registrar la venta");
    }
  };

  // ===========================================
  // UI
  // ===========================================
  return (
    <Card
      title={<h2><ShoppingCartOutlined /> Punto de Venta (POS)</h2>}
      style={{ margin: 20 }}
    >
      {/* Input invisible para lector */}
      <input
  ref={barcodeRef}
  onKeyDown={handleScan}
  autoComplete="off"
  name="hiddenBarcode"
  style={{ 
    position: "absolute", 
    left: "-1000px", 
    width: "1px", 
    height: "1px" 
  }}
/>

      {/* Selección */}
      <Space style={{ marginBottom: 15 }}>
        <Select
          ref={selectRef}
          showSearch
          value={idSeleccion}
          style={{ width: 300 }}
          placeholder="Buscar producto o pack..."
          onChange={setIdSeleccion}
          onKeyDown={(e) => {
            if (e.key === "Enter" && idSeleccion) {
              const itemSel = productos.find(x => x.sku === idSeleccion);
              if (!itemSel) return;

              const qty = itemSel.typeName === "granel" ? 0.001 : 1;
              agregarManualConCantidad(itemSel, qty);

              setIdSeleccion(null);
              setCantidad(null);
              setTimeout(() => selectRef.current?.focus(), 50);
            }
          }}
          filterOption={(input, option) =>
            option?.label.toLowerCase().includes(input.toLowerCase())
          }
          options={productos.map(x => ({
            value: x.sku,
            label: `${x.nombre}${x.esPack ? " (Pack)" : ""}`,
          }))}
        />

        <InputNumber
          style={{ width: 120 }}
          placeholder="Cantidad"
          min={0.001}
          step={productos.find(x => x.sku === idSeleccion)?.typeName === "granel" ? 0.001 : 1}
          value={cantidad}
          onChange={setCantidad}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (!idSeleccion) return;

              const itemSel = productos.find((x) => x.sku === idSeleccion);
              if (!itemSel) return;

              const qty = cantidad || (itemSel.typeName === "granel" ? 0.001 : 1);

              agregarManualConCantidad(itemSel, qty);

              setIdSeleccion(null);
              setCantidad(null);
              setTimeout(() => selectRef.current?.focus(), 50);
            }
          }}
        />

        <Button type="primary" onClick={agregarAlCarrito}>
          Agregar
        </Button>
      </Space>

      <Table
        dataSource={carrito}
        columns={columnas}
        rowKey={(row, idx) => idx}
        pagination={false}
      />

      <h2 style={{ marginTop: 20, textAlign: "right" }}>
        TOTAL: ${total.toLocaleString("es-CL")}
      </h2>

      <div style={{ textAlign: "right", marginTop: 10 }}>
        <Button
          type="primary"
          size="large"
          onClick={confirmarVenta}
          disabled={!cajaActiva}
        >
          Confirmar Venta
        </Button>
        {!cajaActiva && (
          <p style={{ color: "red", textAlign: "right" }}>
            Debe abrir caja para vender.
          </p>
        )}
      </div>

      {ticket && (
        <Ticket data={ticket} user={user} onClose={() => setTicket(null)} />
      )}
    </Card>
  );
}