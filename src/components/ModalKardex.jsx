import { Modal, Table } from "antd";

export default function ModalKardex({ visible, onClose, data }) {
  const columns = [
    { title: "Fecha", dataIndex: "FECHA", render: (v) => new Date(v).toLocaleString("es-CL") },
    { title: "Tipo", dataIndex: "TIPO_MOVIMIENTO" },
    { title: "Cantidad", dataIndex: "CANTIDAD" },
    { title: "Stock Anterior", dataIndex: "STOCK_ANTERIOR" },
    { title: "Stock Nuevo", dataIndex: "STOCK_NUEVO" },
    { title: "Usuario", dataIndex: "USUARIO" },
    { title: "Observación", dataIndex: "OBSERVACION" }
  ];

  return (
    <Modal
      title="Historial de Stock (Kardex)"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={900}
    >
      <Table
        columns={columns}
        dataSource={data}
        rowKey={(r) => r.FECHA + r.TIPO_MOVIMIENTO + r.CANTIDAD}
        pagination={{ pageSize: 10 }}
      />
    </Modal>
  );
}