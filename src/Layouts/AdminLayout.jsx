import { Layout, Menu } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  HomeOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  DatabaseOutlined,
  AppstoreAddOutlined,
  UnlockOutlined,
  BarChartOutlined,
  AppstoreOutlined,
  MailOutlined
} from "@ant-design/icons";
import { Outlet,useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const { Header, Sider, Content } = Layout;

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const menuItems = [
    // Dashboard (todos)
    { key: "dashboard", icon: <HomeOutlined />, label: "Dashboard", onClick: () => navigate("/admin") },

    // Usuarios (solo admin)
    ...(user?.role === "admin" ? [
      { key: "users", icon: <UserOutlined />, label: "Usuarios", onClick: () => navigate("/admin/users") }
    ] : []),

    // Productos (solo admin)
    ...(user?.role === "admin" ? [
      { key: "products", icon: <ShoppingCartOutlined />, label: "Productos", onClick: () => navigate("/admin/products") }
    ] : []),
    ...(user?.role === "admin" ? [
      { key: "proveedor", icon: <UserOutlined />, label: "Proveedores", onClick: () => navigate("/admin/proveedor") }
    ] : []),

    // Packs (solo admin)
    ...(user?.role === "admin" ? [
      { key: "packs", icon: <AppstoreAddOutlined />, label: "Packs", onClick: () => navigate("/admin/packs") }
    ] : []),

    // Entrada de Stock (admin + pedido)
    ...(user?.role === "admin" || user?.role === "pedido" ? [
      { key: "stock", icon: <DatabaseOutlined />, label: "Entrada de stock", onClick: () => navigate("/admin/stock") }
    ] : []),

    // Ventas POS (admin + cajero)
    ...(user?.role === "admin" || user?.role === "cajero" ? [
      { key: "sales", icon: <ShoppingCartOutlined />, label: "Ventas (POS)", onClick: () => navigate("/admin/sales") }
    ] : []),

    // Caja (admin + cajero)
    ...(user?.role === "admin" || user?.role === "cajero" ? [
      { key: "caja", icon: <UnlockOutlined />, label: "Caja", onClick: () => navigate("/admin/caja") }
    ] : []),

    
    //reimpresión ticket
    // Caja (admin + cajero)
    ...(user?.role === "admin" || user?.role === "cajero" ? [
      { key: "ventas-dia", icon: <BarChartOutlined />, label: "Ventas del dia", onClick: () => navigate("/admin/ventas-dia") }
    ] : []),

    // Configuraciones (solo admin)
    // ...(user?.role === "admin" ? [
    //   { key: "settings", icon: <SettingOutlined />, label: "Configuraciones", onClick: () => navigate("/admin/settings") }
    // ] : []),
    // Reportes (solo admin)
    ...(user?.role === "admin" ? [
        { key: "reportes", icon: <DatabaseOutlined />, label: "Reportes", onClick: () => navigate("/admin/reportes") }
    ] : []),
    // Reportes Productos (solo admin)
    ...(user?.role === "admin" ? [
        { key: "reportep", icon: <BarChartOutlined />, label: "Reporte Productos", onClick: () => navigate("/admin/reporte-productos") }
    ] : []),
    
    ...(user?.role === "admin" ? [
      { key: "tipo-producto", icon: <AppstoreOutlined />, label: "Tipo de Producto", onClick: () => navigate("/admin/tipo-producto") }
    ] : []),
    ...(user?.role === "admin" ? [
    {  key: "pedidos", icon: <MailOutlined />, label: "Pedidos sugeridos", onClick: () => navigate("/admin/pedidos-sugeridos"), }
    ] : []),      
    // Logout
    { key: "logout", icon: <LogoutOutlined />, label: "Cerrar sesión", danger: true, onClick: logout }
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider theme="dark">
        <div
          style={{
            height: 40,
            margin: 16,
            background: "rgba(255,255,255,0.3)",
            borderRadius: 4,
          }}
        />
        <Menu theme="dark" mode="inline" items={menuItems} />
      </Sider>

      <Layout>
        <Header style={{ background: "#fff", paddingLeft: 20, fontSize: 18 }}>
          Panel Administrador
        </Header>

        <Content style={{ margin: 20, padding: 20, background: "#fff" }}>
        <Outlet />
          
        </Content>
      </Layout>
    </Layout>
  );
}