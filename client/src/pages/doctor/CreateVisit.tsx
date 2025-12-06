import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { patientService } from '../../services/patient.service';
import type { CreateVisitData } from '../../services/patient.service';
import { uhidService } from '../../services/uhid.service';
import { CheckCircle, AlertCircle } from 'lucide-react';
import './CreateVisit.css';

export const CreateVisit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<any>(null);
  const [formData, setFormData] = useState<CreateVisitData>({
    visitDate: new Date().toISOString().split('T')[0] + 'T' + new Date().toTimeString().split(' ')[0],
    doctorId: '',
    doctorName: '',
    doctorContact: '',
    doctorEmail: '',
    department: '',
    chiefComplaint: '',
    diagnosis: '',
    notes: '',
    isEmergency: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      loadPatient();
    }
  }, [id]);

  const loadPatient = async () => {
    if (!id) return;

    try {
      const response = await uhidService.getUHID(id);
      if (response.success) {
        const uhid = response.data;
        setPatient({
          name: `${uhid.firstName} ${uhid.lastName}`,
          uhid: uhid.uhid,
        });
      }
    } catch (error) {
      console.error('Failed to load patient:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!id) return;

    try {
      const response = await patientService.createVisit(id, formData);
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate(`/doctor/patients/${id}`);
        }, 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create visit');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <MainLayout role="doctor">
        <div className="create-visit-success">
          <Card>
            <div className="success-content">
              <CheckCircle size={48} className="success-icon" />
              <h2 className="text-section-title">Visit Created Successfully!</h2>
              <p className="text-small text-light">Redirecting to patient profile...</p>
            </div>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout role="doctor">
      <div className="create-visit">
        <div className="page-header">
          <h1 className="text-page-title">Create Visit Record</h1>
          {patient && (
            <p className="text-body text-light">
              Patient: <strong>{patient.name}</strong> ({patient.uhid})
            </p>
          )}
        </div>

        <Card title="Visit Information">
          <form onSubmit={handleSubmit} className="visit-form">
            <div className="form-row">
              <Input
                label="Visit Date & Time *"
                type="datetime-local"
                value={formData.visitDate}
                onChange={(value) => setFormData({ ...formData, visitDate: value })}
                fullWidth
                required
              />
              <Input
                label="Department *"
                value={formData.department}
                onChange={(value) => setFormData({ ...formData, department: value })}
                placeholder="e.g., Emergency, Cardiology"
                fullWidth
                required
              />
            </div>

            <div className="form-row">
              <Input
                label="Doctor Name *"
                value={formData.doctorName}
                onChange={(value) => setFormData({ ...formData, doctorName: value })}
                fullWidth
                required
              />
              <Input
                label="Doctor ID"
                value={formData.doctorId || ''}
                onChange={(value) => setFormData({ ...formData, doctorId: value })}
                fullWidth
              />
            </div>

            <div className="form-row">
              <Input
                label="Doctor Contact *"
                value={formData.doctorContact || ''}
                onChange={(value) => setFormData({ ...formData, doctorContact: value })}
                placeholder="Phone number"
                fullWidth
                required
              />
              <Input
                label="Doctor Email *"
                type="email"
                value={formData.doctorEmail || ''}
                onChange={(value) => setFormData({ ...formData, doctorEmail: value })}
                placeholder="email@example.com"
                fullWidth
                required
              />
            </div>

            <Input
              label="Chief Complaint *"
              value={formData.chiefComplaint}
              onChange={(value) => setFormData({ ...formData, chiefComplaint: value })}
              placeholder="Patient's main complaint"
              fullWidth
              required
            />

            <Input
              label="Diagnosis *"
              value={formData.diagnosis}
              onChange={(value) => setFormData({ ...formData, diagnosis: value })}
              placeholder="Primary diagnosis"
              fullWidth
              required
            />

            <div className="input-wrapper input-full-width">
              <label className="input-label">Notes</label>
              <textarea
                className="textarea"
                rows={4}
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes about the visit"
              />
            </div>

            <div className="input-wrapper input-full-width">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.isEmergency}
                  onChange={(e) => setFormData({ ...formData, isEmergency: e.target.checked })}
                />
                <span>Emergency Visit</span>
              </label>
            </div>

            {error && (
              <div className="form-error">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div className="form-actions">
              <Button variant="secondary" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Visit'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </MainLayout>
  );
};

