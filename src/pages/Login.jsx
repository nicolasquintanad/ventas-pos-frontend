import { useState } from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useAuth } from "../context/AuthContext";
import { loginRequest } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();


  const onFinish = async (values) => {
    setLoading(true);
  
    try {
      const data = await loginRequest(values.username, values.password);
  
      //console.log(data); // Aquí loguea user + token
  
      login(data.user, data.token);
  
      if (data.user) {
        message.success("Bienvenido " + data.user.name);
        navigate("/admin"); 
      }
    } catch (err) {
      message.error("Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f0f2f5",
      }}
    >
      <Card style={{ width: 380, padding: 10 }}>
        <Typography.Title level={3} style={{ textAlign: "center" }}>
          Iniciar Sesión
        </Typography.Title>

        <Form name="login" layout="vertical" onFinish={onFinish}>
        <Form.Item
  label="Usuario"
  name="username"
  rules={[{ required: true, message: "Ingrese su usuario" }]}>
  <Input prefix={<UserOutlined />} placeholder="usuario" />
</Form.Item>

<Form.Item
  label="Contraseña"
  name="password"
  rules={[{ required: true, message: "Ingrese su contraseña" }]}>
  <Input.Password prefix={<LockOutlined />} placeholder="••••••" />
</Form.Item>

          <Button type="primary" htmlType="submit" block loading={loading}>
            Ingresar
          </Button>
        </Form>
      </Card>
    </div>
  );
}