import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Download, FileText, Pill, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { patientAuthService } from '../../services/patientAuth.service';
import './PatientPortal.css';

export const PatientPortal: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [patient, setPatient] = useState<any>(null);
  const [records, setRecords] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (user && user.role === 'patient') {
      loadPatientData();
    }
  }, [user]);

  const loadPatientData = async () => {
    try {
      setLoading(true);
      const [profileResponse, recordsResponse] = await Promise.all([
        patientAuthService.getProfile(),
        patientAuthService.getRecords().catch(() => null),
      ]);

      if (profileResponse.success && profileResponse.data) {
        const uhidData = profileResponse.data;
        setPatient({
          name: `${uhidData.firstName} ${uhidData.lastName}`,
          uhid: uhidData.uhid,
          age: uhidData.dateOfBirth ? Math.floor((new Date().getTime() - new Date(uhidData.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 365)) : null,
          gender: uhidData.gender,
          bloodGroup: uhidData.bloodGroup,
          allergies: uhidData.allergies ? uhidData.allergies.split(',').map((a: string) => a.trim()) : [],
        });
      }

      if (recordsResponse?.success) {
        setRecords(recordsResponse.data);
      }
    } catch (error) {
      console.error('Failed to load patient data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (format: 'json' | 'pdf' = 'json') => {
    try {
      setDownloading(true);
      await patientAuthService.downloadRecords(format);
    } catch (error) {
      console.error('Failed to download records:', error);
      alert('Failed to download records. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!user || user.role !== 'patient') {
    return (
      <div className="patient-portal">
        <Card>
          <div className="empty-state">
            <p className="text-body text-light">Please log in as a patient to access your records.</p>
            <Button variant="primary" onClick={() => navigate('/login')}>
              Go to Login
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="patient-portal">
      <div className="portal-header">
        <div className="header-content">
          <h1 className="text-page-title">My Medical Records</h1>
          <p className="text-body text-light">Access your complete medical history</p>
        </div>
        <div className="header-actions">
          <Button 
            variant="primary" 
            icon={<Download size={16} />}
            onClick={() => handleDownload('json')}
            disabled={downloading}
          >
            {downloading ? 'Downloading...' : 'Download Records'}
          </Button>
          <Button variant="outline" icon={<LogOut size={16} />} onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      {loading ? (
        <Card>
          <p className="text-body text-light">Loading patient data...</p>
        </Card>
      ) : patient ? (
        <div className="patient-info-card">
          <Card>
            <div className="patient-basic">
              <div>
                <h2 className="text-section-title">{patient.name}</h2>
                <div className="patient-details">
                  <Badge variant="info">{patient.uhid}</Badge>
                  {patient.age && <span>{patient.age} years, {patient.gender}</span>}
                  {patient.bloodGroup && <span>Blood Group: {patient.bloodGroup}</span>}
                </div>
              </div>
              {patient.allergies && patient.allergies.length > 0 && (
                <div className="patient-alerts">
                  <div className="alert-item">
                    <strong>Allergies:</strong> {patient.allergies.join(', ')}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      ) : (
        <Card>
          <div className="empty-state">
            <p className="text-body text-light">Patient not found</p>
          </div>
        </Card>
      )}

      {records && (
        <div className="portal-grid">
          <Card title="Medical History" icon={<FileText size={20} />}>
            {records.localRecords?.visits && records.localRecords.visits.length > 0 ? (
              <div className="history-list">
                {records.localRecords.visits.map((record: any, index: number) => (
                  <div key={record.id || index} className="history-item">
                    <div className="history-date">{new Date(record.visitDate || record.date).toLocaleDateString()}</div>
                    <div className="history-details">
                      <strong>{record.department || record.hospital || 'Unknown'}</strong>
                      <p>{record.diagnosis || record.chiefComplaint || 'No diagnosis'}</p>
                      {record.doctorName && <span className="text-small text-light">Dr. {record.doctorName}</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p className="text-small text-light">No medical history available</p>
              </div>
            )}
          </Card>

          <Card title="Current Medications" icon={<Pill size={20} />}>
            {records.localRecords?.prescriptions && records.localRecords.prescriptions.length > 0 ? (
              <div className="medications-list">
                {records.localRecords.prescriptions.map((med: any, index: number) => (
                  <div key={med.id || index} className="medication-item">
                    <div>
                      <strong>{med.medicationName || med.name}</strong>
                      <p className="text-small">{med.dosage} - {med.frequency}</p>
                      {med.prescriptionDate && (
                        <span className="text-small text-light">Since {new Date(med.prescriptionDate).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p className="text-small text-light">No current medications</p>
              </div>
            )}
          </Card>
        </div>
      )}

    </div>
  );
};

