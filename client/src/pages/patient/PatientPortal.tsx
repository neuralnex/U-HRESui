import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Download, UserPlus, FileText, Pill } from 'lucide-react';
import { uhidService } from '../../services/uhid.service';
import { patientService } from '../../services/patient.service';
import './PatientPortal.css';

export const PatientPortal: React.FC = () => {
  const { uhid: uhidParam } = useParams<{ uhid: string }>();
  const [uhid, setUhid] = useState(uhidParam || '');
  const [patient, setPatient] = useState<any>(null);
  const [medicalHistory, setMedicalHistory] = useState<any[]>([]);
  const [medications, setMedications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (uhid) {
      loadPatientData();
    }
  }, [uhid]);

  const loadPatientData = async () => {
    if (!uhid) return;
    
    try {
      setLoading(true);
      const [uhidResponse, summaryResponse] = await Promise.all([
        uhidService.getUHID(uhid),
        patientService.getPatientSummary(uhid).catch(() => null),
      ]);

      if (uhidResponse.success && uhidResponse.data) {
        const uhidData = uhidResponse.data;
        setPatient({
          name: `${uhidData.firstName} ${uhidData.lastName}`,
          age: uhidData.dateOfBirth ? Math.floor((new Date().getTime() - new Date(uhidData.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 365)) : null,
          gender: uhidData.gender,
          bloodGroup: null,
          allergies: [],
        });
      }

      if (summaryResponse?.success && summaryResponse.data) {
        setMedicalHistory(summaryResponse.data.visits || []);
        setMedications(summaryResponse.data.prescriptions || []);
      }
    } catch (error) {
      console.error('Failed to load patient data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="patient-portal">
      <div className="portal-header">
        <div className="header-content">
          <h1 className="text-page-title">My Medical Records</h1>
          <p className="text-body text-light">Access your complete medical history</p>
        </div>
        <Button variant="primary" icon={<Download size={16} />}>
          Download All Records
        </Button>
      </div>

      {!uhid ? (
        <Card>
          <div className="empty-state">
            <p className="text-body text-light">Please enter your UHID to view your medical records</p>
            <input
              type="text"
              placeholder="Enter your UHID"
              value={uhid}
              onChange={(e) => setUhid(e.target.value)}
              className="input"
              style={{ marginTop: '1rem', padding: '0.75rem', width: '100%' }}
            />
            <Button variant="primary" onClick={loadPatientData} style={{ marginTop: '1rem' }}>
              Load Records
            </Button>
          </div>
        </Card>
      ) : loading ? (
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
                  <Badge variant="info">{uhid}</Badge>
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

      {patient && (
        <div className="portal-grid">
          <Card title="Medical History" icon={<FileText size={20} />}>
            {medicalHistory.length > 0 ? (
              <div className="history-list">
                {medicalHistory.map((record, index) => (
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
            {medications.length > 0 ? (
              <div className="medications-list">
                {medications.map((med, index) => (
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

      <Card title="Emergency Contacts">
        <div className="emergency-contacts">
          <Button variant="outline" icon={<UserPlus size={16} />}>
            Add Emergency Contact
          </Button>
        </div>
      </Card>

      <Card title="Grant Temporary Access">
        <div className="access-grant">
          <p className="text-body text-light">
            Grant temporary access to a healthcare provider
          </p>
          <Button variant="secondary">
            Grant Access
          </Button>
        </div>
      </Card>
    </div>
  );
};

