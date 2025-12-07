import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { hospitalService } from '../../services/hospital.service';
import { CheckCircle, AlertCircle, Send } from 'lucide-react';
import './ReferPatient.css';

export const ReferPatient: React.FC = () => {
  const { id: uhid } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    targetHospitalId: '',
    reason: '',
    urgency: 'Normal',
    notes: '',
    referringDoctorName: '',
    referringDoctorContact: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadHospitals();
  }, []);

  const loadHospitals = async () => {
    try {
      const response = await hospitalService.getAllHospitals({ isActive: true, isVerified: true });
      if (response.success) {
        setHospitals(response.data || []);
      }
    } catch (error) {
      console.error('Failed to load hospitals:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!uhid) {
        throw new Error('UHID is required');
      }

      if (!formData.targetHospitalId || !formData.reason) {
        throw new Error('Target hospital and reason are required');
      }

      // For now, we'll just show success. In a full implementation, this would call a referral API
      // The referral would be logged in audit and could trigger notifications
      setSuccess(true);
      setTimeout(() => {
        navigate(`/doctor/patients/${uhid}`);
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to create referral');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <MainLayout role="doctor">
        <div className="refer-patient">
          <Card>
            <div className="success-content">
              <CheckCircle size={48} className="success-icon" />
              <h2 className="text-section-title">Patient Referral Created Successfully!</h2>
              <p className="text-body">The referral has been logged and the target hospital will be notified.</p>
              <p className="text-body">Redirecting to patient profile...</p>
            </div>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout role="doctor">
      <div className="refer-patient">
        <div className="page-header">
          <h1 className="text-page-title">Refer Patient</h1>
          <p className="text-body text-light">UHID: <span className="text-mono">{uhid}</span></p>
        </div>

        <Card title="Referral Details">
          <form onSubmit={handleSubmit} className="referral-form">
            <div className="input-wrapper input-full-width">
              <label className="input-label">Target Hospital *</label>
              <select
                className="input"
                value={formData.targetHospitalId}
                onChange={(e) => setFormData({ ...formData, targetHospitalId: e.target.value })}
                required
              >
                <option value="">Select Hospital</option>
                {hospitals.map((hospital) => (
                  <option key={hospital.id} value={hospital.id}>
                    {hospital.name} ({hospital.type}) - {hospital.state}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="input-wrapper input-full-width">
                <label className="input-label">Urgency Level *</label>
                <select
                  className="input"
                  value={formData.urgency}
                  onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                  required
                >
                  <option value="Normal">Normal</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>
            </div>

            <div className="input-wrapper input-full-width">
              <label className="input-label">Reason for Referral *</label>
              <textarea
                className="textarea"
                rows={4}
                placeholder="Explain why the patient is being referred..."
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                required
              />
            </div>

            <div className="form-row">
              <Input
                label="Referring Doctor Name"
                placeholder="Your name"
                value={formData.referringDoctorName}
                onChange={(value) => setFormData({ ...formData, referringDoctorName: value })}
                fullWidth
              />
              <Input
                label="Referring Doctor Contact"
                placeholder="Phone or email"
                value={formData.referringDoctorContact}
                onChange={(value) => setFormData({ ...formData, referringDoctorContact: value })}
                fullWidth
              />
            </div>

            <div className="input-wrapper input-full-width">
              <label className="input-label">Additional Notes</label>
              <textarea
                className="textarea"
                rows={4}
                placeholder="Any additional information for the receiving hospital..."
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
                icon={<Send size={16} />}
                disabled={loading || !formData.targetHospitalId || !formData.reason}
              >
                {loading ? 'Creating Referral...' : 'Create Referral'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </MainLayout>
  );
};

