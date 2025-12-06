import React, { useEffect, useState } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { adminService } from '../../services/admin.service';
import { Activity, Users, Send, FileText } from 'lucide-react';
import './HospitalAdminDashboard.css';

export const HospitalAdminDashboard: React.FC = () => {
  const [dashboardStats, setDashboardStats] = useState<any>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await adminService.getDashboard();
      if (response.success) {
        setDashboardStats(response.data);
      }
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    }
  };
  const stats = [
    { label: 'Total Hospitals', value: dashboardStats?.totalHospitals || '0', icon: <Users size={24} />, color: 'primary' },
    { label: 'Active Hospitals', value: dashboardStats?.activeHospitals || '0', icon: <Activity size={24} />, color: 'success' },
    { label: 'Verified Hospitals', value: dashboardStats?.verifiedHospitals || '0', icon: <Send size={24} />, color: 'info' },
    { label: 'Pending Verification', value: dashboardStats?.unverifiedHospitals || '0', icon: <FileText size={24} />, color: 'warning' },
  ];

  const recentTransfers = [
    { hospital: 'Lagos General', patient: 'UHID-20240115-00001', date: '2024-01-15', status: 'completed' },
    { hospital: 'Abuja Medical', patient: 'UHID-20240115-00002', date: '2024-01-14', status: 'pending' },
  ];

  return (
    <MainLayout role="admin" hospitalName="General Hospital Lagos">
      <div className="admin-dashboard">
        <div className="dashboard-header">
          <h1 className="text-page-title">Hospital Admin Dashboard</h1>
          <p className="text-body text-light">Manage your hospital operations</p>
        </div>

        <div className="stats-grid">
          {stats.map((stat, index) => (
            <Card key={index} className="stat-card">
              <div className="stat-content">
                <div className={`stat-icon bg-${stat.color}`}>
                  {stat.icon}
                </div>
                <div className="stat-info">
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="dashboard-grid">
          <Card title="Interoperability Monitor" subtitle="Connection status with other hospitals">
            <div className="interoperability-list">
              <div className="interop-item">
                <div className="interop-info">
                  <strong>Lagos General Hospital</strong>
                  <span className="text-small text-light">Connected</span>
                </div>
                <Badge variant="success">Active</Badge>
              </div>
              <div className="interop-item">
                <div className="interop-info">
                  <strong>Abuja Medical Center</strong>
                  <span className="text-small text-light">Connected</span>
                </div>
                <Badge variant="success">Active</Badge>
              </div>
            </div>
          </Card>

          <Card title="Recent Inter-hospital Transfers" subtitle="Last 5 transfers">
            <div className="transfers-list">
              {recentTransfers.map((transfer, index) => (
                <div key={index} className="transfer-item">
                  <div className="transfer-info">
                    <strong>{transfer.hospital}</strong>
                    <span className="text-small text-mono text-light">{transfer.patient}</span>
                    <span className="text-small text-light">{transfer.date}</span>
                  </div>
                  <Badge variant={transfer.status === 'completed' ? 'success' : 'warning'}>
                    {transfer.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card title="API Usage & Billing" subtitle="Current month statistics">
          <div className="billing-stats">
            <div className="billing-item">
              <span>API Calls</span>
              <strong>12,456</strong>
            </div>
            <div className="billing-item">
              <span>Inter-hospital Transfers</span>
              <strong>89</strong>
            </div>
            <div className="billing-item">
              <span>AI Module Usage</span>
              <strong>234</strong>
            </div>
            <div className="billing-item billing-total">
              <span>Total Cost</span>
              <strong>₦45,230</strong>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

