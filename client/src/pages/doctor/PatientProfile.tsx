import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Tabs } from '../../components/common/Tabs';
import { patientService } from '../../services/patient.service';
import { uhidService } from '../../services/uhid.service';
import { Pill, FlaskConical, Send, Download, MessageSquare } from 'lucide-react';
import './PatientProfile.css';

export const PatientProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('summary');
  const [patient, setPatient] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadPatientData();
    }
  }, [id]);

  const loadPatientData = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const [uhidData, summaryData] = await Promise.allSettled([
        uhidService.getUHID(id),
        patientService.getPatientSummary(id),
      ]);

      if (uhidData.status === 'fulfilled' && uhidData.value.success) {
        const uhid = uhidData.value.data;
        setPatient({
          name: `${uhid.firstName} ${uhid.lastName}`,
          age: new Date().getFullYear() - new Date(uhid.dateOfBirth).getFullYear(),
          gender: uhid.gender,
          uhid: uhid.uhid,
          ...uhid,
        });
      }

      if (summaryData.status === 'fulfilled' && summaryData.value.success) {
        setSummary(summaryData.value.data);
      }
    } catch (error) {
      console.error('Failed to load patient data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout role="doctor">
        <div>Loading patient data...</div>
      </MainLayout>
    );
  }

  if (!patient) {
    return (
      <MainLayout role="doctor">
        <Card>Patient not found</Card>
      </MainLayout>
    );
  }

  const tabs = [
    { id: 'summary', label: 'Clinical Summary' },
    { id: 'history', label: 'Full Medical History' },
    { id: 'medications', label: 'Medications' },
    { id: 'vitals', label: 'Vitals & Trends' },
    { id: 'ai', label: 'AI Predictions' },
  ];

  return (
    <MainLayout role="doctor" hospitalName="General Hospital Lagos">
      <div className="patient-profile">
        <div className="patient-header">
          <div className="patient-basic-info">
            {patient.profilePicture && (
              <div className="patient-avatar">
                <img src={patient.profilePicture} alt={patient.name} className="profile-avatar-img" />
              </div>
            )}
            <div className="patient-name-info">
              <h1 className="text-page-title">{patient.name}</h1>
              <div className="patient-meta">
                <Badge variant="info">{patient.uhid}</Badge>
                <span className="text-body">{patient.age} years, {patient.gender}</span>
                {patient.bloodGroup && <span className="text-body">Blood Group: {patient.bloodGroup}</span>}
              </div>
            </div>
          </div>
          <div className="patient-actions">
            <Button
              variant="primary"
              icon={<MessageSquare size={16} />}
              onClick={() => navigate(`/doctor/patients/${patient.uhid}/visits/new`)}
            >
              New Visit
            </Button>
            <Button variant="secondary" icon={<Pill size={16} />}>
              Make Prescription
            </Button>
            <Button variant="secondary" icon={<FlaskConical size={16} />}>
              Order Lab Test
            </Button>
            <Button variant="outline" icon={<Send size={16} />}>
              Refer Patient
            </Button>
          </div>
        </div>

        {patient.allergies && patient.allergies.length > 0 && (
          <div className="patient-alerts">
            <Card className="alert-card">
              <div className="alert-content">
                <strong>Allergies:</strong> {Array.isArray(patient.allergies) ? patient.allergies.join(', ') : patient.allergies}
              </div>
            </Card>
          </div>
        )}

        <div className="patient-content-grid">
          <div className="patient-main-content">
            <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

            {activeTab === 'summary' && (
              <Card title="AI-Generated Clinical Summary">
                <div className="summary-content">
                  {summary ? (
                    <>
                      <p className="text-body">
                        {summary.patient && (
                          <>
                            <strong>Patient:</strong> {summary.patient.firstName} {summary.patient.lastName}<br />
                            <strong>UHID:</strong> {summary.patient.uhid}<br />
                            <strong>Total Visits:</strong> {summary.visits?.length || 0}<br />
                            <strong>Lab Results:</strong> {summary.labResults?.length || 0}<br />
                            <strong>Prescriptions:</strong> {summary.prescriptions?.length || 0}
                          </>
                        )}
                      </p>
                      <Button variant="secondary" className="m-t">
                        Update Summary
                      </Button>
                    </>
                  ) : (
                    <p className="text-body text-light">No summary available</p>
                  )}
                </div>
              </Card>
            )}

            {activeTab === 'history' && (
              <div className="history-tabs">
                <Card title="Recent Visits">
                  {summary?.visits && summary.visits.length > 0 ? (
                    summary.visits.map((visit: any, index: number) => (
                      <div key={index} className="visit-item">
                        <div className="visit-date">
                          {new Date(visit.visitDate).toLocaleDateString()}
                        </div>
                        <div className="visit-details">
                          <h4>{visit.department}</h4>
                          <p><strong>Doctor:</strong> {visit.doctorName}</p>
                          {visit.doctorContact && (
                            <p className="text-small text-light">
                              Contact: {visit.doctorContact}
                              {visit.doctorEmail && ` • ${visit.doctorEmail}`}
                            </p>
                          )}
                          <p><strong>Diagnosis:</strong> {visit.diagnosis}</p>
                          <p><strong>Complaint:</strong> {visit.chiefComplaint}</p>
                          {visit.notes && <p className="text-small">{visit.notes}</p>}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-body text-light">No visits recorded</p>
                  )}
                </Card>
                <Card title="Lab Results">
                  {summary?.labResults && summary.labResults.length > 0 ? (
                    summary.labResults.map((lab: any, index: number) => (
                      <div key={index} className="lab-result-item">
                        <span>{lab.testName}: {lab.result} {lab.unit}</span>
                        <Badge variant={lab.status === 'Normal' ? 'success' : 'error'}>
                          {lab.status}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-body text-light">No lab results</p>
                  )}
                </Card>
              </div>
            )}

            {activeTab === 'medications' && (
              <Card title="Current Medications">
                <div className="medication-list">
                  {summary?.prescriptions && summary.prescriptions.length > 0 ? (
                    summary.prescriptions.map((prescription: any, index: number) => (
                      <div key={index} className="medication-item">
                        <div>
                          <strong>{prescription.medicationName}</strong> - {prescription.dosage} ({prescription.frequency})
                        </div>
                        <Badge variant={prescription.isActive ? 'success' : 'default'}>
                          {prescription.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-body text-light">No medications</p>
                  )}
                </div>
              </Card>
            )}

            {activeTab === 'ai' && (
              <Card title="AI Predictions & Risk Assessment">
                <div className="ai-predictions">
                  <div className="risk-score">
                    <h3>Overall Risk Score</h3>
                    <div className="score-value">3.2 / 4.0</div>
                    <Badge variant="error">High Risk</Badge>
                  </div>
                  <div className="predictions-list">
                    <div className="prediction-item">
                      <strong>Early Warning:</strong> Elevated risk of recurrent cardiac events
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>

          <div className="patient-sidebar">
            <Card title="Quick Actions">
              <div className="sidebar-actions">
                <Button variant="primary" fullWidth icon={<Pill size={16} />}>
                  Make Prescription
                </Button>
                <Button variant="secondary" fullWidth icon={<FlaskConical size={16} />}>
                  Order Lab Test
                </Button>
                <Button variant="outline" fullWidth icon={<Send size={16} />}>
                  Refer Patient
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  icon={<Download size={16} />}
                  onClick={() => navigate(`/doctor/exchange/${patient.uhid}`)}
                >
                  Request Records
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

