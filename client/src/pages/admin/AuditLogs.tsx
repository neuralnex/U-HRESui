import React, { useState } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { auditService } from '../../services/audit.service';
import { Search, Calendar, User, Building2 } from 'lucide-react';
import './AuditLogs.css';

export const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState<'uhid' | 'hospital' | 'action'>('uhid');
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = async () => {
    if (!searchValue.trim()) return;

    setLoading(true);
    try {
      let response: any;

      switch (searchType) {
        case 'uhid':
          response = await auditService.getAuditLogsByUHID(searchValue);
          break;
        case 'hospital':
          response = await auditService.getAuditLogsByHospital(searchValue);
          break;
        case 'action':
          response = await auditService.getAuditLogsByAction(searchValue);
          break;
      }

      if (response.success) {
        setLogs(response.data || []);
      }
    } catch (error) {
      console.error('Failed to load audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout role="admin">
      <div className="audit-logs">
        <div className="page-header">
          <h1 className="text-page-title">Audit Logs</h1>
          <p className="text-body text-light">View system activity and access logs</p>
        </div>

        <Card title="Search Audit Logs">
          <div className="audit-search">
            <div className="search-type-selector">
              <button
                className={`type-btn ${searchType === 'uhid' ? 'active' : ''}`}
                onClick={() => setSearchType('uhid')}
              >
                <User size={16} />
                By UHID
              </button>
              <button
                className={`type-btn ${searchType === 'hospital' ? 'active' : ''}`}
                onClick={() => setSearchType('hospital')}
              >
                <Building2 size={16} />
                By Hospital
              </button>
              <button
                className={`type-btn ${searchType === 'action' ? 'active' : ''}`}
                onClick={() => setSearchType('action')}
              >
                <Calendar size={16} />
                By Action
              </button>
            </div>
            <div className="search-input-group">
              <Input
                placeholder={`Enter ${searchType}...`}
                value={searchValue}
                onChange={setSearchValue}
                icon={<Search size={20} />}
                fullWidth
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button className="search-btn" onClick={handleSearch} disabled={loading || !searchValue.trim()}>
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
        </Card>

        {logs.length > 0 && (
          <Card title={`Audit Logs (${logs.length} results)`}>
            <div className="logs-table">
              <div className="table-header">
                <div>Timestamp</div>
                <div>Action</div>
                <div>Resource</div>
                <div>Hospital</div>
                <div>Status</div>
              </div>
              {logs.map((log, index) => (
                <div key={index} className="table-row">
                  <div className="text-mono text-small">
                    {new Date(log.createdAt).toLocaleString()}
                  </div>
                  <div>
                    <Badge variant="info">{log.action}</Badge>
                  </div>
                  <div className="text-small">{log.resource}</div>
                  <div className="text-small">{log.hospitalId || 'N/A'}</div>
                  <div>
                    <Badge variant={log.success ? 'success' : 'error'}>
                      {log.success ? 'Success' : 'Failed'}
                    </Badge>
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

