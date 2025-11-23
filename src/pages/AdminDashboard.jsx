import { Button, Card, Space } from "antd";
import AdminLayout from "../Layouts/AdminLayout";
import { BarChartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <>
      <Card style={{ marginBottom: 20 }}>
        <h2>Dashboard</h2>
        <p>Bienvenido al sistema de administración.</p>
        <p>Aquí pronto mostraremos estadísticas y reportes rápidos.</p>
      </Card>

      <Card title="Reportes Rápidos">
        <Space direction="vertical" style={{ width: "100%" }}>
          <Button
            type="primary"
            icon={<BarChartOutlined />}
            onClick={() => navigate("/admin/reporte-productos")}
            block
          >
            Reporte Consolidado de Productos Vendidos
          </Button>
        </Space>
      </Card>
      </>
  );
}