import React from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Download, UserPlus, FileText, Pill } from 'lucide-react';
import './PatientPortal.css';

export const PatientPortal: React.FC = () => {
  const uhid = 'UHID-20240115-00001';

  const patient = {
    name: 'John Doe',
    age: 45,
    gender: 'Male',
    bloodGroup: 'O+',
    allergies: ['Penicillin', 'Aspirin'],
  };

  const medicalHistory = [
    { date: '2024-01-15', hospital: 'Lagos General', diagnosis: 'Acute Inferior STEMI', doctor: 'Dr. Sarah Johnson' },
    { date: '2023-12-10', hospital: 'Abuja Medical', diagnosis: 'Hypertension Check-up', doctor: 'Dr. Michael Brown' },
  ];

  const medications = [
    { name: 'Aspirin', dosage: '325mg', frequency: 'Daily', startDate: '2024-01-15' },
    { name: 'Atorvastatin', dosage: '80mg', frequency: 'Daily', startDate: '2024-01-15' },
  ];

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

      <div className="patient-info-card">
        <Card>
          <div className="patient-basic">
            <div>
              <h2 className="text-section-title">{patient.name}</h2>
              <div className="patient-details">
                <Badge variant="info">{uhid}</Badge>
                <span>{patient.age} years, {patient.gender}</span>
                <span>Blood Group: {patient.bloodGroup}</span>
              </div>
            </div>
            <div className="patient-alerts">
              <div className="alert-item">
                <strong>Allergies:</strong> {patient.allergies.join(', ')}
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="portal-grid">
        <Card title="Medical History" icon={<FileText size={20} />}>
          <div className="history-list">
            {medicalHistory.map((record, index) => (
              <div key={index} className="history-item">
                <div className="history-date">{record.date}</div>
                <div className="history-details">
                  <strong>{record.hospital}</strong>
                  <p>{record.diagnosis}</p>
                  <span className="text-small text-light">Dr. {record.doctor}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Current Medications" icon={<Pill size={20} />}>
          <div className="medications-list">
            {medications.map((med, index) => (
              <div key={index} className="medication-item">
                <div>
                  <strong>{med.name}</strong>
                  <p className="text-small">{med.dosage} - {med.frequency}</p>
                  <span className="text-small text-light">Since {med.startDate}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

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

