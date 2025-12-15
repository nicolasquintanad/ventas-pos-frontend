import { useState } from "react";
import { Layout, Menu, Button } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  DatabaseOutlined,
  AppstoreAddOutlined,
  UnlockOutlined,
  BarChartOutlined,
  AppstoreOutlined,
  MailOutlined,
  MenuOutlined,
  PrinterOutlined
} from "@ant-design/icons";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const { Header, Sider, Content } = Layout;

export default function AdminLayout() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [collapsed, setCollapsed] = useState(false);

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // --- MENÚ ORIGINAL (se mantiene igual) ----
  const menuItems = [
    { key: "dashboard", icon: <HomeOutlined />, label: "Dashboard", onClick: () => navigate("/admin") },

    ...(user?.role === "admin"
      ? [{ key: "users", icon: <UserOutlined />, label: "Usuarios", onClick: () => navigate("/admin/users") }]
      : []),
      ...(user?.role === "admin"
      ? [{ key: "impresoras", label: "Impresoras", icon: <PrinterOutlined />, onClick: () => navigate("/admin/impresoras")}]
      : []),
    ...(user?.role === "admin"
      ? [{ key: "products", icon: <ShoppingCartOutlined />, label: "Productos", onClick: () => navigate("/admin/products") }]
      : []),

    ...(user?.role === "admin" || user?.role === "cajero"
      ? [{ key: "precio", icon: <ShoppingCartOutlined />, label: "Consulta Precio", onClick: () => navigate("/admin/precio") }]
      : []),

    ...(user?.role === "admin"
      ? [{ key: "proveedor", icon: <UserOutlined />, label: "Proveedores", onClick: () => navigate("/admin/proveedor") }]
      : []),

    ...(user?.role === "admin"
      ? [{ key: "packs", icon: <AppstoreAddOutlined />, label: "Packs", onClick: () => navigate("/admin/packs") }]
      : []),

    ...(user?.role === "admin" || user?.role === "pedido"
      ? [{ key: "stock", icon: <DatabaseOutlined />, label: "Entrada de stock", onClick: () => navigate("/admin/stock") }]
      : []),

    ...(user?.role === "admin" || user?.role === "cajero"
      ? [{ key: "sales", icon: <ShoppingCartOutlined />, label: "Ventas (POS)", onClick: () => navigate("/admin/sales") }]
      : []),

    ...(user?.role === "admin" || user?.role === "cajero"
      ? [{ key: "caja", icon: <UnlockOutlined />, label: "Caja", onClick: () => navigate("/admin/caja") }]
      : []),

    ...(user?.role === "admin" || user?.role === "cajero"
      ? [{ key: "ventas-dia", icon: <BarChartOutlined />, label: "Ventas del dia", onClick: () => navigate("/admin/ventas-dia") }]
      : []),

    ...(user?.role === "admin"
      ? [{ key: "reportes", icon: <DatabaseOutlined />, label: "Reportes", onClick: () => navigate("/admin/reportes") }]
      : []),

    ...(user?.role === "admin"
      ? [{ key: "reportep", icon: <BarChartOutlined />, label: "Reporte Productos", onClick: () => navigate("/admin/reporte-productos") }]
      : []),

    ...(user?.role === "admin"
      ? [{ key: "tipo-producto", icon: <AppstoreOutlined />, label: "Tipo de Producto", onClick: () => navigate("/admin/tipo-producto") }]
      : []),

    ...(user?.role === "admin"
      ? [{ key: "pedidos", icon: <MailOutlined />, label: "Pedidos sugeridos", onClick: () => navigate("/admin/pedidos-sugeridos") }]
      : []),

    { key: "logout", icon: <LogoutOutlined />, label: "Cerrar sesión", danger: true, onClick: logout }
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>

      {/* === SIDEBAR RESPONSIVE === */}
      <Sider
        theme="dark"
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        collapsedWidth="0"
        breakpoint="md"
        width={220}
        style={{
          height: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 1000,
          overflowY: "auto"
        }}
      >
        <div
          style={{
            height: 40,
            margin: 16,
            background: "rgba(255,255,255,0.3)",
            borderRadius: 4,
          }}
        ></div>

<div style={{ height: "calc(100vh - 72px)", overflowY: "auto" }}>
        <Menu theme="dark" mode="inline" items={menuItems} />
        </div>
      </Sider>

      {/* === CONTENIDO PRINCIPAL === */}
      <Layout
  style={{
    marginLeft: collapsed ? 0 : 220,
    transition: "all 0.2s ease",
    minHeight: "100vh"
  }}
>

        {/* BOTÓN HAMBURGUESA PARA MÓVIL */}
        <Header
  style={{
    background: "#fff",
    padding: "0 16px",   // 👈 antes paddingLeft: 20
    height: 48,          // 👈 más compacto
    lineHeight: "48px",
    display: "flex",
    alignItems: "center",
    gap: 12
  }}
>
          <Button
            type="text"
            onClick={() => setCollapsed(!collapsed)}
            icon={<MenuOutlined />}
            className="menu-toggle"
            style={{
              fontSize: 22,
              display: "none",
            }}
          />

          <span>Panel Administrador</span>
        </Header>

        <Content
  style={{
    margin: 12,
    padding: 12,
    background: "#fff",
    overflowY: "auto"
  }}
>
  <Outlet />
</Content>
<style>
{`
@media (max-height: 800px) {
  .ant-card-body {
    padding: 12px !important;
  }

  .ant-form-item {
    margin-bottom: 8px !important;
  }
}
`}
</style>
      </Layout>

      {/* CSS RESPONSIVE */}
      <style>
        {`
        @media (max-width: 768px) {
          .menu-toggle {
            display: block !important;
          }
        }
        `}
      </style>
    </Layout>
  );
}