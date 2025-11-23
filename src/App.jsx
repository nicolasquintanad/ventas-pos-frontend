import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./Layouts/AdminLayout";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";

// Páginas Admin
import AdminDashboard from "./pages/AdminDashboard";
import Products from "./pages/admin/Products";
import Packs from "./pages/admin/Packs";
import Stock from "./pages/admin/StockEntries";
import Sales from "./pages/admin/Sales";
import Caja from "./pages/admin/Caja";
import Users from "./pages/admin/Users";
import Settings from "./pages/admin/Settings";
import Reportes from "./pages/admin/Reportes";
import ReportesProductos from "./pages/admin/ReportesProductos";

export default function App() {
  return (
    <Routes>
      {/* LOGIN */}
      <Route path="/login" element={<Login />} />

      {/* ADMIN CON LAYOUT FIJO */}
      <Route
        path="/admin"
        element={
          <PrivateRoute role="admin,cajero,pedido">
    <AdminLayout />
  </PrivateRoute>
        }
      >
        {/* Rutas hijas dentro del AdminLayout */}
        <Route index element={<AdminDashboard />} />

        <Route path="users" element={<PrivateRoute role="admin"><Users /></PrivateRoute>} />
        <Route path="products" element={<PrivateRoute role="admin"><Products /></PrivateRoute>} />
        <Route path="packs" element={<PrivateRoute role="admin"><Packs /></PrivateRoute>} />
        <Route path="stock" element={<PrivateRoute role="admin,pedido"><Stock /></PrivateRoute>} />
        <Route path="sales" element={<PrivateRoute role="admin,cajero"><Sales /></PrivateRoute>} />
        <Route path="caja" element={<PrivateRoute role="admin,cajero"><Caja /></PrivateRoute>} />
        <Route path="settings" element={<PrivateRoute role="admin"><Settings /></PrivateRoute>} />
        <Route path="reportes" element={<PrivateRoute role="admin"><Reportes /></PrivateRoute>} />
        <Route path="reporte-productos" element={<PrivateRoute role="admin"><ReportesProductos /></PrivateRoute>} />
      </Route>

      {/* fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}