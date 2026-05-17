import React, { useEffect, useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { useSidebar } from '../../context/SidebarContext';
import { useLocation } from 'react-router-dom';

const SidebarToggle: React.FC = () => {
  const { toggleSidebar, isMobile, sidebarOpen } = useSidebar();
  const location = useLocation();
  const [showToggle, setShowToggle] = useState(false);

  // Rutas donde la sidebar está presente
  const sidebarRoutes = [
    '/agenda',
    '/citas',
    '/bitacora',
    '/admin/citas',
    '/admin-avisos',
    '/usuarios',
    '/admin/materiales'
  ];

  useEffect(() => {
    // Verificar si la ruta actual debe mostrar la sidebar
    const shouldShowSidebar = sidebarRoutes.some(route => 
      location.pathname === route || location.pathname.startsWith('/repositorio/')
    );
    setShowToggle(shouldShowSidebar);
  }, [location.pathname]);

  // Solo mostrar en móvil, cuando la sidebar está cerrada, y en rutas que usan sidebar
  if (!isMobile || sidebarOpen || !showToggle) return null;

  return (
    <button className="sidebar-toggle-btn" onClick={toggleSidebar} aria-label="Abrir menú">
      <MenuIcon />
    </button>
  );
};

export default SidebarToggle;