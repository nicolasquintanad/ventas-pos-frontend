import { useEffect, useState } from "react";
import { Card, Button, Modal, Select, InputNumber, message, Typography } from "antd";
import { getCajas, getCajaActiva, abrirCaja, cerrarCaja } from "../../api/caja";
import { useAuth } from "../../context/AuthContext";
import { LockOutlined, UnlockOutlined } from "@ant-design/icons";
import TicketCierre from "../../components/TicketCierre"; // 👈 IMPORTANTE

export default function Caja() {
  const { user } = useAuth();
  const [cajas, setCajas] = useState([]);
  const [activa, setActiva] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [idCajaSel, setIdCajaSel] = useState(null);
  const [montoInicial, setMontoInicial] = useState(0);

  // 👇 NUEVOS STATES PARA TICKET
  const [ticket, setTicket] = useState(null);
  const [showTicket, setShowTicket] = useState(false);

  const loadCaja = async () => {
    try {
      setTicket(null); // Evita mostrar ticket antiguo
      const list = await getCajas();
      setCajas(list);

      const activaData = await getCajaActiva(user.id);
      setActiva(activaData);
    } catch {
      message.error("Error cargando datos de caja");
    }
  };

  useEffect(() => {
    loadCaja();
  }, []);

  // Abrir caja
  const handleApertura = async () => {
    if (!idCajaSel) return message.warning("Seleccione una caja");
    if (montoInicial < 0) return message.warning("Monto inválido");

    try {
      await abrirCaja(user.id, idCajaSel, montoInicial);
      message.success("Caja abierta correctamente");
      setModalOpen(false);
      loadCaja();
    } catch (err) {
      message.error(err.response?.data?.Message || "No se pudo abrir caja");
    }
  };

  // Cerrar caja
  const handleCerrar = async () => {
    try {
      const data = await cerrarCaja(user.id);
      console.log(data)
      setTicket(data);       // 👈 GUARDA DETALLE
      setShowTicket(true);   // 👈 ABRE MODAL
      message.success("Caja cerrada");
    } catch {
      message.error("No se pudo cerrar caja");
    }
  };

  const onCloseTicket = () => {
    setShowTicket(false);
    loadCaja(); // 👈 RECARGA EN VEZ DE RELOAD()
  };

  return (
    <Card title="Control de Caja" style={{ margin: 20 }}>
      {activa ? (
        <>
          <Typography.Text strong>
            Caja activa: {activa.caja}
          </Typography.Text>
          <br />
          <Typography.Text>
            Monto inicial: ${activa.MONTO_INICIAL}
          </Typography.Text>
          <br />
          <Typography.Text>
            Apertura: {new Date(activa.FECHA_APERTURA).toLocaleString()}
          </Typography.Text>
          <br /><br />
          <Button type="primary" danger icon={<LockOutlined />} onClick={handleCerrar}>
            Cerrar Caja
          </Button>
        </>
      ) : (
        <>
          <Typography.Text>No hay caja activa</Typography.Text>
          <br /><br />
          <Button type="primary" icon={<UnlockOutlined />} onClick={() => setModalOpen(true)}>
            Abrir Caja
          </Button>
        </>
      )}

      <Modal
        open={modalOpen}
        title="Abrir Caja"
        onCancel={() => setModalOpen(false)}
        okText="Abrir"
        onOk={handleApertura}
      >
        <Select
          style={{ width: "100%", marginBottom: 10 }}
          placeholder="Seleccione caja"
          onChange={setIdCajaSel}
          options={cajas.map(c => ({ label: c.NOMBRE, value: c.ID_CAJA }))}
        />

        <InputNumber
          style={{ width: "100%" }}
          placeholder="Monto inicial"
          min={0}
          value={montoInicial}
          onChange={setMontoInicial}
        />
      </Modal>

      {/* 👇 SOLO SE RENDERIZA CUANDO EXISTE VALOR */}
      {showTicket && <TicketCierre data={ticket} ID_CAJA={activa.ID_CAJA} onClose={onCloseTicket} />}
    </Card>
  );
}