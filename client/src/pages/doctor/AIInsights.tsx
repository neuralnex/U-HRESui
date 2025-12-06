import React, { useState } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { aiService } from '../../services/ai.service';
import { Brain, FileText, Image as ImageIcon, Upload, AlertTriangle } from 'lucide-react';
import './AIInsights.css';

export const AIInsights: React.FC = () => {
  const [textInput, setTextInput] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState('');

  const handleAnalyzeText = async () => {
    if (!textInput.trim()) return;

    setLoading(true);
    setError('');
    setResults(null);

    try {
      const response = await aiService.analyzeText({ text: textInput });
      if (response.success) {
        setResults(response.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeImage = async () => {
    if (!imageFile) return;

    setLoading(true);
    setError('');
    setResults(null);

    try {
      const response = await aiService.analyzeImage({ image: imageFile });
      if (response.success) {
        setResults(response.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeMultimodal = async () => {
    if (!imageFile) return;

    setLoading(true);
    setError('');
    setResults(null);

    try {
      const response = await aiService.analyzeMultimodal({
        image: imageFile,
        text: textInput,
      });
      if (response.success) {
        setResults(response.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Multimodal analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout role="doctor">
      <div className="ai-insights">
        <div className="page-header">
          <h1 className="text-page-title">AI Medical Analysis</h1>
          <p className="text-body text-light">Analyze medical reports and images using AI</p>
        </div>

        <div className="ai-tabs">
          <Card title="Text Analysis" icon={<FileText size={20} />}>
            <div className="analysis-form">
              <div className="input-wrapper input-full-width">
                <label className="input-label">Medical Report Text</label>
                <textarea
                  className="textarea"
                  rows={10}
                  placeholder="Paste medical report text here..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                />
              </div>
              <Button variant="primary" onClick={handleAnalyzeText} disabled={loading || !textInput.trim()}>
                <Brain size={16} />
                {loading ? 'Analyzing...' : 'Analyze Text'}
              </Button>
            </div>
          </Card>

          <Card title="Image Analysis" icon={<ImageIcon size={20} />}>
            <div className="analysis-form">
              <div className="file-upload">
                <label className="file-upload-label">
                  <Upload size={24} />
                  {imageFile ? imageFile.name : 'Upload Medical Image (X-Ray, Scan, etc.)'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
              <Button variant="primary" onClick={handleAnalyzeImage} disabled={loading || !imageFile}>
                <Brain size={16} />
                {loading ? 'Analyzing...' : 'Analyze Image'}
              </Button>
            </div>
          </Card>
        </div>

        <Card title="Multimodal Analysis" icon={<Brain size={20} />} subtitle="Combine image and text for comprehensive analysis">
          <div className="analysis-form">
            <div className="file-upload">
              <label className="file-upload-label">
                <Upload size={24} />
                {imageFile ? imageFile.name : 'Upload Medical Image'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
            <div className="input-wrapper input-full-width">
              <label className="input-label">Additional Medical Text (Optional)</label>
              <textarea
                className="textarea"
                rows={6}
                placeholder="Enter additional medical notes, history, or context..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
              />
            </div>
            <Button
              variant="primary"
              onClick={handleAnalyzeMultimodal}
              disabled={loading || !imageFile}
            >
              <Brain size={16} />
              {loading ? 'Analyzing...' : 'Analyze Multimodal'}
            </Button>
          </div>
        </Card>

        {error && (
          <Card>
            <div className="error-display">
              <AlertTriangle size={20} />
              <span>{error}</span>
            </div>
          </Card>
        )}

        {results && (
          <Card title="Analysis Results">
            <div className="results-display">
              {results.processedText && (
                <div className="result-section">
                  <h3 className="text-card-title">Processed Text</h3>
                  <p className="text-body">{results.processedText}</p>
                </div>
              )}

              {results.processedImage && (
                <div className="result-section">
                  <h3 className="text-card-title">Processed Image</h3>
                  <img
                    src={results.processedImage}
                    alt="Processed image"
                    className="visualization-image"
                  />
                </div>
              )}

              {results.analysisResults && (
                <div className="result-section">
                  <h3 className="text-card-title">Analysis</h3>
                  <div
                    className="analysis-html"
                    dangerouslySetInnerHTML={{ __html: results.analysisResults }}
                  />
                </div>
              )}

              {(results.entityVisualization || results.visualization) && (
                <div className="result-section">
                  <h3 className="text-card-title">Visualization</h3>
                  <img
                    src={results.entityVisualization || results.visualization}
                    alt="Analysis visualization"
                    className="visualization-image"
                  />
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

