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
        if (response.data.recentTransfers) {
          setRecentTransfers(response.data.recentTransfers);
        }
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

  const [recentTransfers, setRecentTransfers] = useState<any[]>([]);

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
              {dashboardStats?.connectedHospitals && dashboardStats.connectedHospitals.length > 0 ? (
                dashboardStats.connectedHospitals.map((hospital: any, index: number) => (
                  <div key={index} className="interop-item">
                    <div className="interop-info">
                      <strong>{hospital.name}</strong>
                      <span className="text-small text-light">{hospital.status || 'Connected'}</span>
                    </div>
                    <Badge variant={hospital.isActive ? 'success' : 'warning'}>
                      {hospital.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-small text-light">No connected hospitals</p>
              )}
            </div>
          </Card>

          <Card title="Recent Inter-hospital Transfers" subtitle="Last 5 transfers">
            <div className="transfers-list">
              {recentTransfers.length > 0 ? (
                recentTransfers.map((transfer, index) => (
                  <div key={index} className="transfer-item">
                    <div className="transfer-info">
                      <strong>{transfer.hospital || transfer.hospitalName || 'Unknown'}</strong>
                      <span className="text-small text-mono text-light">{transfer.patient || transfer.uhid || 'N/A'}</span>
                      <span className="text-small text-light">{transfer.date || transfer.createdAt || 'N/A'}</span>
                    </div>
                    <Badge variant={transfer.status === 'completed' ? 'success' : 'warning'}>
                      {transfer.status || 'pending'}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-small text-light">No recent transfers</p>
              )}
            </div>
          </Card>
        </div>

        <Card title="API Usage & Billing" subtitle="Current month statistics">
          <div className="billing-stats">
            <div className="billing-item">
              <span>API Calls</span>
              <strong>{dashboardStats?.apiCalls || '0'}</strong>
            </div>
            <div className="billing-item">
              <span>Inter-hospital Transfers</span>
              <strong>{dashboardStats?.transfers || recentTransfers.length}</strong>
            </div>
            <div className="billing-item">
              <span>AI Module Usage</span>
              <strong>{dashboardStats?.aiUsage || '0'}</strong>
            </div>
            <div className="billing-item billing-total">
              <span>Total Cost</span>
              <strong>{dashboardStats?.totalCost ? `₦${dashboardStats.totalCost.toLocaleString()}` : '₦0'}</strong>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

