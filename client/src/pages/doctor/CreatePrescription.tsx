import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { patientService } from '../../services/patient.service';
import { CheckCircle, AlertCircle } from 'lucide-react';
import './CreatePrescription.css';

export const CreatePrescription: React.FC = () => {
  const { id: uhid } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    prescriptionDate: new Date().toISOString().slice(0, 16),
    medicationName: '',
    genericName: '',
    dosage: '',
    frequency: '',
    duration: '',
    quantity: '',
    route: '',
    instructions: '',
    prescribedBy: '',
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

      if (!formData.medicationName || !formData.dosage || !formData.frequency || !formData.duration) {
        throw new Error('Medication name, dosage, frequency, and duration are required');
      }

      const response = await patientService.createPrescription(uhid, {
        prescriptionDate: new Date(formData.prescriptionDate).toISOString(),
        medicationName: formData.medicationName,
        genericName: formData.genericName || undefined,
        dosage: formData.dosage,
        frequency: formData.frequency,
        duration: formData.duration,
        quantity: formData.quantity ? parseInt(formData.quantity) : undefined,
        route: formData.route || undefined,
        instructions: formData.instructions || undefined,
        prescribedBy: formData.prescribedBy || undefined,
      });

      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate(`/doctor/patients/${uhid}`);
        }, 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to create prescription');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <MainLayout role="doctor">
        <div className="create-prescription">
          <Card>
            <div className="success-content">
              <CheckCircle size={48} className="success-icon" />
              <h2 className="text-section-title">Prescription Created Successfully!</h2>
              <p className="text-body">Redirecting to patient profile...</p>
            </div>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout role="doctor">
      <div className="create-prescription">
        <div className="page-header">
          <h1 className="text-page-title">Create Prescription</h1>
          <p className="text-body text-light">UHID: <span className="text-mono">{uhid}</span></p>
        </div>

        <Card title="Prescription Details">
          <form onSubmit={handleSubmit} className="prescription-form">
            <div className="form-row">
              <Input
                label="Prescription Date *"
                type="datetime-local"
                value={formData.prescriptionDate}
                onChange={(value) => setFormData({ ...formData, prescriptionDate: value })}
                fullWidth
                required
              />
              <Input
                label="Prescribed By"
                placeholder="Doctor name"
                value={formData.prescribedBy}
                onChange={(value) => setFormData({ ...formData, prescribedBy: value })}
                fullWidth
              />
            </div>

            <div className="form-row">
              <Input
                label="Medication Name *"
                placeholder="e.g., Paracetamol"
                value={formData.medicationName}
                onChange={(value) => setFormData({ ...formData, medicationName: value })}
                fullWidth
                required
              />
              <Input
                label="Generic Name"
                placeholder="e.g., Acetaminophen"
                value={formData.genericName}
                onChange={(value) => setFormData({ ...formData, genericName: value })}
                fullWidth
              />
            </div>

            <div className="form-row">
              <Input
                label="Dosage *"
                placeholder="e.g., 500mg"
                value={formData.dosage}
                onChange={(value) => setFormData({ ...formData, dosage: value })}
                fullWidth
                required
              />
              <Input
                label="Frequency *"
                placeholder="e.g., Twice daily"
                value={formData.frequency}
                onChange={(value) => setFormData({ ...formData, frequency: value })}
                fullWidth
                required
              />
            </div>

            <div className="form-row">
              <Input
                label="Duration *"
                placeholder="e.g., 7 days"
                value={formData.duration}
                onChange={(value) => setFormData({ ...formData, duration: value })}
                fullWidth
                required
              />
              <Input
                label="Quantity"
                type="number"
                placeholder="Number of units"
                value={formData.quantity}
                onChange={(value) => setFormData({ ...formData, quantity: value })}
                fullWidth
              />
            </div>

            <div className="form-row">
              <div className="input-wrapper input-full-width">
                <label className="input-label">Route of Administration</label>
                <select
                  className="input"
                  value={formData.route}
                  onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                >
                  <option value="">Select Route</option>
                  <option value="Oral">Oral</option>
                  <option value="Intravenous">Intravenous (IV)</option>
                  <option value="Intramuscular">Intramuscular (IM)</option>
                  <option value="Subcutaneous">Subcutaneous</option>
                  <option value="Topical">Topical</option>
                  <option value="Inhalation">Inhalation</option>
                  <option value="Rectal">Rectal</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="input-wrapper input-full-width">
              <label className="input-label">Instructions</label>
              <textarea
                className="textarea"
                rows={4}
                placeholder="Special instructions for the patient..."
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
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
                disabled={loading || !formData.medicationName || !formData.dosage || !formData.frequency || !formData.duration}
              >
                {loading ? 'Creating...' : 'Create Prescription'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </MainLayout>
  );
};

