import { useState, useRef } from "react";
import { Card, Input, Button, message } from "antd";
import { BarcodeOutlined, CameraOutlined } from "@ant-design/icons";
import { QrReader } from "react-qr-reader";
import { getPrecioPorSku } from "../../api/products";

export default function ConsultaPrecio() {
  const [sku, setSku] = useState("");
  const [producto, setProducto] = useState(null);
  const [useCamera, setUseCamera] = useState(false);

  const hiddenInput = useRef(null);

  // =========================
  // CONSULTA API
  // =========================
  const consultar = async (codigo) => {
    if (!codigo) return;

    try {
      const data = await getPrecioPorSku(codigo);
      setProducto(data);
      setSku("");
    } catch {
      message.error("Producto no encontrado");
    }
  };

  // =========================
  // ESCÁNER USB (ENTER)
  // =========================
  const handleBarcodeEnter = (e) => {
    if (e.key !== "Enter") return;

    const codigo = e.target.value.trim();
    e.target.value = "";

    consultar(codigo);

    setTimeout(() => hiddenInput.current?.focus(), 50);
  };

  // =========================
  // ESTILO DE ESQUINAS
  // =========================
  const cornerStyle = (vertical, horizontal) => ({
    position: "absolute",
    [vertical]: -4,
    [horizontal]: -4,
    width: 35,
    height: 35,
    borderColor: "#00ff88",
    borderStyle: "solid",
    borderWidth:
      vertical === "top"
        ? horizontal === "left"
          ? "4px 0 0 4px"
          : "4px 4px 0 0"
        : horizontal === "left"
        ? "0 0 4px 4px"
        : "0 4px 4px 0",
    borderRadius: 6,
  });

  return (
    <div style={{ padding: 20 }}>
      <Card
        title={<h2><BarcodeOutlined /> Consulta de Precios</h2>}
        style={{ maxWidth: 500, margin: "0 auto" }}
      >

        {/* INPUT INVISIBLE PARA ESCÁNER USB */}
        <input
          ref={hiddenInput}
          autoFocus
          onKeyDown={handleBarcodeEnter}
          style={{ position: "absolute", opacity: 0, height: 0 }}
        />

        {/* Entrada manual */}
        <Input
          placeholder="Ingrese SKU"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
          onPressEnter={() => consultar(sku)}
          style={{ marginBottom: 10 }}
        />

        <Button
          type="primary"
          block
          onClick={() => consultar(sku)}
          icon={<BarcodeOutlined />}
        >
          Consultar
        </Button>

        <br /><br />

        {/* Botón activar cámara */}
        {/* <Button
          block
          icon={<CameraOutlined />}
          onClick={() => setUseCamera(!useCamera)}
        >
          {useCamera ? "Cerrar cámara" : "Escanear con cámara"}
        </Button> */}

        {/* Botón nueva consulta */}
        <Button
          block
          danger
          style={{ marginTop: 10 }}
          onClick={() => {
            setSku("");
            setProducto(null);
            setUseCamera(false);
            if (hiddenInput.current) hiddenInput.current.value = "";
            setTimeout(() => hiddenInput.current?.focus(), 50);
          }}
        >
          Nueva consulta
        </Button>

        {/* === CÁMARA + OVERLAY === */}
        {useCamera && (
          <div style={{ marginTop: 20, position: "relative" }}>
            {/* Overlay de 4 esquinas */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 10,
                pointerEvents: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: "70%",
                  height: "70%",
                  border: "3px solid rgba(0,255,100,0.7)",
                  borderRadius: 12,
                  position: "relative",
                }}
              >
                <div style={cornerStyle("top", "left")}></div>
                <div style={cornerStyle("top", "right")}></div>
                <div style={cornerStyle("bottom", "left")}></div>
                <div style={cornerStyle("bottom", "right")}></div>
              </div>
            </div>

            {/* LECTOR DE CÓDIGO */}
            <QrReader
              constraints={{ facingMode: "environment" }}
              onResult={(result, error) => {
                if (!!result) {
                  consultar(result.getText());
                  setUseCamera(false);
                }
              }}
              scanDelay={300}
              style={{ width: "100%" }}
            />
          </div>
        )}

        {/* Resultado */}
        {producto && (
          <Card
            style={{
              marginTop: 20,
              textAlign: "center",
              background: "#f5f5f5",
              borderRadius: 12,
            }}
          >
            <h2 style={{ marginBottom: 0 }}>{producto.nombre}</h2>
            <p style={{ margin: "5px 0" }}>SKU: {producto.sku}</p>

            <h1 style={{ color: "#1677ff", fontSize: "3rem", margin: "10px 0" }}>
              ${producto.precio.toLocaleString("es-CL")}
            </h1>

            <p>
              <b>Tipo:</b> {producto.tipo} &nbsp; | &nbsp;
              <b>Stock:</b> {producto.stock}
            </p>
          </Card>
        )}
      </Card>
    </div>
  );
}