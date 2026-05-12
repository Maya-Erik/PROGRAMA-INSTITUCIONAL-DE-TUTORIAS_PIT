import { BrowserRouter, Routes, Route } from "react-router-dom"
import Inicio from "./pages/Inicio/Inicio"
import SobreNosotros from "./pages/SobreNosotros/SobreNosotros"
import Servicios from "./pages/Servicios/Servicios"
import GestionCitas from "./pages/Servicios/Citas/GestionCitas"
import Repositorio from "./pages/Repositorio/Repositorio"
import RepositorioCarrera from "./pages/RepositorioCarrera/RepositorioCarrera"
import Avisos from "./pages/Avisos/Avisos"
import AdminAvisos from "./pages/Avisos/AdminAvisos"
import SolicitarTutoria from "./pages/Servicios/SolicitarTutoria/SolicitarTutoria"
import Agenda from "./pages/Agenda/Agenda"
import Bitacora from "./pages/Permisos/Bitacora/Bitacora"
import Divisiones from "./pages/Divisiones/Divisiones"
import Accesos from "./pages/Permisos/Accesos/Accesos"
import Roles from "./pages/Permisos/Roles/Roles"
import ProtectedRoute from "./components/ProtectedRoute"
import AdminCitas from "./pages/Admin/AdminCitas";
import AdminUsuarios from "./pages/Admin/AdminUsuarios";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Inicio />} />
        <Route path="/sobre-nosotros" element={<SobreNosotros />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/divisiones" element={<Divisiones />} />
        <Route path="/avisos" element={<Avisos />} />
        <Route path="/repositorio" element={<Repositorio />} />
        <Route path="/repositorio/:carrera" element={<RepositorioCarrera />} />
        
        {/* Rutas protegidas (requieren autenticación) */}
        <Route path="/citas" element={
          <ProtectedRoute allowedRoles={['admin', 'tutor', 'tutorado']}>
            <GestionCitas />
          </ProtectedRoute>
        } />

        <Route path="/admin/citas" element={
          <ProtectedRoute allowedRoles={['admin']}>
              <AdminCitas />
          </ProtectedRoute>
        } />
        
        <Route path="/admin-avisos" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminAvisos />
          </ProtectedRoute>
        } />
        
        <Route path="/solicitar-tutoria" element={
          <ProtectedRoute allowedRoles={['alumno', 'tutorado']}>
            <SolicitarTutoria />
          </ProtectedRoute>
        } />
        
        <Route path="/agenda" element={
          <ProtectedRoute allowedRoles={['admin', 'tutor', 'tutorado', 'alumno']}>
            <Agenda />
          </ProtectedRoute>
        } />
        
        {/* Rutas de administración */}
        <Route path="/bitacora" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Bitacora />
          </ProtectedRoute>
        } />
        
        <Route path="/accesos" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Accesos />
          </ProtectedRoute>
        } />
        
        <Route path="/roles" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Roles />
          </ProtectedRoute>
        } />
        
        

        <Route path="/usuarios" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminUsuarios />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App;