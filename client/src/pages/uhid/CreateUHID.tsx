import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { WebcamCapture } from '../../components/common/WebcamCapture';
import { uhidService } from '../../services/uhid.service';
import type { CreateUHIDData } from '../../services/uhid.service';
import { CheckCircle, AlertCircle, Camera } from 'lucide-react';
import './CreateUHID.css';

export const CreateUHID: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CreateUHIDData>({
    firstName: '',
    lastName: '',
    middleName: '',
    dateOfBirth: '',
    gender: 'Male',
    phoneNumber: '',
    email: '',
    address: '',
    state: '',
    lga: '',
    profilePicture: '',
  });
  const [showWebcam, setShowWebcam] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [createdUHID, setCreatedUHID] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await uhidService.createUHID(formData);
      if (response.success) {
        setCreatedUHID(response.data.uhid);
        setSuccess(true);
        setTimeout(() => {
          navigate(`/doctor/patients/${response.data.uhid}`);
        }, 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create UHID');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <MainLayout role="doctor">
        <div className="create-uhid-success">
          <Card>
            <div className="success-content">
              <CheckCircle size={48} className="success-icon" />
              <h2 className="text-section-title">UHID Created Successfully!</h2>
              <p className="text-body">UHID: <strong className="text-mono">{createdUHID}</strong></p>
              <p className="text-small text-light">Redirecting to patient profile...</p>
            </div>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout role="doctor">
      <div className="create-uhid">
        <div className="page-header">
          <h1 className="text-page-title">Register New Patient</h1>
          <p className="text-body text-light">Create a new Universal Health ID</p>
        </div>

        <Card title="Patient Information">
          <form onSubmit={handleSubmit} className="uhid-form">
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
                value={formData.middleName || ''}
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
                label="Phone Number"
                value={formData.phoneNumber || ''}
                onChange={(value) => setFormData({ ...formData, phoneNumber: value })}
                fullWidth
              />
            </div>

            <Input
              label="Email"
              type="email"
              value={formData.email || ''}
              onChange={(value) => setFormData({ ...formData, email: value })}
              fullWidth
            />

            <Input
              label="Address"
              value={formData.address || ''}
              onChange={(value) => setFormData({ ...formData, address: value })}
              fullWidth
            />

            <div className="form-row">
              <Input
                label="State"
                value={formData.state || ''}
                onChange={(value) => setFormData({ ...formData, state: value })}
                fullWidth
              />
              <Input
                label="LGA"
                value={formData.lga || ''}
                onChange={(value) => setFormData({ ...formData, lga: value })}
                fullWidth
              />
            </div>

            <div className="profile-picture-section">
              <label className="input-label">Profile Picture *</label>
              {!showWebcam && !formData.profilePicture && (
                <div className="webcam-trigger">
                  <Button
                    variant="secondary"
                    icon={<Camera size={16} />}
                    onClick={() => setShowWebcam(true)}
                  >
                    Capture Photo
                  </Button>
                  <p className="text-small text-light">
                    Take a photo using your webcam for patient identification
                  </p>
                </div>
              )}
              {showWebcam && (
                <div className="webcam-container">
                  <WebcamCapture
                    onCapture={(imageDataUrl) => {
                      setFormData({ ...formData, profilePicture: imageDataUrl });
                      setShowWebcam(false);
                    }}
                    onCancel={() => setShowWebcam(false)}
                  />
                </div>
              )}
              {formData.profilePicture && !showWebcam && (
                <div className="profile-preview">
                  <img src={formData.profilePicture} alt="Profile" className="profile-image" />
                  <Button
                    variant="outline"
                    icon={<Camera size={16} />}
                    onClick={() => setShowWebcam(true)}
                  >
                    Retake Photo
                  </Button>
                </div>
              )}
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
              <Button
                variant="primary"
                type="submit"
                disabled={loading || !formData.profilePicture}
              >
                {loading ? 'Creating...' : 'Create UHID'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </MainLayout>
  );
};

