import React, { useEffect, useState } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Building2, Activity, Brain, DollarSign } from 'lucide-react';
import { adminService } from '../../services/admin.service';
import { hospitalService } from '../../services/hospital.service';
import './CentralAdminDashboard.css';

export const CentralAdminDashboard: React.FC = () => {
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboardResponse, hospitalsResponse] = await Promise.all([
        adminService.getDashboard(),
        hospitalService.getAllHospitals(),
      ]);

      if (dashboardResponse.success) {
        setDashboardStats(dashboardResponse.data);
      }

      if (hospitalsResponse.success) {
        setHospitals(hospitalsResponse.data || []);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setHospitals([]);
      setDashboardStats(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout role="central" hospitalName="U-HRES Central">
      <div className="central-dashboard">
        <div className="dashboard-header">
          <h1 className="text-page-title">Central U-HRES Admin Panel</h1>
          <p className="text-body text-light">Monitor and manage all hospitals</p>
        </div>

        <div className="stats-grid">
          <Card className="stat-card">
            <div className="stat-content">
              <Building2 size={32} className="stat-icon-primary" />
              <div>
                <div className="stat-value">{loading ? '...' : dashboardStats?.totalHospitals || hospitals.length || '0'}</div>
                <div className="stat-label">Total Hospitals</div>
              </div>
            </div>
          </Card>
          <Card className="stat-card">
            <div className="stat-content">
              <Activity size={32} className="stat-icon-success" />
              <div>
                <div className="stat-value">{loading ? '...' : dashboardStats?.activeHospitals || '0'}</div>
                <div className="stat-label">Active Hospitals</div>
              </div>
            </div>
          </Card>
          <Card className="stat-card">
            <div className="stat-content">
              <Brain size={32} className="stat-icon-info" />
              <div>
                <div className="stat-value">{loading ? '...' : dashboardStats?.verifiedHospitals || '0'}</div>
                <div className="stat-label">Verified Hospitals</div>
              </div>
            </div>
          </Card>
          <Card className="stat-card">
            <div className="stat-content">
              <DollarSign size={32} className="stat-icon-warning" />
              <div>
                <div className="stat-value">{loading ? '...' : dashboardStats?.unverifiedHospitals || '0'}</div>
                <div className="stat-label">Pending Verification</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="dashboard-grid">
          <Card title="Hospital Registry" subtitle="All registered hospitals">
            {loading ? (
              <p className="text-small text-light">Loading...</p>
            ) : hospitals.length > 0 ? (
              <div className="hospitals-list">
                {hospitals.map((hospital) => (
                  <div key={hospital.id} className="hospital-item">
                    <div className="hospital-info">
                      <strong>{hospital.name}</strong>
                      <div className="hospital-stats">
                        <span className="text-small text-mono text-light">{hospital.hospitalCode}</span>
                        <span className="text-small">{hospital.type} • {hospital.state}</span>
                      </div>
                    </div>
                    <div className="hospital-actions">
                      <Badge variant={hospital.isActive ? 'success' : 'error'}>
                        {hospital.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant={hospital.isVerified ? 'success' : 'warning'}>
                        {hospital.isVerified ? 'Verified' : 'Pending'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p className="text-small text-light">No hospitals registered yet</p>
              </div>
            )}
          </Card>

          <Card title="System Overview" subtitle="Platform statistics">
            {loading ? (
              <p className="text-small text-light">Loading...</p>
            ) : dashboardStats ? (
              <div className="health-list">
                <div className="health-item">
                  <div className="health-info">
                    <strong>Total Hospitals</strong>
                    <span className="text-small text-light">{dashboardStats.totalHospitals || 0}</span>
                  </div>
                </div>
                <div className="health-item">
                  <div className="health-info">
                    <strong>Active Hospitals</strong>
                    <span className="text-small text-light">{dashboardStats.activeHospitals || 0}</span>
                  </div>
                </div>
                <div className="health-item">
                  <div className="health-info">
                    <strong>Verified Hospitals</strong>
                    <span className="text-small text-light">{dashboardStats.verifiedHospitals || 0}</span>
                  </div>
                </div>
                <div className="health-item">
                  <div className="health-info">
                    <strong>Pending Verification</strong>
                    <span className="text-small text-light">{dashboardStats.unverifiedHospitals || 0}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <p className="text-small text-light">No data available</p>
              </div>
            )}
          </Card>
        </div>

        <Card title="Hospitals by Type" subtitle="Distribution of hospital types">
          {loading ? (
            <p className="text-small text-light">Loading...</p>
          ) : dashboardStats?.hospitalsByType ? (
            <div className="ai-stats">
              {Object.entries(dashboardStats.hospitalsByType).map(([type, count]: [string, any]) => (
                <div key={type} className="ai-stat-item">
                  <span>{type}</span>
                  <strong>{count}</strong>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p className="text-small text-light">No data available</p>
            </div>
          )}
        </Card>
      </div>
    </MainLayout>
  );
};

