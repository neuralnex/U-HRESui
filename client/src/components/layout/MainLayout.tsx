import React from 'react';
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
  const displayName = hospitalName || user?.name;

  return (
    <div className="main-layout">
      <Navbar hospitalName={displayName} />
      <Sidebar role={role} />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

