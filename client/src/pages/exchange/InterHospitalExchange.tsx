import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { exchangeService } from '../../services/exchange.service';
import { hospitalService } from '../../services/hospital.service';
import type { Hospital } from '../../services/hospital.service';
import { Send, Building2 } from 'lucide-react';
import './InterHospitalExchange.css';

export const InterHospitalExchange: React.FC = () => {
  const { uhid } = useParams<{ uhid: string }>();
  const [aggregatedRecords, setAggregatedRecords] = useState<any>(null);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(false);
  const [requestedHospital, setRequestedHospital] = useState<string | null>(null);

  useEffect(() => {
    if (uhid) {
      loadAggregatedRecords();
      loadHospitals();
    }
  }, [uhid]);

  const loadAggregatedRecords = async () => {
    if (!uhid) return;

    setLoading(true);
    try {
      const response = await exchangeService.getAggregatedRecords(uhid);
      if (response.success) {
        setAggregatedRecords(response.data);
      }
    } catch (error) {
      console.error('Failed to load aggregated records:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadHospitals = async () => {
    try {
      const response = await hospitalService.getAllHospitals({ isActive: true });
      if (response.success) {
        setHospitals(response.data || []);
      }
    } catch (error) {
      console.error('Failed to load hospitals:', error);
    }
  };

  const handleRequestFromHospital = async (hospitalId: string) => {
    if (!uhid) return;

    setLoading(true);
    setRequestedHospital(hospitalId);

    try {
      const response = await exchangeService.getRecordsFromHospital(uhid, hospitalId);
      if (response.success) {
        await loadAggregatedRecords();
        alert('Records requested and retrieved successfully');
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to request records');
    } finally {
      setLoading(false);
      setRequestedHospital(null);
    }
  };

  if (!uhid) {
    return (
      <MainLayout role="doctor">
        <Card>Invalid UHID</Card>
      </MainLayout>
    );
  }

  return (
    <MainLayout role="doctor">
      <div className="inter-hospital-exchange">
        <div className="page-header">
          <h1 className="text-page-title">Inter-Hospital Record Exchange</h1>
          <p className="text-body text-light">UHID: <span className="text-mono">{uhid}</span></p>
        </div>

        <Card title="Available Hospitals" subtitle="Request records from other hospitals">
          <div className="hospitals-grid">
            {hospitals.map((hospital) => (
              <div key={hospital.id} className="hospital-card">
                <div className="hospital-card-header">
                  <Building2 size={24} />
                  <div>
                    <strong>{hospital.name}</strong>
                    <span className="text-small text-light">{hospital.type} • {hospital.state}</span>
                  </div>
                </div>
                <div className="hospital-card-actions">
                  <Badge variant={hospital.isVerified ? 'success' : 'warning'}>
                    {hospital.isVerified ? 'Verified' : 'Pending'}
                  </Badge>
                  <Button
                    variant="primary"
                    size="small"
                    onClick={() => handleRequestFromHospital(hospital.id)}
                    disabled={loading && requestedHospital === hospital.id}
                  >
                    <Send size={16} />
                    Request Records
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {aggregatedRecords && (
          <Card title="Aggregated Records" subtitle="Combined records from all hospitals">
            <div className="aggregated-records">
              {aggregatedRecords.records?.map((record: any, index: number) => (
                <div key={index} className="record-item">
                  <div className="record-header">
                    <strong>{record.hospitalName || 'Unknown Hospital'}</strong>
                    <Badge variant="info">{record.hospitalCode}</Badge>
                  </div>
                  <div className="record-content">
                    <p className="text-small text-light">Records: {record.recordCount || 0}</p>
                    <p className="text-small">{record.lastUpdated || 'N/A'}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

