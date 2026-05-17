import { useEffect } from 'react';
import { useSidebar } from '../context/SidebarContext';

export const useSidebarMargin = () => {
  const { isMobile, sidebarOpen } = useSidebar();

  useEffect(() => {
    // Seleccionar todos los contenedores principales que podrían necesitar margen
    const containers = document.querySelectorAll('.agenda-main, .gc-main, .bitacora-main, .admin-citas-main, .admin-usuarios-main, .admin-materiales-main, .repositorio-section, .bitacora-content');
    
    containers.forEach((container) => {
      if (container instanceof HTMLElement) {
        if (isMobile && !sidebarOpen) {
          container.style.marginLeft = '0';
        } else if (isMobile && sidebarOpen) {
          container.style.marginLeft = '0';
        } else {
          container.style.marginLeft = '200px';
        }
      }
    });

    return () => {
      containers.forEach((container) => {
        if (container instanceof HTMLElement) {
          container.style.marginLeft = '';
        }
      });
    };
  }, [isMobile, sidebarOpen]);
};