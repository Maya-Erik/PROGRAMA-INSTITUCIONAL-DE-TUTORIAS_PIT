import { BrowserRouter, Routes, Route } from "react-router-dom"
import { SidebarProvider } from './context/SidebarContext'
import SidebarToggle from './components/Sidebar/SidebarToggle'
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
import Bitacora from "./pages/Bitacora/Bitacora"
import Divisiones from "./pages/Divisiones/Divisiones"
import ProtectedRoute from "./components/ProtectedRoute"
import AdminCitas from "./pages/Admin/AdminCitas"
import AdminUsuarios from "./pages/Admin/AdminUsuarios"
import AdminMateriales from "./pages/Admin/AdminMateriales"

function App() {
  return (
    <SidebarProvider>
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
          
          {/* Rutas protegidas */}
          <Route path="/citas" element={
            <ProtectedRoute allowedRoles={['admin', 'tutor', 'tutorado']}>
              <GestionCitas />
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
          
          <Route path="/bitacora" element={
            <ProtectedRoute allowedRoles={['admin', 'tutor', 'tutorado']}>
              <Bitacora />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/citas" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminCitas />
            </ProtectedRoute>
          } />
          
          <Route path="/usuarios" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminUsuarios />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/materiales" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminMateriales />
            </ProtectedRoute>
          } />
        </Routes>
        <SidebarToggle />
      </BrowserRouter>
    </SidebarProvider>
  )
}

export default App