import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { patientService } from '../../services/patient.service';
import { CheckCircle, AlertCircle } from 'lucide-react';
import './CreateLabTest.css';

export const CreateLabTest: React.FC = () => {
  const { id: uhid } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    testDate: new Date().toISOString().slice(0, 16),
    testName: '',
    testType: '',
    result: '',
    unit: '',
    referenceRange: '',
    status: 'Normal',
    labTechnicianId: '',
    reviewedBy: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!uhid) {
        throw new Error('UHID is required');
      }

      if (!formData.testDate || !formData.testName || !formData.testType) {
        throw new Error('Test date, test name, and test type are required');
      }

      const response = await patientService.createLabResult(uhid, {
        testDate: new Date(formData.testDate).toISOString(),
        testName: formData.testName,
        testType: formData.testType,
        result: formData.result || undefined,
        unit: formData.unit || undefined,
        referenceRange: formData.referenceRange || undefined,
        status: formData.status || undefined,
        labTechnicianId: formData.labTechnicianId || undefined,
        reviewedBy: formData.reviewedBy || undefined,
        notes: formData.notes || undefined,
      });

      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate(`/doctor/patients/${uhid}`);
        }, 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to create lab result');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <MainLayout role="doctor">
        <div className="create-lab-test">
          <Card>
            <div className="success-content">
              <CheckCircle size={48} className="success-icon" />
              <h2 className="text-section-title">Lab Test Ordered Successfully!</h2>
              <p className="text-body">Redirecting to patient profile...</p>
            </div>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout role="doctor">
      <div className="create-lab-test">
        <div className="page-header">
          <h1 className="text-page-title">Order Lab Test</h1>
          <p className="text-body text-light">UHID: <span className="text-mono">{uhid}</span></p>
        </div>

        <Card title="Lab Test Details">
          <form onSubmit={handleSubmit} className="lab-test-form">
            <div className="form-row">
              <Input
                label="Test Date *"
                type="datetime-local"
                value={formData.testDate}
                onChange={(value) => setFormData({ ...formData, testDate: value })}
                fullWidth
                required
              />
              <div className="input-wrapper input-full-width">
                <label className="input-label">Test Type *</label>
                <select
                  className="input"
                  value={formData.testType}
                  onChange={(e) => setFormData({ ...formData, testType: e.target.value })}
                  required
                >
                  <option value="">Select Test Type</option>
                  <option value="Blood Test">Blood Test</option>
                  <option value="Urine Test">Urine Test</option>
                  <option value="X-Ray">X-Ray</option>
                  <option value="CT Scan">CT Scan</option>
                  <option value="MRI">MRI</option>
                  <option value="Ultrasound">Ultrasound</option>
                  <option value="ECG">ECG</option>
                  <option value="Biopsy">Biopsy</option>
                  <option value="Culture">Culture</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <Input
              label="Test Name *"
              placeholder="e.g., Complete Blood Count (CBC)"
              value={formData.testName}
              onChange={(value) => setFormData({ ...formData, testName: value })}
              fullWidth
              required
            />

            <div className="form-row">
              <Input
                label="Result"
                placeholder="Test result value"
                value={formData.result}
                onChange={(value) => setFormData({ ...formData, result: value })}
                fullWidth
              />
              <Input
                label="Unit"
                placeholder="e.g., mg/dL, mmol/L"
                value={formData.unit}
                onChange={(value) => setFormData({ ...formData, unit: value })}
                fullWidth
              />
            </div>

            <div className="form-row">
              <Input
                label="Reference Range"
                placeholder="e.g., 70-100 mg/dL"
                value={formData.referenceRange}
                onChange={(value) => setFormData({ ...formData, referenceRange: value })}
                fullWidth
              />
              <div className="input-wrapper input-full-width">
                <label className="input-label">Status</label>
                <select
                  className="input"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Normal">Normal</option>
                  <option value="Abnormal">Abnormal</option>
                  <option value="Critical">Critical</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <Input
                label="Lab Technician ID"
                placeholder="Technician identifier"
                value={formData.labTechnicianId}
                onChange={(value) => setFormData({ ...formData, labTechnicianId: value })}
                fullWidth
              />
              <Input
                label="Reviewed By"
                placeholder="Reviewer name"
                value={formData.reviewedBy}
                onChange={(value) => setFormData({ ...formData, reviewedBy: value })}
                fullWidth
              />
            </div>

            <div className="input-wrapper input-full-width">
              <label className="input-label">Notes</label>
              <textarea
                className="textarea"
                rows={4}
                placeholder="Additional notes or observations..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            {error && (
              <div className="form-error">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div className="form-actions">
              <Button variant="secondary" onClick={() => navigate(`/doctor/patients/${uhid}`)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={loading || !formData.testName || !formData.testType}
              >
                {loading ? 'Creating...' : 'Order Lab Test'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </MainLayout>
  );
};

