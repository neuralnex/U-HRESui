import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, UserPlus, MessageSquare, FlaskConical, Send, AlertTriangle } from 'lucide-react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { patientService } from '../../services/patient.service';
import { aiService } from '../../services/ai.service';
import './DoctorDashboard.css';

export const DoctorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [todayPatients, setTodayPatients] = useState<any[]>([]);
  const [aiHighlights, setAiHighlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setTodayPatients([]);
      setAiHighlights([]);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setTodayPatients([]);
      setAiHighlights([]);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { icon: <Search size={20} />, label: 'Search Patient Record', color: 'primary', action: () => navigate('/doctor/search') },
    { icon: <UserPlus size={20} />, label: 'Register New Patient', color: 'primary', action: () => navigate('/doctor/create-uhid') },
    { icon: <MessageSquare size={20} />, label: 'Start Consultation', color: 'primary', action: () => navigate('/doctor/search') },
    { icon: <FlaskConical size={20} />, label: 'Lab Request', color: 'secondary', action: () => navigate('/doctor/search') },
    { icon: <Send size={20} />, label: 'Referral to Another Hospital', color: 'secondary', action: () => navigate('/doctor/search') },
  ];

  return (
    <MainLayout role="doctor">
      <div className="doctor-dashboard">
        <div className="dashboard-header">
          <h1 className="text-page-title">Doctor Dashboard</h1>
          <p className="text-body text-light">Hello Doctor, welcome to U-HRES</p>
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
              {loading ? (
                <p className="text-small text-light">Loading...</p>
              ) : aiHighlights.length > 0 ? (
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
              ) : (
                <div className="empty-state">
                  <p className="text-small text-light">No AI highlights at this time</p>
                  <Button variant="outline" fullWidth className="m-t" onClick={() => navigate('/doctor/ai-insights')}>
                    View AI Insights
                  </Button>
                </div>
              )}
            </Card>
          </section>

          <section className="today-patients-section">
            <Card title="Patients You Consulted Today" subtitle={`${todayPatients.length} patients`}>
              {loading ? (
                <p className="text-small text-light">Loading...</p>
              ) : todayPatients.length > 0 ? (
                <>
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
                  <Button variant="outline" fullWidth className="m-t" onClick={() => navigate('/doctor/search')}>
                    View All Patients
                  </Button>
                </>
              ) : (
                <div className="empty-state">
                  <p className="text-small text-light">No patients consulted today</p>
                  <Button variant="primary" fullWidth className="m-t" onClick={() => navigate('/doctor/search')}>
                    Search Patients
                  </Button>
                </div>
              )}
            </Card>
          </section>
        </div>
      </div>
    </MainLayout>
  );
};

