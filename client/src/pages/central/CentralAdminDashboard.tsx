import React from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Building2, Activity, Brain, DollarSign } from 'lucide-react';
import './CentralAdminDashboard.css';

export const CentralAdminDashboard: React.FC = () => {
  const hospitals = [
    { id: '1', name: 'Lagos General Hospital', status: 'active', patients: 1234, apiCalls: 12456 },
    { id: '2', name: 'Abuja Medical Center', status: 'active', patients: 890, apiCalls: 8900 },
    { id: '3', name: 'Port Harcourt Clinic', status: 'pending', patients: 0, apiCalls: 0 },
  ];

  const nodeHealth = [
    { hospital: 'Lagos General', status: 'healthy', latency: '12ms' },
    { hospital: 'Abuja Medical', status: 'healthy', latency: '18ms' },
    { hospital: 'Port Harcourt', status: 'degraded', latency: '245ms' },
  ];

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
                <div className="stat-value">{hospitals.length}</div>
                <div className="stat-label">Total Hospitals</div>
              </div>
            </div>
          </Card>
          <Card className="stat-card">
            <div className="stat-content">
              <Activity size={32} className="stat-icon-success" />
              <div>
                <div className="stat-value">2,124</div>
                <div className="stat-label">Total Patients</div>
              </div>
            </div>
          </Card>
          <Card className="stat-card">
            <div className="stat-content">
              <Brain size={32} className="stat-icon-info" />
              <div>
                <div className="stat-value">21,356</div>
                <div className="stat-label">AI Queries</div>
              </div>
            </div>
          </Card>
          <Card className="stat-card">
            <div className="stat-content">
              <DollarSign size={32} className="stat-icon-warning" />
              <div>
                <div className="stat-value">₦234,560</div>
                <div className="stat-label">Revenue</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="dashboard-grid">
          <Card title="Hospital Registry" subtitle="All registered hospitals">
            <div className="hospitals-list">
              {hospitals.map((hospital) => (
                <div key={hospital.id} className="hospital-item">
                  <div className="hospital-info">
                    <strong>{hospital.name}</strong>
                    <div className="hospital-stats">
                      <span className="text-small">{hospital.patients} patients</span>
                      <span className="text-small">{hospital.apiCalls.toLocaleString()} API calls</span>
                    </div>
                  </div>
                  <div className="hospital-actions">
                    <Badge variant={hospital.status === 'active' ? 'success' : 'warning'}>
                      {hospital.status}
                    </Badge>
                    {hospital.status === 'pending' && (
                      <Button variant="primary" size="small">
                        Approve
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Node Health Status" subtitle="Real-time connection monitoring">
            <div className="health-list">
              {nodeHealth.map((node, index) => (
                <div key={index} className="health-item">
                  <div className="health-info">
                    <strong>{node.hospital}</strong>
                    <span className="text-small text-light">Latency: {node.latency}</span>
                  </div>
                  <Badge variant={node.status === 'healthy' ? 'success' : node.status === 'degraded' ? 'warning' : 'error'}>
                    {node.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card title="AI Performance Dashboard" subtitle="Usage statistics">
          <div className="ai-stats">
            <div className="ai-stat-item">
              <span>Queries per Hospital (Avg)</span>
              <strong>7,118</strong>
            </div>
            <div className="ai-stat-item">
              <span>Response Time (Avg)</span>
              <strong>5.6s</strong>
            </div>
            <div className="ai-stat-item">
              <span>Success Rate</span>
              <strong>98.5%</strong>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

