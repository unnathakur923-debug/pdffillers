import React from 'react';
import { Camera, Upload, Trash2, Sparkles, Check } from 'lucide-react';
import { SAMPLE_PHOTO_DATA_URL } from '../data/sampleData';

interface PhotoUploaderProps {
  photoDataUrl: string;
  onPhotoChange: (dataUrl: string) => void;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  photoDataUrl,
  onPhotoChange,
}) => {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.result) {
        onPhotoChange(evt.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
          Passport Size Photograph (Page 2 Photo Box)
        </label>
        <span className="text-xs text-slate-500">3.5 cm x 4.5 cm (Standard)</span>
      </div>

      <div className="flex items-start gap-4 p-3 bg-slate-50 border border-slate-200 rounded-lg">
        {/* Photo Box Preview */}
        <div className="relative w-24 h-32 shrink-0 border-2 border-dashed border-slate-300 rounded-sm bg-white overflow-hidden flex flex-col items-center justify-center shadow-xs">
          {photoDataUrl ? (
            <img
              src={photoDataUrl}
              alt="Passport Photo Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center p-2 text-slate-400">
              <Camera className="w-6 h-6 mx-auto mb-1 stroke-1" />
              <span className="text-[10px] leading-tight block">Photo Box Page 2</span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex-1 space-y-2">
          <p className="text-xs text-slate-600">
            Please attach a recent colored passport size photograph with a light background. It will be printed directly into the official photo frame on Page 2.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <label className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white text-slate-700 border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer transition-colors shadow-2xs">
              <Upload className="w-3.5 h-3.5" />
              Upload Image
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={() => onPhotoChange(SAMPLE_PHOTO_DATA_URL)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Use Sample Photo
            </button>

            {photoDataUrl && (
              <button
                type="button"
                onClick={() => onPhotoChange('')}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-md transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remove
              </button>
            )}
          </div>

          {photoDataUrl && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium pt-1">
              <Check className="w-3.5 h-3.5" />
              <span>Photograph ready and positioned in Page 2 Photo Frame</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
