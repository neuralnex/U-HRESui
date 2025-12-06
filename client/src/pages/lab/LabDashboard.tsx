import React, { useState, useEffect } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { Upload, CheckCircle } from 'lucide-react';
import { patientService } from '../../services/patient.service';
import './LabDashboard.css';

export const LabDashboard: React.FC = () => {
  const [uhid, setUhid] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [pendingResults, setPendingResults] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setPendingResults([]);
      setPrescriptions([]);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setPendingResults([]);
      setPrescriptions([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout role="lab">
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
            {loading ? (
              <p className="text-small text-light">Loading...</p>
            ) : pendingResults.length > 0 ? (
              <div className="results-list">
                {pendingResults.map((result, index) => (
                  <div key={result.id || index} className="result-item">
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
            ) : (
              <div className="empty-state">
                <p className="text-small text-light">No pending lab results</p>
              </div>
            )}
          </Card>
        </div>

        <Card title="Prescriptions" subtitle="View and dispense medications">
          {loading ? (
            <p className="text-small text-light">Loading...</p>
          ) : prescriptions.length > 0 ? (
            <div className="prescriptions-list">
              {prescriptions.map((prescription, index) => (
                <div key={prescription.id || index} className="prescription-item">
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
          ) : (
            <div className="empty-state">
              <p className="text-small text-light">No prescriptions to dispense</p>
            </div>
          )}
        </Card>
      </div>
    </MainLayout>
  );
};

