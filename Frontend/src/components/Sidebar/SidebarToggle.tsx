import React from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { useSidebar } from '../../context/SidebarContext';

const SidebarToggle: React.FC = () => {
  const { toggleSidebar, isMobile, sidebarOpen } = useSidebar();

  // Solo mostrar en móvil y cuando la sidebar está cerrada
  if (!isMobile || sidebarOpen) return null;

  return (
    <button className="sidebar-toggle-btn" onClick={toggleSidebar} aria-label="Abrir menú">
      <MenuIcon />
    </button>
  );
};

export default SidebarToggle;