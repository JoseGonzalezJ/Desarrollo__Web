import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import Dashboard from "./pages/Dashboard";
import FungusPage from "./components/FungusForm"; // Asegúrate de importar FungusForm

function PrivateRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta privada para el Dashboard */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        
        {/* Ruta privada para el formulario de creación de hongos */}
        <Route path="/fungus-form" element={<PrivateRoute><FungusPage /></PrivateRoute>} />
        
        {/* Ruta pública para login */}
        <Route path="/login" element={<LoginForm />} />
        
        {/* Ruta pública para registro */}
        <Route path="/register" element={<RegisterForm />} />
        
        {/* Ruta por defecto si no coincide ninguna otra */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
