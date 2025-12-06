import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, UserPlus, MessageSquare, FlaskConical, Send, AlertTriangle } from 'lucide-react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import './DoctorDashboard.css';

export const DoctorDashboard: React.FC = () => {
  const navigate = useNavigate();

  const quickActions = [
    { icon: <Search size={20} />, label: 'Search Patient Record', color: 'primary', action: () => navigate('/doctor/search') },
    { icon: <UserPlus size={20} />, label: 'Register New Patient', color: 'primary', action: () => navigate('/doctor/create-uhid') },
    { icon: <MessageSquare size={20} />, label: 'Start Consultation', color: 'primary', action: () => {} },
    { icon: <FlaskConical size={20} />, label: 'Lab Request', color: 'secondary', action: () => {} },
    { icon: <Send size={20} />, label: 'Referral to Another Hospital', color: 'secondary', action: () => {} },
  ];

  const aiHighlights = [
    { type: 'anomaly', message: 'Patient UHID-20240115-00001 shows elevated risk score', severity: 'warning' },
    { type: 'interaction', message: 'Drug interaction detected: Aspirin + Warfarin', severity: 'error' },
    { type: 'risk', message: '3 patients with elevated risk score today', severity: 'warning' },
  ];

  const todayPatients = [
    { name: 'John Doe', uhid: 'UHID-20240115-00001', summary: 'Acute Inferior STEMI', status: 'active' },
    { name: 'Jane Smith', uhid: 'UHID-20240115-00002', summary: 'Hypertension follow-up', status: 'completed' },
    { name: 'Michael Brown', uhid: 'UHID-20240115-00003', summary: 'Diabetes management', status: 'active' },
  ];

  return (
    <MainLayout role="doctor" hospitalName="General Hospital Lagos">
      <div className="doctor-dashboard">
        <div className="dashboard-header">
          <h1 className="text-page-title">Doctor Dashboard</h1>
          <p className="text-body text-light">Welcome back, Dr. Sarah Johnson</p>
        </div>

        <section className="quick-actions-section">
          <h2 className="text-section-title">Quick Actions</h2>
          <div className="quick-actions-grid">
            {quickActions.map((action, index) => (
              <Card key={index} className="quick-action-card" onClick={action.action}>
                <div className="quick-action-content">
                  <div className={`quick-action-icon bg-${action.color}`}>
                    {action.icon}
                  </div>
                  <span className="quick-action-label">{action.label}</span>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <div className="dashboard-grid">
          <section className="ai-highlights-section">
            <Card title="AI Highlights" subtitle="Recent AI insights and alerts">
              <div className="ai-highlights-list">
                {aiHighlights.map((highlight, index) => (
                  <div key={index} className={`ai-highlight ai-highlight-${highlight.severity}`}>
                    <AlertTriangle size={16} />
                    <span>{highlight.message}</span>
                    <Badge variant={highlight.severity === 'error' ? 'error' : 'warning'}>
                      {highlight.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </section>

          <section className="today-patients-section">
            <Card title="Patients You Consulted Today" subtitle={`${todayPatients.length} patients`}>
              <div className="patients-list">
                {todayPatients.map((patient, index) => (
                  <div key={index} className="patient-item">
                    <div className="patient-info">
                      <h4 className="text-card-title">{patient.name}</h4>
                      <p className="text-small text-mono text-light">{patient.uhid}</p>
                      <p className="text-small">{patient.summary}</p>
                    </div>
                    <Badge variant={patient.status === 'active' ? 'warning' : 'success'}>
                      {patient.status}
                    </Badge>
                  </div>
                ))}
              </div>
              <Button variant="outline" fullWidth className="m-t">
                View All Patients
              </Button>
            </Card>
          </section>
        </div>
      </div>
    </MainLayout>
  );
};

