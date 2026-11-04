import React, { useRef, useState, useEffect } from 'react';
import { Pen, Type, Upload, RotateCcw, Trash2, Check, Sparkles } from 'lucide-react';
import { SAMPLE_SIGNATURE_DATA_URL } from '../data/sampleData';

interface SignaturePadProps {
  signatureDataUrl: string;
  onSignatureChange: (dataUrl: string) => void;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({
  signatureDataUrl,
  onSignatureChange,
}) => {
  const [mode, setMode] = useState<'draw' | 'type' | 'upload'>('draw');
  const [typedName, setTypedName] = useState('');
  const [typedFont, setTypedFont] = useState<'font-serif' | 'font-sans' | 'font-mono'>('font-serif');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const strokesRef = useRef<Array<{ x: number; y: number }[]>>([]);
  const currentStrokeRef = useRef<{ x: number; y: number }[]>([]);

  // Setup canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI
    const ratio = window.devicePixelRatio || 1;
    const width = 360;
    const height = 120;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(ratio, ratio);

    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, [mode]);

  const redrawStrokes = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const ratio = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width / ratio, canvas.height / ratio);

    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    strokesRef.current.forEach((stroke) => {
      if (stroke.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(stroke[0].x, stroke[0].y);
      for (let i = 1; i < stroke.length; i++) {
        ctx.lineTo(stroke[i].x, stroke[i].y);
      }
      ctx.stroke();
    });
  };

  const getCanvasPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (mode !== 'draw') return;
    e.preventDefault();
    isDrawing.current = true;
    const pos = getCanvasPos(e);
    currentStrokeRef.current = [pos];

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current || mode !== 'draw') return;
    e.preventDefault();
    const pos = getCanvasPos(e);
    currentStrokeRef.current.push(pos);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    if (currentStrokeRef.current.length > 0) {
      strokesRef.current.push([...currentStrokeRef.current]);
      currentStrokeRef.current = [];
    }

    // Export transparent PNG
    const canvas = canvasRef.current;
    if (canvas) {
      onSignatureChange(canvas.toDataURL('image/png'));
    }
  };

  const clearCanvas = () => {
    strokesRef.current = [];
    currentStrokeRef.current = [];
    redrawStrokes();
    onSignatureChange('');
  };

  const undoLastStroke = () => {
    strokesRef.current.pop();
    redrawStrokes();
    const canvas = canvasRef.current;
    if (canvas) {
      if (strokesRef.current.length === 0) {
        onSignatureChange('');
      } else {
        onSignatureChange(canvas.toDataURL('image/png'));
      }
    }
  };

  // Convert typed text to signature PNG
  const applyTypedSignature = (text: string, fontStyle: string) => {
    setTypedName(text);
    if (!text.trim()) {
      onSignatureChange('');
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 360;
    canvas.height = 120;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, 360, 120);
    ctx.fillStyle = '#0f172a';
    ctx.font = `italic 36px ${
      fontStyle === 'font-serif' ? 'Georgia, "Times New Roman", serif' : 'cursive, sans-serif'
    }`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 180, 55);

    // Decorative underline
    ctx.beginPath();
    ctx.moveTo(60, 85);
    ctx.quadraticCurveTo(180, 75, 300, 82);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#0f172a';
    ctx.stroke();

    onSignatureChange(canvas.toDataURL('image/png'));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.result) {
        onSignatureChange(evt.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
          Applicant Signature (Required for Pages 2, 4 & 5)
        </label>
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-md">
          <button
            type="button"
            onClick={() => setMode('draw')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded transition-colors ${
              mode === 'draw'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Pen className="w-3.5 h-3.5" />
            Draw
          </button>
          <button
            type="button"
            onClick={() => setMode('type')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded transition-colors ${
              mode === 'type'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            Type
          </button>
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded transition-colors ${
              mode === 'upload'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Upload
          </button>
        </div>
      </div>

      {mode === 'draw' && (
        <div className="space-y-2">
          <div className="relative border border-slate-300 rounded-lg bg-white overflow-hidden shadow-inner flex items-center justify-center p-2">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="cursor-crosshair touch-none bg-white"
            />
            {!signatureDataUrl && (
              <div className="absolute pointer-events-none text-xs text-slate-400 select-none text-center">
                Sign inside this box using touch or mouse
              </div>
            )}
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={undoLastStroke}
                className="flex items-center gap-1 px-2 py-1 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Undo
              </button>
              <button
                type="button"
                onClick={clearCanvas}
                className="flex items-center gap-1 px-2 py-1 text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                Clear
              </button>
            </div>
            <button
              type="button"
              onClick={() => onSignatureChange(SAMPLE_SIGNATURE_DATA_URL)}
              className="flex items-center gap-1 px-2.5 py-1 text-indigo-700 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded transition-colors font-medium"
            >
              <Sparkles className="w-3 h-3" />
              Use Sample Signature
            </button>
          </div>
        </div>
      )}

      {mode === 'type' && (
        <div className="space-y-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Type your full name as signature
            </label>
            <input
              type="text"
              value={typedName}
              onChange={(e) => applyTypedSignature(e.target.value, typedFont)}
              placeholder="e.g. Rajesh Kumar Sharma"
              className="w-full px-3 py-1.5 text-sm bg-white border border-slate-300 rounded focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Style:</span>
            <button
              type="button"
              onClick={() => {
                setTypedFont('font-serif');
                applyTypedSignature(typedName, 'font-serif');
              }}
              className={`px-2.5 py-1 text-xs rounded italic ${
                typedFont === 'font-serif'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border text-slate-700'
              }`}
            >
              Classic Script
            </button>
            <button
              type="button"
              onClick={() => {
                setTypedFont('font-sans');
                applyTypedSignature(typedName, 'font-sans');
              }}
              className={`px-2.5 py-1 text-xs rounded italic ${
                typedFont === 'font-sans'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border text-slate-700'
              }`}
            >
              Modern Cursive
            </button>
          </div>
          {signatureDataUrl && (
            <div className="p-2 bg-white border border-slate-200 rounded flex items-center justify-center">
              <img
                src={signatureDataUrl}
                alt="Signature preview"
                className="max-h-16 object-contain"
              />
            </div>
          )}
        </div>
      )}

      {mode === 'upload' && (
        <div className="space-y-2 p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg p-4 cursor-pointer hover:bg-slate-100 transition-colors">
            <Upload className="w-6 h-6 text-slate-400 mb-1" />
            <span className="text-xs font-medium text-slate-700">Upload signature image file</span>
            <span className="text-xs text-slate-400 mt-0.5">PNG, JPG, or SVG with transparent or white background</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          {signatureDataUrl && (
            <div className="p-2 bg-white border border-slate-200 rounded flex items-center justify-center">
              <img
                src={signatureDataUrl}
                alt="Signature preview"
                className="max-h-16 object-contain"
              />
            </div>
          )}
        </div>
      )}

      {signatureDataUrl ? (
        <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs">
          <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Digital signature inserted on Pages 2, 4, and 5</span>
          </div>
          <button
            type="button"
            onClick={clearCanvas}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-rose-700 bg-white hover:bg-rose-50 border border-rose-300 rounded-md transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
            Remove Inserted Sign
          </button>
        </div>
      ) : (
        <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-800 font-bold">
            <span>✓ Signature boxes are currently BLANK</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-normal">
            No signature is inserted into the PDF. You can download and print the form to sign by hand with black ink, or draw/upload a signature above if needed.
          </p>
        </div>
      )}
    </div>
  );
};
