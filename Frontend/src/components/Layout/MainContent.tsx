import React, { useEffect, useRef } from 'react';
import { useSidebar } from '../../context/SidebarContext';

interface MainContentProps {
  children: React.ReactNode;
  className?: string;
}

const MainContent: React.FC<MainContentProps> = ({ children, className = '' }) => {
  const { isMobile, sidebarOpen } = useSidebar();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateMargin = () => {
      if (containerRef.current) {
        if (!isMobile) {
          // Desktop: sidebar visible (200px)
          containerRef.current.style.marginLeft = '200px';
        } else {
          // Móvil: sin margen
          containerRef.current.style.marginLeft = '0';
        }
      }
    };

    updateMargin();
    window.addEventListener('resize', updateMargin);
    window.addEventListener('resize-sidebar', updateMargin);

    return () => {
      window.removeEventListener('resize', updateMargin);
      window.removeEventListener('resize-sidebar', updateMargin);
    };
  }, [isMobile, sidebarOpen]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
};

export default MainContent;