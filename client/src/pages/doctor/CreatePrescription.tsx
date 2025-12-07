import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { patientService } from '../../services/patient.service';
import { CheckCircle, AlertCircle, Plus, X } from 'lucide-react';
import './CreatePrescription.css';

interface Medication {
  medicationName: string;
  genericName: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: string;
  route: string;
  instructions: string;
}

export const CreatePrescription: React.FC = () => {
  const { id: uhid } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [prescriptionDate, setPrescriptionDate] = useState(new Date().toISOString().slice(0, 16));
  const [prescribedBy, setPrescribedBy] = useState('');
  const [medications, setMedications] = useState<Medication[]>([
    {
      medicationName: '',
      genericName: '',
      dosage: '',
      frequency: '',
      duration: '',
      quantity: '',
      route: '',
      instructions: '',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const addMedication = () => {
    setMedications([
      ...medications,
      {
        medicationName: '',
        genericName: '',
        dosage: '',
        frequency: '',
        duration: '',
        quantity: '',
        route: '',
        instructions: '',
      },
    ]);
  };

  const removeMedication = (index: number) => {
    if (medications.length > 1) {
      setMedications(medications.filter((_, i) => i !== index));
    }
  };

  const updateMedication = (index: number, field: keyof Medication, value: string) => {
    const updated = [...medications];
    updated[index] = { ...updated[index], [field]: value };
    setMedications(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!uhid) {
        throw new Error('UHID is required');
      }

      // Validate all medications
      for (let i = 0; i < medications.length; i++) {
        const med = medications[i];
        if (!med.medicationName || !med.dosage || !med.frequency || !med.duration) {
          throw new Error(`Medication ${i + 1}: Medication name, dosage, frequency, and duration are required`);
        }
      }

      // Create all prescriptions
      const prescriptionPromises = medications.map((med) =>
        patientService.createPrescription(uhid, {
          prescriptionDate: new Date(prescriptionDate).toISOString(),
          medicationName: med.medicationName,
          genericName: med.genericName || undefined,
          dosage: med.dosage,
          frequency: med.frequency,
          duration: med.duration,
          quantity: med.quantity ? parseInt(med.quantity) : undefined,
          route: med.route || undefined,
          instructions: med.instructions || undefined,
          prescribedBy: prescribedBy || undefined,
        })
      );

      const responses = await Promise.all(prescriptionPromises);
      const allSuccess = responses.every((r) => r.success);

      if (allSuccess) {
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
                value={prescriptionDate}
                onChange={setPrescriptionDate}
                fullWidth
                required
              />
              <Input
                label="Prescribed By"
                placeholder="Doctor name"
                value={prescribedBy}
                onChange={setPrescribedBy}
                fullWidth
              />
            </div>

            <div className="medications-section">
              <div className="medications-header">
                <h3 className="text-section-title">Medications</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="small"
                  icon={<Plus size={16} />}
                  onClick={addMedication}
                >
                  Add Medication
                </Button>
              </div>

              {medications.map((medication, index) => (
                <Card key={index} className="medication-card">
                  <div className="medication-header">
                    <h4 className="text-card-title">Medication {index + 1}</h4>
                    {medications.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="small"
                        icon={<X size={16} />}
                        onClick={() => removeMedication(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>

                  <div className="form-row">
                    <Input
                      label="Medication Name *"
                      placeholder="e.g., Paracetamol"
                      value={medication.medicationName}
                      onChange={(value) => updateMedication(index, 'medicationName', value)}
                      fullWidth
                      required
                    />
                    <Input
                      label="Generic Name"
                      placeholder="e.g., Acetaminophen"
                      value={medication.genericName}
                      onChange={(value) => updateMedication(index, 'genericName', value)}
                      fullWidth
                    />
                  </div>

                  <div className="form-row">
                    <Input
                      label="Dosage *"
                      placeholder="e.g., 500mg"
                      value={medication.dosage}
                      onChange={(value) => updateMedication(index, 'dosage', value)}
                      fullWidth
                      required
                    />
                    <Input
                      label="Frequency *"
                      placeholder="e.g., Twice daily"
                      value={medication.frequency}
                      onChange={(value) => updateMedication(index, 'frequency', value)}
                      fullWidth
                      required
                    />
                  </div>

                  <div className="form-row">
                    <Input
                      label="Duration *"
                      placeholder="e.g., 7 days"
                      value={medication.duration}
                      onChange={(value) => updateMedication(index, 'duration', value)}
                      fullWidth
                      required
                    />
                    <Input
                      label="Quantity"
                      type="number"
                      placeholder="Number of units"
                      value={medication.quantity}
                      onChange={(value) => updateMedication(index, 'quantity', value)}
                      fullWidth
                    />
                  </div>

                  <div className="form-row">
                    <div className="input-wrapper input-full-width">
                      <label className="input-label">Route of Administration</label>
                      <select
                        className="input"
                        value={medication.route}
                        onChange={(e) => updateMedication(index, 'route', e.target.value)}
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
                      rows={3}
                      placeholder="Special instructions for this medication..."
                      value={medication.instructions}
                      onChange={(e) => updateMedication(index, 'instructions', e.target.value)}
                    />
                  </div>
                </Card>
              ))}
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
                disabled={loading || medications.some(med => !med.medicationName || !med.dosage || !med.frequency || !med.duration)}
              >
                {loading ? 'Creating...' : `Create Prescription${medications.length > 1 ? ` (${medications.length} medications)` : ''}`}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </MainLayout>
  );
};

