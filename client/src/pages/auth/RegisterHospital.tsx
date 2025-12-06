import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { authService } from '../../services/auth.service';
import type { HospitalRegisterData } from '../../services/auth.service';
import { CheckCircle, AlertCircle } from 'lucide-react';
import './RegisterHospital.css';

export const RegisterHospital: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<HospitalRegisterData>({
    name: '',
    description: '',
    type: 'Public',
    address: '',
    state: '',
    lga: '',
    phoneNumber: '',
    email: '',
    apiEndpoint: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [hospitalCode, setHospitalCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.registerHospital(formData);
      if (response.success) {
        setHospitalCode(response.data.hospitalCode);
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register hospital');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="register-page">
        <div className="register-container">
          <Card className="success-card">
            <div className="success-content">
              <CheckCircle size={48} className="success-icon" />
              <h1 className="text-page-title">Registration Successful!</h1>
              <p className="text-body">
                Your hospital has been registered successfully.
              </p>
              <div className="hospital-code-display">
                <p className="text-small text-light">Your Hospital Code:</p>
                <p className="text-mono text-section-title">{hospitalCode}</p>
                <p className="text-small text-light">
                  This code has been sent to your email. Please save it securely.
                </p>
              </div>
              <Button variant="primary" onClick={() => navigate('/login')}>
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
          <h1 className="text-page-title">🏥 Register Hospital</h1>
          <p className="text-body text-light">Join the U-HRES network</p>
        </div>

        <Card className="register-card">
          <form onSubmit={handleSubmit} className="register-form">
            <Input
              label="Hospital Name *"
              value={formData.name}
              onChange={(value) => setFormData({ ...formData, name: value })}
              fullWidth
              required
            />

            <div className="input-wrapper input-full-width">
              <label className="input-label">Hospital Type *</label>
              <select
                className="input"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                required
              >
                <option value="Public">Public</option>
                <option value="Private">Private</option>
                <option value="Clinic">Clinic</option>
                <option value="Laboratory">Laboratory</option>
                <option value="Pharmacy">Pharmacy</option>
              </select>
            </div>

            <Input
              label="Description"
              value={formData.description || ''}
              onChange={(value) => setFormData({ ...formData, description: value })}
              fullWidth
            />

            <Input
              label="Address *"
              value={formData.address}
              onChange={(value) => setFormData({ ...formData, address: value })}
              fullWidth
              required
            />

            <div className="form-row">
              <Input
                label="State *"
                value={formData.state}
                onChange={(value) => setFormData({ ...formData, state: value })}
                fullWidth
                required
              />
              <Input
                label="LGA *"
                value={formData.lga}
                onChange={(value) => setFormData({ ...formData, lga: value })}
                fullWidth
                required
              />
            </div>

            <div className="form-row">
              <Input
                label="Phone Number *"
                value={formData.phoneNumber}
                onChange={(value) => setFormData({ ...formData, phoneNumber: value })}
                fullWidth
                required
              />
              <Input
                label="Email"
                type="email"
                value={formData.email || ''}
                onChange={(value) => setFormData({ ...formData, email: value })}
                fullWidth
              />
            </div>

            <Input
              label="API Endpoint (Optional)"
              value={formData.apiEndpoint || ''}
              onChange={(value) => setFormData({ ...formData, apiEndpoint: value })}
              placeholder="https://your-hospital.com/api"
              fullWidth
            />

            {error && (
              <div className="form-error">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <Button variant="primary" fullWidth type="submit" disabled={loading}>
              {loading ? 'Registering...' : 'Register Hospital'}
            </Button>

            <p className="register-footer text-small text-light">
              Already registered? <a href="/login">Login here</a>
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
};

