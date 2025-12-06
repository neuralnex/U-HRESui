import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, User, LogOut } from 'lucide-react';
import { Input } from '../common/Input';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';

interface NavbarProps {
  hospitalName?: string;
  onSearch?: (query: string) => void;
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  hospitalName,
  onSearch,
  onNotificationClick,
  onProfileClick,
}) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const displayName = hospitalName || user?.name || 'U-HRES';

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo">
          <span className="logo-text">🏥 {displayName}</span>
        </div>
        <div className="navbar-search">
          <Input
            type="search"
            placeholder="Search UHID or Patient Name..."
            value={searchQuery}
            onChange={handleSearch}
            icon={<Search size={20} />}
            fullWidth
          />
        </div>
      </div>
      <div className="navbar-right">
        <button className="navbar-icon-btn" onClick={onNotificationClick}>
          <Bell size={20} />
          <span className="notification-badge">3</span>
        </button>
          <div className="navbar-profile">
            <button className="navbar-icon-btn" onClick={onProfileClick}>
              <User size={20} />
            </button>
            <div className="profile-dropdown">
              <button onClick={onProfileClick}>Profile</button>
              <button onClick={handleLogout}>
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
      </div>
    </nav>
  );
};

