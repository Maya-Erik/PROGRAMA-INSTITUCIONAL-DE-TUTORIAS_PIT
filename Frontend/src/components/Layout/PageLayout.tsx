import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import './PageLayout.css';

interface PageLayoutProps {
  children: React.ReactNode;
  userRole: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, userRole }) => {
  return (
    <div className="page-layout">
      <Sidebar userRole={userRole} />
      <div className="page-content">
        {children}
      </div>
    </div>
  );
};

export default PageLayout;