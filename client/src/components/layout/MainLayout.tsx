import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import './MainLayout.css';

interface MainLayoutProps {
  children: React.ReactNode;
  role: 'doctor' | 'admin' | 'lab' | 'central';
  hospitalName?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  role,
  hospitalName,
}) => {
  const { user } = useAuth();
  const displayName = hospitalName || user?.name || 'U-HRES';
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="main-layout">
      <Navbar hospitalName={displayName} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar role={role} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

