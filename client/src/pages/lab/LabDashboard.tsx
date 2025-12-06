import React, { useState } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { Upload, CheckCircle } from 'lucide-react';
import './LabDashboard.css';

export const LabDashboard: React.FC = () => {
  const [uhid, setUhid] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const pendingResults = [
    { id: '1', patient: 'John Doe', uhid: 'UHID-20240115-00001', test: 'Blood Test', date: '2024-01-15', status: 'pending' },
    { id: '2', patient: 'Jane Smith', uhid: 'UHID-20240115-00002', test: 'X-Ray', date: '2024-01-14', status: 'completed' },
  ];

  const prescriptions = [
    { id: '1', patient: 'John Doe', medication: 'Aspirin 325mg', status: 'pending' },
    { id: '2', patient: 'Jane Smith', medication: 'Metformin 500mg', status: 'dispensed' },
  ];

  return (
    <MainLayout role="lab" hospitalName="General Hospital Lab">
      <div className="lab-dashboard">
        <div className="dashboard-header">
          <h1 className="text-page-title">Lab & Pharmacy Dashboard</h1>
          <p className="text-body text-light">Manage lab results and prescriptions</p>
        </div>

        <div className="dashboard-grid">
          <Card title="Upload Lab Result" subtitle="Enter UHID and upload results">
            <div className="upload-form">
              <Input
                label="Patient UHID"
                placeholder="Enter UHID"
                value={uhid}
                onChange={setUhid}
                fullWidth
              />
              <div className="file-upload">
                <label className="file-upload-label">
                  <Upload size={20} />
                  {uploadedFile ? uploadedFile.name : 'Upload PDF/Image'}
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
              <div className="form-actions">
                <Button variant="primary" fullWidth>
                  Auto-AI Extraction
                </Button>
                <Button variant="secondary" fullWidth>
                  Submit to Hospital
                </Button>
              </div>
            </div>
          </Card>

          <Card title="Pending Lab Results" subtitle={`${pendingResults.length} pending`}>
            <div className="results-list">
              {pendingResults.map((result) => (
                <div key={result.id} className="result-item">
                  <div className="result-info">
                    <strong>{result.patient}</strong>
                    <span className="text-small text-mono text-light">{result.uhid}</span>
                    <span className="text-small">{result.test}</span>
                    <span className="text-small text-light">{result.date}</span>
                  </div>
                  <Badge variant={result.status === 'completed' ? 'success' : 'warning'}>
                    {result.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card title="Prescriptions" subtitle="View and dispense medications">
          <div className="prescriptions-list">
            {prescriptions.map((prescription) => (
              <div key={prescription.id} className="prescription-item">
                <div className="prescription-info">
                  <strong>{prescription.patient}</strong>
                  <span className="text-small">{prescription.medication}</span>
                </div>
                <div className="prescription-actions">
                  {prescription.status === 'pending' ? (
                    <Button variant="primary" size="small">
                      Dispense
                    </Button>
                  ) : (
                    <Badge variant="success" icon={<CheckCircle size={14} />}>
                      Dispensed
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

