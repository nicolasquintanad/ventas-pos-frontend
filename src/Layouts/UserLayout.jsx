import { Layout, Menu } from "antd";
import { HomeOutlined, LogoutOutlined, UserOutlined  } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";


const { Header, Sider, Content } = Layout;


export default function UserLayout({ children }) {
const navigate = useNavigate();


const logout = () => {
localStorage.removeItem("user");
navigate("/login");
};


const menuItems = [
    { key: "home", icon: <HomeOutlined />, label: "Inicio", onClick: () => navigate("/user") },
    { key: "profile", icon: <UserOutlined />, label: "Mi Perfil", onClick: () => navigate("/user/profile") },
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
<Header style={{ background: "#fff", paddingLeft: 20 }}>Panel Usuario</Header>


<Content style={{ margin: 20, padding: 20, background: "#fff" }}>
{children}
</Content>
</Layout>
</Layout>
);
}