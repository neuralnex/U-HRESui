import React, { useRef, useEffect, useState } from 'react';
import { Camera, X, RefreshCw } from 'lucide-react';
import { Button } from './Button';
import './WebcamCapture.css';

interface WebcamCaptureProps {
  onCapture: (imageDataUrl: string) => void;
  onCancel?: () => void;
  initialImage?: string;
}

export const WebcamCapture: React.FC<WebcamCaptureProps> = ({
  onCapture,
  onCancel,
  initialImage,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(initialImage || null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!capturedImage && !isCapturing) {
      startCamera();
    }

    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const constraints: MediaStreamConstraints = {
        video: isMobile 
          ? { facingMode: { ideal: 'environment' } }
          : { facingMode: 'user', width: 640, height: 480 },
      };
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      setIsCapturing(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      setError('Unable to access camera. Please check permissions.');
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCapturing(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        const maxWidth = 800;
        const maxHeight = 800;
        let width = video.videoWidth;
        let height = video.videoHeight;

        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        context.drawImage(video, 0, 0, width, height);
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.7);
        setCapturedImage(imageDataUrl);
        stopCamera();
        onCapture(imageDataUrl);
      }
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  const handleCancel = () => {
    stopCamera();
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="webcam-capture">
      {error && (
        <div className="webcam-error">
          <span>{error}</span>
        </div>
      )}

      {capturedImage ? (
        <div className="captured-preview">
          <img src={capturedImage} alt="Captured" className="captured-image" />
          <div className="capture-actions">
            <Button variant="secondary" onClick={retakePhoto} icon={<RefreshCw size={16} />}>
              Retake
            </Button>
            {onCancel && (
              <Button variant="outline" onClick={handleCancel} icon={<X size={16} />}>
                Cancel
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="webcam-preview">
          <video ref={videoRef} autoPlay playsInline className="webcam-video" />
          <div className="capture-controls">
            <button className="capture-button" onClick={capturePhoto}>
              <Camera size={24} />
            </button>
            {onCancel && (
              <button className="cancel-button" onClick={handleCancel}>
                <X size={20} />
              </button>
            )}
          </div>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

