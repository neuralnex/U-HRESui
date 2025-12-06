import React, { useState, useEffect } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { adminService } from '../../services/admin.service';
import { hospitalService } from '../../services/hospital.service';
import type { Hospital } from '../../services/hospital.service';
import { CheckCircle, Key, Search } from 'lucide-react';
import './HospitalManagement.css';

export const HospitalManagement: React.FC = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [pendingHospitals, setPendingHospitals] = useState<Hospital[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHospitals, setSelectedHospitals] = useState<string[]>([]);

  useEffect(() => {
    loadHospitals();
  }, []);

  const loadHospitals = async () => {
    try {
      const [allHospitals, pending] = await Promise.all([
        hospitalService.getAllHospitals(),
        adminService.getPendingHospitals(),
      ]);

      if (allHospitals.success) {
        setHospitals(allHospitals.data || []);
      }
      if (pending.success) {
        setPendingHospitals(pending.data || []);
      }
    } catch (error) {
      console.error('Failed to load hospitals:', error);
    }
  };

  const handleVerify = async (id: string) => {
    try {
      await adminService.verifyHospital(id);
      await loadHospitals();
    } catch (error) {
      console.error('Failed to verify hospital:', error);
    }
  };

  const handleBulkVerify = async () => {
    if (selectedHospitals.length === 0) return;

    try {
      await adminService.bulkVerifyHospitals({ hospitalIds: selectedHospitals });
      setSelectedHospitals([]);
      await loadHospitals();
    } catch (error) {
      console.error('Failed to bulk verify:', error);
    }
  };

  const handleGenerateAPIKey = async (id: string) => {
    try {
      const response = await adminService.generateAPIKey(id);
      if (response.success) {
        alert(`API Key: ${response.data.apiKey}\n\nPlease save this key securely.`);
      }
    } catch (error) {
      console.error('Failed to generate API key:', error);
    }
  };

  const filteredHospitals = hospitals.filter((h) =>
    h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.hospitalCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout role="central">
      <div className="hospital-management">
        <div className="page-header">
          <h1 className="text-page-title">Hospital Management</h1>
          <p className="text-body text-light">Manage all registered hospitals</p>
        </div>

        {pendingHospitals.length > 0 && (
          <Card title="Pending Verification" subtitle={`${pendingHospitals.length} hospitals awaiting approval`}>
            <div className="pending-hospitals">
              {pendingHospitals.map((hospital) => (
                <div key={hospital.id} className="hospital-item">
                  <div className="hospital-info">
                    <strong>{hospital.name}</strong>
                    <span className="text-small text-mono text-light">{hospital.hospitalCode}</span>
                    <span className="text-small">{hospital.type} • {hospital.state}</span>
                  </div>
                  <div className="hospital-actions">
                    <Button variant="primary" size="small" onClick={() => handleVerify(hospital.id)}>
                      <CheckCircle size={16} />
                      Verify
                    </Button>
                  </div>
                </div>
              ))}
              {selectedHospitals.length > 0 && (
                <div className="bulk-actions">
                  <Button variant="primary" onClick={handleBulkVerify}>
                    Verify Selected ({selectedHospitals.length})
                  </Button>
                </div>
              )}
            </div>
          </Card>
        )}

        <Card title="All Hospitals" subtitle={`${hospitals.length} total hospitals`}>
          <div className="search-bar">
            <Input
              placeholder="Search hospitals..."
              value={searchQuery}
              onChange={setSearchQuery}
              icon={<Search size={20} />}
              fullWidth
            />
          </div>

          <div className="hospitals-list">
            {filteredHospitals.map((hospital) => (
              <div key={hospital.id} className="hospital-item">
                <div className="hospital-info">
                  <div className="hospital-header">
                    <strong>{hospital.name}</strong>
                    <Badge variant={hospital.isVerified ? 'success' : 'warning'}>
                      {hospital.isVerified ? 'Verified' : 'Pending'}
                    </Badge>
                    <Badge variant={hospital.isActive ? 'success' : 'error'}>
                      {hospital.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <span className="text-small text-mono text-light">{hospital.hospitalCode}</span>
                  <span className="text-small">{hospital.type} • {hospital.state} • {hospital.lga}</span>
                  {hospital.email && <span className="text-small text-light">{hospital.email}</span>}
                </div>
                <div className="hospital-actions">
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => handleGenerateAPIKey(hospital.id)}
                  >
                    <Key size={16} />
                    API Key
                  </Button>
                  {!hospital.isVerified && (
                    <Button
                      variant="primary"
                      size="small"
                      onClick={() => handleVerify(hospital.id)}
                    >
                      <CheckCircle size={16} />
                      Verify
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

