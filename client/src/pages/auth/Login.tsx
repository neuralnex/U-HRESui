import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../contexts/AuthContext';
import { User, Lock, AlertCircle } from 'lucide-react';
import './Login.css';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hospitalCode, setHospitalCode] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [role, setRole] = useState<'doctor' | 'admin' | 'lab' | 'central' | 'patient'>('doctor');
  const [uhid, setUhid] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      let credentials: any;

      if (role === 'central') {
        credentials = {
          username: email,
          password: password,
        };
      } else if (role === 'patient') {
        credentials = {
          uhid: uhid,
        };
      } else {
        credentials = {
          hospitalCode: hospitalCode,
          apiKey: apiKey || undefined,
        };
      }

      await login(role, credentials);

      switch (role) {
        case 'doctor':
          navigate('/doctor');
          break;
        case 'admin':
          navigate('/admin');
          break;
        case 'lab':
          navigate('/lab');
          break;
        case 'central':
          navigate('/central');
          break;
        case 'patient':
          navigate('/patient');
          break;
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1 className="text-page-title">🏥 U-HRES</h1>
          <p className="text-body text-light">Unified Health Record Exchange System</p>
        </div>

        <Card className="login-card">
          <div className="login-form">
            <div className="role-selector">
              <button
                className={`role-btn ${role === 'doctor' ? 'active' : ''}`}
                onClick={() => setRole('doctor')}
              >
                Doctor
              </button>
              <button
                className={`role-btn ${role === 'admin' ? 'active' : ''}`}
                onClick={() => setRole('admin')}
              >
                Hospital Admin
              </button>
              <button
                className={`role-btn ${role === 'lab' ? 'active' : ''}`}
                onClick={() => setRole('lab')}
              >
                Lab/Pharmacy
              </button>
              <button
                className={`role-btn ${role === 'central' ? 'active' : ''}`}
                onClick={() => setRole('central')}
              >
                Central Admin
              </button>
              <button
                className={`role-btn ${role === 'patient' ? 'active' : ''}`}
                onClick={() => setRole('patient')}
              >
                Patient
              </button>
            </div>

            {role === 'central' ? (
              <>
                <Input
                  label="Username"
                  placeholder="Enter your username"
                  value={email}
                  onChange={setEmail}
                  icon={<User size={20} />}
                  fullWidth
                />
                <Input
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={setPassword}
                  icon={<Lock size={20} />}
                  fullWidth
                />
              </>
            ) : role === 'patient' ? (
              <>
                <Input
                  label="UHID"
                  placeholder="Enter your Universal Health ID"
                  value={uhid}
                  onChange={setUhid}
                  icon={<User size={20} />}
                  fullWidth
                />
                <p className="text-small text-light">
                  Don't have a UHID? <a href="#" onClick={(e) => { e.preventDefault(); navigate('/patient/register'); }}>Register here</a>
                </p>
              </>
            ) : (
              <>
                <Input
                  label="Hospital Code"
                  placeholder="Enter your hospital code"
                  value={hospitalCode}
                  onChange={setHospitalCode}
                  icon={<User size={20} />}
                  fullWidth
                />
                <Input
                  label="API Key (Optional)"
                  type="password"
                  placeholder="Enter API key if available"
                  value={apiKey}
                  onChange={setApiKey}
                  icon={<Lock size={20} />}
                  fullWidth
                />
              </>
            )}

            {error && (
              <div className="login-error">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <Button variant="primary" fullWidth onClick={handleLogin} disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>

            <p className="login-footer text-small text-light">
              Forgot hospital code? <a href="#" onClick={(e) => { e.preventDefault(); /* TODO: Implement forgot code */ }}>Recover here</a>
            </p>
            {role !== 'patient' && (
              <p className="login-footer text-small text-light">
                New hospital? <a href="/register" onClick={(e) => { e.preventDefault(); navigate('/register'); }}>Register here</a>
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

