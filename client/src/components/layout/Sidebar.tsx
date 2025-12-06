import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Brain,
  MessageSquare,
  Pill,
  Send,
  Settings,
} from 'lucide-react';
import './Sidebar.css';

interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

interface SidebarProps {
  role: 'doctor' | 'admin' | 'lab' | 'central';
  isOpen?: boolean;
  onClose?: () => void;
}

const doctorMenu: SidebarItem[] = [
  { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/doctor' },
  { icon: <Users size={20} />, label: 'Search Patient', path: '/doctor/search' },
  { icon: <Brain size={20} />, label: 'AI Insights', path: '/doctor/ai-insights' },
  { icon: <MessageSquare size={20} />, label: 'Consultations', path: '/doctor/consultations' },
  { icon: <Pill size={20} />, label: 'Prescriptions', path: '/doctor/prescriptions' },
  { icon: <Send size={20} />, label: 'Referrals', path: '/doctor/referrals' },
  { icon: <Settings size={20} />, label: 'Settings', path: '/doctor/settings' },
];

const adminMenu: SidebarItem[] = [
  { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin' },
  { icon: <Users size={20} />, label: 'Staff Management', path: '/admin/staff' },
  { icon: <Send size={20} />, label: 'Interoperability', path: '/admin/interoperability' },
  { icon: <MessageSquare size={20} />, label: 'Audit Logs', path: '/admin/audit' },
  { icon: <Settings size={20} />, label: 'Settings', path: '/admin/settings' },
];

const centralMenu: SidebarItem[] = [
  { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/central' },
  { icon: <Users size={20} />, label: 'Hospitals', path: '/central/hospitals' },
  { icon: <Brain size={20} />, label: 'AI Analytics', path: '/central/ai-analytics' },
  { icon: <MessageSquare size={20} />, label: 'Audit Logs', path: '/central/audit' },
  { icon: <Settings size={20} />, label: 'Settings', path: '/central/settings' },
];

const labMenu: SidebarItem[] = [
  { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/lab' },
  { icon: <Users size={20} />, label: 'Lab Results', path: '/lab/results' },
  { icon: <Pill size={20} />, label: 'Prescriptions', path: '/lab/prescriptions' },
  { icon: <Settings size={20} />, label: 'Settings', path: '/lab/settings' },
];

export const Sidebar: React.FC<SidebarProps> = ({ role, isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getMenu = () => {
    switch (role) {
      case 'doctor':
        return doctorMenu;
      case 'admin':
        return adminMenu;
      case 'lab':
        return labMenu;
      case 'central':
        return centralMenu;
      default:
        return [];
    }
  };

  const menu = getMenu();

  const handleNavigation = (path: string) => {
    navigate(path);
    if (onClose) {
      onClose();
    }
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <nav className="sidebar-nav">
        {menu.map((item) => {
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
          return (
            <button
              key={item.path}
              className={`sidebar-item ${isActive ? 'sidebar-item-active' : ''}`}
              onClick={() => handleNavigation(item.path)}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

