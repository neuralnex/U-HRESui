import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Search, User } from 'lucide-react';
import { uhidService } from '../../services/uhid.service';
import { patientService } from '../../services/patient.service';
import './PatientSearch.css';

export const PatientSearch: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError('');
    setResults([]);

    try {
      const uhid = searchQuery.trim().toUpperCase();
      
      // Try to get UHID first (central record)
      const uhidResponse = await uhidService.getUHID(uhid);
      
      if (uhidResponse.success && uhidResponse.data) {
        // Use UHID data as the primary source, avoid duplicate lookups
        setResults([{
          type: 'uhid',
          data: uhidResponse.data,
        }]);
      } else {
        // If UHID not found, try patient record (hospital-specific)
        try {
          const patientResponse = await patientService.getPatientRecord(uhid);
          if (patientResponse.success && patientResponse.data) {
            setResults([{
              type: 'patient',
              data: patientResponse.data,
            }]);
          } else {
            setError('No patient found with this UHID');
          }
        } catch (err: any) {
          setError('No patient found with this UHID');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleViewPatient = (uhid: string) => {
    navigate(`/doctor/patients/${uhid}`);
  };

  return (
    <MainLayout role="doctor">
      <div className="patient-search">
        <div className="page-header">
          <h1 className="text-page-title">Search Patient</h1>
          <p className="text-body text-light">Search by UHID or patient name</p>
        </div>

        <Card>
          <div className="search-container">
            <Input
              placeholder="Enter UHID (e.g., UHID-20240115-00001)"
              value={searchQuery}
              onChange={setSearchQuery}
              icon={<Search size={20} />}
              fullWidth
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button variant="primary" onClick={handleSearch} disabled={loading || !searchQuery.trim()}>
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </div>

          {error && (
            <div className="search-error">
              <span>{error}</span>
            </div>
          )}

          {results.length > 0 && (
            <div className="search-results">
              {results.map((result, index) => (
                <div key={index} className="result-item">
                  <div className="result-info">
                    <User size={24} />
                    <div>
                      <h3 className="text-card-title">
                        {result.data.firstName} {result.data.lastName}
                      </h3>
                      <p className="text-small text-mono text-light">{result.data.uhid}</p>
                      <p className="text-small">
                        {result.data.gender} • {new Date(result.data.dateOfBirth).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    onClick={() => handleViewPatient(result.data.uhid)}
                  >
                    View Profile
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </MainLayout>
  );
};

