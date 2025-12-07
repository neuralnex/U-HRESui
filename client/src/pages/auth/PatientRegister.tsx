import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { patientAuthService } from '../../services/patientAuth.service';
import { CheckCircle, AlertCircle } from 'lucide-react';
import './RegisterHospital.css';

export const PatientRegister: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    dateOfBirth: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    email: '',
    phoneNumber: '',
    address: '',
    state: '',
    lga: '',
    ninNumber: '',
    bloodGroup: '',
    genotype: '',
    allergies: '',
    underlyingConditions: '',
    emergencyMedicalNotes: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [createdUHID, setCreatedUHID] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await patientAuthService.register(formData);
      if (response.success) {
        setCreatedUHID(response.data.uhid.uhid);
        setSuccess(true);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || err.response?.data?.message || err.message || 'Failed to register';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="register-page">
        <div className="register-container">
          <Card>
            <div className="success-content">
              <CheckCircle size={48} className="success-icon" />
              <h2 className="text-section-title">Registration Successful!</h2>
              <p className="text-body">Your UHID: <strong className="text-mono">{createdUHID}</strong></p>
              <p className="text-small text-light">Please check your email ({formData.email}) for your UHID details.</p>
              <p className="text-small text-light">You can now use this UHID to log in and access your medical records.</p>
              <Button variant="primary" onClick={() => navigate('/login')} className="m-t">
                Go to Login
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <h1 className="text-page-title">Patient Registration</h1>
          <p className="text-body text-light">Create your Universal Health ID</p>
        </div>

        <Card title="Patient Registration">
          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-row">
              <Input
                label="First Name *"
                value={formData.firstName}
                onChange={(value) => setFormData({ ...formData, firstName: value })}
                fullWidth
                required
              />
              <Input
                label="Last Name *"
                value={formData.lastName}
                onChange={(value) => setFormData({ ...formData, lastName: value })}
                fullWidth
                required
              />
            </div>

            <div className="form-row">
              <Input
                label="Middle Name"
                value={formData.middleName}
                onChange={(value) => setFormData({ ...formData, middleName: value })}
                fullWidth
              />
              <Input
                label="Date of Birth *"
                type="date"
                value={formData.dateOfBirth}
                onChange={(value) => setFormData({ ...formData, dateOfBirth: value })}
                fullWidth
                required
              />
            </div>

            <div className="form-row">
              <div className="input-wrapper input-full-width">
                <label className="input-label">Gender *</label>
                <select
                  className="input"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <Input
                label="Email *"
                type="email"
                value={formData.email}
                onChange={(value) => setFormData({ ...formData, email: value })}
                fullWidth
                required
              />
            </div>

            <Input
              label="Phone Number"
              value={formData.phoneNumber}
              onChange={(value) => setFormData({ ...formData, phoneNumber: value })}
              fullWidth
            />

            <Input
              label="Address"
              value={formData.address}
              onChange={(value) => setFormData({ ...formData, address: value })}
              fullWidth
            />

            <div className="form-row">
              <Input
                label="State"
                value={formData.state}
                onChange={(value) => setFormData({ ...formData, state: value })}
                fullWidth
              />
              <Input
                label="LGA"
                value={formData.lga}
                onChange={(value) => setFormData({ ...formData, lga: value })}
                fullWidth
              />
            </div>

            <div className="form-section-divider"></div>
            <h3 className="text-section-title">Identity Verification</h3>
            <Input
              label="NIN Number"
              value={formData.ninNumber}
              onChange={(value) => setFormData({ ...formData, ninNumber: value })}
              fullWidth
              placeholder="National Identification Number"
            />

            <div className="form-section-divider"></div>
            <h3 className="text-section-title">Medical Background</h3>
            <div className="form-row">
              <div className="input-wrapper input-full-width">
                <label className="input-label">Blood Group</label>
                <select
                  className="input"
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <div className="input-wrapper input-full-width">
                <label className="input-label">Genotype</label>
                <select
                  className="input"
                  value={formData.genotype}
                  onChange={(e) => setFormData({ ...formData, genotype: e.target.value })}
                >
                  <option value="">Select Genotype (if available)</option>
                  <option value="AA">AA</option>
                  <option value="AS">AS</option>
                  <option value="AC">AC</option>
                  <option value="SS">SS</option>
                  <option value="SC">SC</option>
                  <option value="CC">CC</option>
                </select>
              </div>
            </div>

            <Input
              label="Allergies"
              value={formData.allergies}
              onChange={(value) => setFormData({ ...formData, allergies: value })}
              fullWidth
              placeholder="e.g., Penicillin, Peanuts, Dust (comma-separated)"
            />

            <Input
              label="Underlying Conditions"
              value={formData.underlyingConditions}
              onChange={(value) => setFormData({ ...formData, underlyingConditions: value })}
              fullWidth
              placeholder="e.g., Diabetes, Hypertension, Asthma (comma-separated)"
            />

            <div className="input-wrapper input-full-width">
              <label className="input-label">Emergency Medical Notes</label>
              <textarea
                className="textarea"
                rows={4}
                value={formData.emergencyMedicalNotes}
                onChange={(e) => setFormData({ ...formData, emergencyMedicalNotes: e.target.value })}
                placeholder="e.g., Seizures, Implants, Pregnancy, Pacemaker, etc."
              />
            </div>

            <div className="form-section-divider"></div>
            <h3 className="text-section-title">Emergency Contacts</h3>
            <Input
              label="Emergency Contact Name"
              value={formData.emergencyContactName}
              onChange={(value) => setFormData({ ...formData, emergencyContactName: value })}
              fullWidth
            />
            <div className="form-row">
              <Input
                label="Emergency Contact Phone"
                value={formData.emergencyContactPhone}
                onChange={(value) => setFormData({ ...formData, emergencyContactPhone: value })}
                fullWidth
              />
              <div className="input-wrapper input-full-width">
                <label className="input-label">Relationship to Patient</label>
                <select
                  className="input"
                  value={formData.emergencyContactRelationship}
                  onChange={(e) => setFormData({ ...formData, emergencyContactRelationship: e.target.value })}
                >
                  <option value="">Select Relationship</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Parent">Parent</option>
                  <option value="Child">Child</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Relative">Relative</option>
                  <option value="Friend">Friend</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="form-error">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div className="form-actions">
              <Button variant="secondary" onClick={() => navigate('/login')}>
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={loading || !formData.firstName || !formData.lastName || !formData.dateOfBirth || !formData.gender || !formData.email}
              >
                {loading ? 'Registering...' : 'Register'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

