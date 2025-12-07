import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Select } from '../../components/common/Select';
import { patientService } from '../../services/patient.service';
import { aiService } from '../../services/ai.service';
import { Upload, CheckCircle, AlertCircle, Plus, FileText } from 'lucide-react';
import './LabDashboard.css';

export const LabDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [uhid, setUhid] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [pendingResults, setPendingResults] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [error, setError] = useState('');
  const [showLabResultModal, setShowLabResultModal] = useState(false);
  const [showCreateLabModal, setShowCreateLabModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState<any>(null);
  const [labResultForm, setLabResultForm] = useState({
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
  const [aiExtractedData, setAiExtractedData] = useState<any>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load pending lab results
      try {
        const labResultsResponse = await patientService.getPendingLabResults();
        if (labResultsResponse.success) {
          setPendingResults(labResultsResponse.data || []);
        }
      } catch (error) {
        console.error('Failed to load pending lab results:', error);
        setPendingResults([]);
      }

      // Load pending prescriptions
      try {
        const prescriptionsResponse = await patientService.getPendingPrescriptions();
        if (prescriptionsResponse.success) {
          setPrescriptions(prescriptionsResponse.data || []);
        }
      } catch (error) {
        console.error('Failed to load prescriptions:', error);
        setPrescriptions([]);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAIExtraction = async () => {
    if (!uhid || !uploadedFile) {
      setError('Please enter UHID and upload a file');
      return;
    }

    setExtracting(true);
    setError('');

    try {
      const response = await aiService.analyzeImage({ image: uploadedFile });
      if (response.success && response.data) {
        // Parse AI response to extract lab result data
        const extracted = response.data;
        setAiExtractedData(extracted);
        
        // Populate form with extracted data if available
        if (extracted.testName) setLabResultForm(prev => ({ ...prev, testName: extracted.testName }));
        if (extracted.result) setLabResultForm(prev => ({ ...prev, result: extracted.result }));
        if (extracted.unit) setLabResultForm(prev => ({ ...prev, unit: extracted.unit }));
        if (extracted.referenceRange) setLabResultForm(prev => ({ ...prev, referenceRange: extracted.referenceRange }));
        if (extracted.status) setLabResultForm(prev => ({ ...prev, status: extracted.status }));
        
        setShowCreateLabModal(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'AI extraction failed');
    } finally {
      setExtracting(false);
    }
  };

  const handleCreateLabResult = async () => {
    if (!uhid || !labResultForm.testName || !labResultForm.testType) {
      setError('Please enter UHID, test name, and test type');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await patientService.createLabResult(uhid, {
        testDate: new Date(labResultForm.testDate).toISOString(),
        testName: labResultForm.testName,
        testType: labResultForm.testType,
        result: labResultForm.result || undefined,
        unit: labResultForm.unit || undefined,
        referenceRange: labResultForm.referenceRange || undefined,
        status: labResultForm.status || undefined,
        labTechnicianId: labResultForm.labTechnicianId || undefined,
        reviewedBy: labResultForm.reviewedBy || undefined,
        notes: labResultForm.notes || undefined,
      });

      if (response.success) {
        setShowCreateLabModal(false);
        setUhid('');
        setUploadedFile(null);
        setLabResultForm({
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
        setAiExtractedData(null);
        await loadDashboardData();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create lab result');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteResult = (result: any) => {
    setSelectedResult(result);
    setUhid(result.uhid);
    setLabResultForm({
      testDate: result.testDate ? new Date(result.testDate).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
      testName: result.testName || '',
      testType: result.testType || '',
      result: result.result || '',
      unit: result.unit || '',
      referenceRange: result.referenceRange || '',
      status: result.status || 'Normal',
      labTechnicianId: result.labTechnicianId || '',
      reviewedBy: result.reviewedBy || '',
      notes: result.notes || '',
    });
    setShowCreateLabModal(true);
  };

  const handleDispense = async (prescriptionId: string) => {
    try {
      const response = await patientService.dispensePrescription(prescriptionId);
      if (response.success) {
        await loadDashboardData();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to dispense prescription');
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
              {error && (
                <div className="form-error">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}
              <div className="form-actions">
                <Button 
                  variant="primary" 
                  fullWidth
                  onClick={handleAIExtraction}
                  disabled={extracting || !uhid || !uploadedFile}
                >
                  {extracting ? 'Extracting...' : 'Auto-AI Extraction'}
                </Button>
                <Button 
                  variant="secondary" 
                  fullWidth
                  onClick={handleSubmitLabResult}
                  disabled={!uhid}
                >
                  Submit to Hospital
                </Button>
              </div>
            </div>
          </Card>

          <Card 
            title="Pending Lab Results" 
            subtitle={`${pendingResults.length} pending`}
            actions={
              <Button 
                variant="primary" 
                size="small"
                icon={<Plus size={16} />}
                onClick={() => {
                  setUhid('');
                  setLabResultForm({
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
                  setShowCreateLabModal(true);
                }}
              >
                New Result
              </Button>
            }
          >
            {loading ? (
              <p className="text-small text-light">Loading...</p>
            ) : pendingResults.length > 0 ? (
              <div className="results-list">
                {pendingResults.map((result, index) => (
                  <div 
                    key={result.id || index} 
                    className="result-item"
                    onClick={() => handleCompleteResult(result)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="result-info">
                      <strong>{result.patient || 'Unknown Patient'}</strong>
                      <span className="text-small text-mono text-light">{result.uhid}</span>
                      <span className="text-small"><strong>{result.testName}</strong> - {result.testType}</span>
                      <span className="text-small text-light">
                        {result.testDate ? new Date(result.testDate).toLocaleDateString() : 'No date'}
                      </span>
                    </div>
                    <Badge variant={result.status === 'Normal' ? 'success' : result.status === 'Abnormal' ? 'error' : 'warning'}>
                      {result.status || 'Pending'}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p className="text-small text-light">No pending lab results</p>
                <Button 
                  variant="outline" 
                  size="small"
                  className="m-t"
                  onClick={() => setShowCreateLabModal(true)}
                >
                  Create New Lab Result
                </Button>
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
                    <strong>{prescription.patient || 'Unknown Patient'}</strong>
                    <span className="text-small text-mono text-light">{prescription.uhid}</span>
                    <span className="text-small"><strong>{prescription.medicationName}</strong> - {prescription.dosage} ({prescription.frequency})</span>
                    <span className="text-small text-light">Duration: {prescription.duration}</span>
                  </div>
                  <div className="prescription-actions">
                    {!prescription.isDispensed ? (
                      <Button 
                        variant="primary" 
                        size="small"
                        onClick={() => handleDispense(prescription.id)}
                      >
                        Dispense
                      </Button>
                    ) : (
                      <Badge variant="success">
                        <CheckCircle size={14} />
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

        {/* Lab Result Creation Modal */}
        <Modal
          isOpen={showCreateLabModal}
          onClose={() => {
            setShowCreateLabModal(false);
            setSelectedResult(null);
            setError('');
          }}
          title={selectedResult ? 'Complete Lab Result' : 'Create Lab Result'}
          size="large"
        >
          <div className="lab-result-form">
            <Input
              label="Patient UHID *"
              placeholder="Enter UHID"
              value={uhid}
              onChange={setUhid}
              fullWidth
              required
            />
            <div className="form-row">
              <Input
                label="Test Date *"
                type="datetime-local"
                value={labResultForm.testDate}
                onChange={(value) => setLabResultForm({ ...labResultForm, testDate: value })}
                fullWidth
                required
              />
              <div className="input-wrapper input-full-width">
                <label className="input-label">Test Type *</label>
                <select
                  className="input"
                  value={labResultForm.testType}
                  onChange={(e) => setLabResultForm({ ...labResultForm, testType: e.target.value })}
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
              value={labResultForm.testName}
              onChange={(value) => setLabResultForm({ ...labResultForm, testName: value })}
              fullWidth
              required
            />
            <div className="form-row">
              <Input
                label="Result"
                placeholder="Test result value"
                value={labResultForm.result}
                onChange={(value) => setLabResultForm({ ...labResultForm, result: value })}
                fullWidth
              />
              <Input
                label="Unit"
                placeholder="e.g., mg/dL, mmol/L"
                value={labResultForm.unit}
                onChange={(value) => setLabResultForm({ ...labResultForm, unit: value })}
                fullWidth
              />
            </div>
            <div className="form-row">
              <Input
                label="Reference Range"
                placeholder="e.g., 70-100 mg/dL"
                value={labResultForm.referenceRange}
                onChange={(value) => setLabResultForm({ ...labResultForm, referenceRange: value })}
                fullWidth
              />
              <div className="input-wrapper input-full-width">
                <label className="input-label">Status</label>
                <select
                  className="input"
                  value={labResultForm.status}
                  onChange={(e) => setLabResultForm({ ...labResultForm, status: e.target.value })}
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
                placeholder="Your ID"
                value={labResultForm.labTechnicianId}
                onChange={(value) => setLabResultForm({ ...labResultForm, labTechnicianId: value })}
                fullWidth
              />
              <Input
                label="Reviewed By"
                placeholder="Reviewer name"
                value={labResultForm.reviewedBy}
                onChange={(value) => setLabResultForm({ ...labResultForm, reviewedBy: value })}
                fullWidth
              />
            </div>
            <div className="input-wrapper input-full-width">
              <label className="input-label">Notes</label>
              <textarea
                className="textarea"
                rows={4}
                placeholder="Additional notes or observations..."
                value={labResultForm.notes}
                onChange={(e) => setLabResultForm({ ...labResultForm, notes: e.target.value })}
              />
            </div>
            {aiExtractedData && (
              <div className="ai-extracted-info">
                <FileText size={16} />
                <span className="text-small">AI extracted data has been pre-filled. Please review and adjust as needed.</span>
              </div>
            )}
            {error && (
              <div className="form-error">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}
            <div className="form-actions">
              <Button 
                variant="secondary" 
                onClick={() => {
                  setShowCreateLabModal(false);
                  setSelectedResult(null);
                  setError('');
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleCreateLabResult}
                disabled={loading || !uhid || !labResultForm.testName || !labResultForm.testType}
              >
                {loading ? 'Creating...' : selectedResult ? 'Update Result' : 'Create Lab Result'}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </MainLayout>
  );
};

