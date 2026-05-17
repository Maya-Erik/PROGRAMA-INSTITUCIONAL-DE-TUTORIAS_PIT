import React, { useEffect, useRef } from 'react';
import { useSidebar } from '../../context/SidebarContext';

interface MainContentProps {
  children: React.ReactNode;
  className?: string;
}

const MainContent: React.FC<MainContentProps> = ({ children, className = '' }) => {
  const { isMobile } = useSidebar();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      // En desktop, dejar que el CSS maneje el margen
      // En móvil, eliminar cualquier margen
      if (isMobile) {
        containerRef.current.style.marginLeft = '0';
      } else {
        // Restaurar el margen que podría venir del CSS
        containerRef.current.style.marginLeft = '';
      }
    }
  }, [isMobile]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
};

export default MainContent;