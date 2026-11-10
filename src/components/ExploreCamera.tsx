import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Camera,
  Upload,
  RefreshCw,
  Zap,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Sliders,
  Crosshair,
  Compass,
} from 'lucide-react';
import { DEMO_OBJECTS } from '../data/demoObjects';

interface ExploreCameraProps {
  onImageAnalyzed: (analysisResult: any) => void;
  onSelectDemo: (demoId: string) => void;
  isAnalyzing: boolean;
  analyzingStep: string;
}

export const ExploreCamera: React.FC<ExploreCameraProps> = ({
  onImageAnalyzed,
  onSelectDemo,
  isAnalyzing,
  analyzingStep,
}) => {
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize camera stream
  const startCamera = useCallback(async () => {
    setCameraError(null);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Camera API not accessible in this environment. Use file upload.');
      return;
    }

    // Stop existing stream if any
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraActive(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera access permission was denied. You can select or take a photo via the upload button.');
      } else {
        setCameraError('Camera unavailable. You can use image upload or quick demos.');
      }
    }
  }, [facingMode]);

  // Stop camera stream
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  // Flip camera between environment and user
  const [localIsAnalyzing, setLocalIsAnalyzing] = useState<boolean>(false);
  const [localStep, setLocalStep] = useState<string>('');

  const effectiveIsAnalyzing = isAnalyzing || localIsAnalyzing;
  const effectiveStep = analyzingStep || localStep;

  // Flip camera between environment and user
  const toggleFacingMode = () => {
    setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Capture frame from video stream
  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
    setCapturedPreview(dataUrl);
    stopCamera();
    // Auto-trigger analysis with active scanning feedback
    triggerAnalysis(dataUrl);
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setCapturedPreview(result);
      stopCamera();
      // Auto-trigger analysis with active scanning feedback
      triggerAnalysis(result);
    };
    reader.readAsDataURL(file);
  };

  // Trigger analysis with step-by-step telemetry
  const triggerAnalysis = async (imageBase64: string) => {
    setErrorMessage(null);
    setLocalIsAnalyzing(true);
    setLocalStep('Layer 1: Optical segmentation & boundary mapping...');

    const stepTimer1 = setTimeout(() => {
      setLocalStep('Layer 2: Kinematic geometry & component triangulation...');
    }, 1200);

    const stepTimer2 = setTimeout(() => {
      setLocalStep('Layer 3: Gemini 3.8 physical world reasoning...');
    }, 2800);

    try {
      const response = await fetch('/api/analyze-reality', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64,
          mimeType: 'image/jpeg',
        }),
      });

      const data = await response.json();
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      if (!response.ok || !data.success) {
        throw new Error(data.details || data.error || 'Failed to analyze physical object.');
      }

      onImageAnalyzed(data.data);
    } catch (err: any) {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      console.error('Analysis error:', err);
      setErrorMessage(
        err.message || 'Analysis failed. Tap Retry or examine a built-in mechanical model.'
      );
    } finally {
      setLocalIsAnalyzing(false);
      setLocalStep('');
    }
  };

  const handleRetake = () => {
    setCapturedPreview(null);
    setErrorMessage(null);
    setLocalIsAnalyzing(false);
    startCamera();
  };

  const handleManualSubmit = () => {
    if (capturedPreview) {
      triggerAnalysis(capturedPreview);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-125px)] max-w-lg mx-auto p-3">
      {/* Top HUD Telemetry */}
      <div className="flex items-center justify-between px-3 py-1.5 mb-2 rounded-lg bg-slate-900/80 border border-cyan-500/20 text-[11px] font-mono-tech text-cyan-400">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>OPTICAL SENSOR // ACTIVE</span>
        </div>
        <div className="flex items-center space-x-2 text-slate-400">
          <span>MODE: {facingMode.toUpperCase()}</span>
          <span>•</span>
          <span>AI: GEMINI 3.8</span>
        </div>
      </div>

      {/* Main Viewfinder / Canvas Box */}
      <div className="relative flex-1 w-full rounded-2xl overflow-hidden bg-slate-950 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(0,240,255,0.1)]">
        {/* Futuristic HUD Gridlines & Corners */}
        <div className="absolute inset-0 pointer-events-none hud-grid opacity-30 z-10"></div>
        <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-cyan-400 z-10"></div>
        <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-cyan-400 z-10"></div>
        <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-cyan-400 z-10"></div>
        <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-cyan-400 z-10"></div>

        {/* Center Optical Crosshair */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="relative w-44 h-44 rounded-full border border-cyan-400/30 flex items-center justify-center">
            <div className="w-36 h-36 rounded-full border border-dashed border-cyan-400/40 animate-[spin_20s_linear_infinite]"></div>
            <div className="w-3 h-3 border-t-2 border-l-2 border-cyan-300"></div>
            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
            <span className="absolute -top-5 text-[9px] font-mono-tech text-cyan-300 tracking-wider">
              ALIGN TARGET
            </span>
          </div>
        </div>

        {/* Scanning progress overlay */}
        {effectiveIsAnalyzing && (
          <div className="absolute inset-0 z-30 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            {/* Animated Laser Scanning Bar */}
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#00f0ff] animate-scanline"></div>

            <div className="w-16 h-16 rounded-full border-2 border-cyan-400/40 border-t-cyan-400 animate-spin flex items-center justify-center mb-4">
              <Crosshair className="w-8 h-8 text-cyan-400 animate-pulse" />
            </div>

            <h3 className="text-base font-bold font-mono-tech text-cyan-300 uppercase tracking-widest mb-1">
              DISSECTING REALITY LAYERS
            </h3>
            <p className="text-xs font-mono-tech text-slate-300 mb-4 animate-pulse">
              {effectiveStep || 'Optical segmentation & kinematic feature extraction...'}
            </p>

            <div className="w-full max-w-xs space-y-1.5 text-left text-[11px] font-mono-tech text-slate-400 bg-slate-900/90 p-3 rounded-lg border border-cyan-500/20">
              <div className="flex items-center space-x-2 text-cyan-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Layer 1: Optical feature detection</span>
              </div>
              <div className="flex items-center space-x-2 text-cyan-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Layer 2: Kinematic & component localization</span>
              </div>
              <div className="flex items-center space-x-2 text-cyan-300 animate-pulse">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></div>
                <span>Layer 3: Gemini 3.8 physical reasoning</span>
              </div>
            </div>
          </div>
        )}

        {/* Live Video Element */}
        {cameraActive && !capturedPreview && (
          <video
            ref={videoRef}
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        )}

        {/* Captured Preview with HUD Overlay */}
        {capturedPreview && (
          <div className="relative w-full h-full">
            <img
              src={capturedPreview}
              alt="Captured Scene"
              className="w-full h-full object-cover"
            />
            {/* Target acquired banner */}
            {!effectiveIsAnalyzing && (
              <div className="absolute top-4 inset-x-4 flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-950/80 border border-cyan-500/40 text-[10px] font-mono-tech text-cyan-300">
                <span className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>IMAGE CAPTURED // READY</span>
                </span>
                <span className="text-slate-400">TAP ANALYZE BELOW</span>
              </div>
            )}
          </div>
        )}

        {/* Camera Error or Fallback UI */}
        {!cameraActive && !capturedPreview && (
          <div className="flex flex-col items-center justify-center p-6 text-center max-w-xs z-20">
            <div className="w-14 h-14 rounded-2xl bg-cyan-950/50 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mb-3">
              <Camera className="w-7 h-7" />
            </div>
            <h4 className="text-sm font-bold text-slate-200 font-mono-tech mb-1 uppercase">
              CAMERA STANDBY
            </h4>
            <p className="text-xs text-slate-400 mb-4">
              {cameraError || 'Use your smartphone camera, upload a photo, or test with a built-in mechanical model.'}
            </p>

            <div className="flex flex-col space-y-2 w-full">
              <button
                onClick={startCamera}
                className="w-full py-2.5 px-4 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs font-mono-tech uppercase tracking-wider flex items-center justify-center space-x-2 shadow-[0_0_15px_rgba(0,240,255,0.3)] active:scale-95"
              >
                <Camera className="w-4 h-4" />
                <span>ACTIVATE CAMERA</span>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 border border-cyan-500/30 text-cyan-300 font-semibold text-xs font-mono-tech uppercase tracking-wider flex items-center justify-center space-x-2 hover:bg-slate-800 active:scale-95"
              >
                <Upload className="w-4 h-4" />
                <span>SELECT IMAGE FILE</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Error notification banner with actionable recovery */}
      {errorMessage && (
        <div className="mt-2 p-3 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-300 text-xs font-mono-tech space-y-2">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold">SYSTEM NOTICE: </span>
              {errorMessage}
            </div>
          </div>
          <div className="flex items-center space-x-2 pt-1">
            {capturedPreview && (
              <button
                onClick={handleManualSubmit}
                className="px-3 py-1 rounded-lg bg-cyan-500 text-slate-950 font-bold text-[10px] uppercase font-mono-tech active:scale-95 flex items-center space-x-1"
              >
                <Zap className="w-3 h-3" />
                <span>RETRY ANALYSIS</span>
              </button>
            )}
            <button
              onClick={() => onSelectDemo('demo-engine')}
              className="px-3 py-1 rounded-lg bg-slate-900 border border-cyan-500/40 text-cyan-300 font-semibold text-[10px] uppercase font-mono-tech active:scale-95"
            >
              TRY DEMO ENGINE
            </button>
          </div>
        </div>
      )}

      {/* Bottom Camera Controls Bar (Samsung Mobile Optimized) */}
      <div className="mt-3 px-2 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-800">
        {/* Upload File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileUpload}
          className="hidden"
        />

        {capturedPreview ? (
          /* Preview Action Bar: Explicit Submit/Analyze Button + Retake */
          <div className="flex items-center space-x-2">
            <button
              onClick={handleRetake}
              disabled={effectiveIsAnalyzing}
              className="flex items-center justify-center space-x-1.5 px-4 py-3 rounded-xl bg-slate-800/90 border border-slate-700 text-slate-300 hover:text-white font-mono-tech text-xs uppercase font-semibold active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className="w-4 h-4" />
              <span>RETAKE</span>
            </button>

            <button
              onClick={handleManualSubmit}
              disabled={effectiveIsAnalyzing}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-mono-tech text-xs uppercase font-bold tracking-wider transition-all duration-200 active:scale-95 ${
                effectiveIsAnalyzing
                  ? 'bg-cyan-950 border border-cyan-500/40 text-cyan-300 cursor-wait'
                  : 'bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(0,240,255,0.4)]'
              }`}
            >
              {effectiveIsAnalyzing ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin"></div>
                  <span>DISSECTING LAYERS...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-slate-950 fill-current" />
                  <span>ANALYZE OBJECT (SUBMIT)</span>
                  <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                </>
              )}
            </button>
          </div>
        ) : (
          /* Live Viewfinder Controls Bar: Upload, Shutter, Flip */
          <div className="flex items-center justify-between">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-cyan-400 active:scale-95 transition-all"
              title="Upload or pick photo"
            >
              <Upload className="w-5 h-5 text-cyan-400" />
              <span className="text-[9px] font-mono-tech mt-0.5">UPLOAD</span>
            </button>

            {/* Primary Shutter Trigger */}
            <button
              onClick={capturePhoto}
              disabled={!cameraActive || effectiveIsAnalyzing}
              className={`relative flex items-center justify-center w-16 h-16 rounded-full border-4 border-cyan-400 shadow-[0_0_25px_rgba(0,240,255,0.4)] active:scale-90 transition-transform ${
                cameraActive && !effectiveIsAnalyzing
                  ? 'bg-cyan-500/20 cursor-pointer'
                  : 'bg-slate-800/40 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="w-11 h-11 rounded-full bg-cyan-400 flex items-center justify-center text-slate-950 font-bold shadow-inner">
                <Camera className="w-5 h-5" />
              </div>
              <div className="absolute inset-0 rounded-full border border-cyan-300 animate-ping opacity-25 pointer-events-none"></div>
            </button>

            {/* Camera Flip Button */}
            <button
              onClick={toggleFacingMode}
              className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-cyan-400 active:scale-95 transition-all"
              title="Switch front/back camera"
            >
              <RefreshCw className="w-5 h-5 text-violet-400" />
              <span className="text-[9px] font-mono-tech mt-0.5">FLIP</span>
            </button>
          </div>
        )}
      </div>

      {/* Quick Test Demo Objects Tray */}
      <div className="mt-2.5">
        <div className="flex items-center justify-between text-[10px] font-mono-tech text-slate-400 mb-1.5 px-1">
          <span>TRY INSTANT MECHANICAL SYSTEMS:</span>
          <span className="text-cyan-400">DEMO LAB</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {DEMO_OBJECTS.map(demo => (
            <button
              key={demo.id}
              onClick={() => onSelectDemo(demo.id)}
              className="flex items-center space-x-2 p-2 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-850 active:scale-95 text-left transition-all"
            >
              <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-slate-950 border border-cyan-500/20">
                <img
                  src={demo.imageSvg}
                  alt={demo.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="truncate">
                <h5 className="text-[11px] font-bold text-slate-200 truncate font-mono-tech">
                  {demo.name.split(' ')[0]} {demo.name.split(' ')[1]}
                </h5>
                <p className="text-[9px] text-cyan-400 truncate font-mono-tech">
                  {demo.category.toUpperCase()}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
