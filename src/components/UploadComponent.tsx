'use client';

import React, { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { storageUtils } from '@/lib/storage';
import { imageUtils } from '@/lib/imageUtils';
import { Upload, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Photo } from '@/types';

export const UploadComponent: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [uploaderName, setUploaderName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');

    if (!imageUtils.isValidImageFile(file)) {
      setError('Selecteer alstublieft een geldig afbeeldingsbestand (JPG, PNG, GIF, WebP of HEIC).');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setError('Bestand is te groot. Maximale grootte is 50MB.');
      return;
    }

    try {
      // Convert HEIC if needed
      let processedBlob: Blob = file;
      if (file.type.includes('heic') || file.type.includes('heif')) {
        processedBlob = await imageUtils.convertHeicToJpeg(file);
      }

      // Compress for preview
      const compressedBlob = await imageUtils.compressImage(processedBlob);
      const previewUrl = imageUtils.getBlobUrl(compressedBlob);

      setSelectedFile(new File([processedBlob], file.name, { type: 'image/jpeg' }));
      setPreview(previewUrl);
    } catch (err) {
      console.error('Error processing file:', err);
      setError('Fout bij het verwerken van het bestand.');
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile || !uploaderName || !user) {
      setError('Vul alstublieft alle velden in.');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      // Upload file to server
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.details || 'Upload failed');
      }

      const { url } = result;

      const newPhoto: Photo = {
        id: `photo-${Date.now()}`,
        filename: selectedFile.name,
        url: url,
        status: 'approved',
        uploaderName: uploaderName,
        uploaderEmail: user.email,
        uploadedAt: Date.now(),
        likes: 0,
        likedBy: [],
      };

      storageUtils.addPhoto(newPhoto);

      setSuccess(true);
      setSelectedFile(null);
      setPreview('');
      setUploaderName('');
      if (fileInputRef.current) fileInputRef.current.value = '';

      setTimeout(() => {
        setSuccess(false);
        router.push('/');
      }, 2000);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Fout bij het uploaden van het bestand.');
      setIsUploading(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreview('');
    setUploaderName('');
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleUpload} className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6">Foto uploaden</h1>

        {/* File Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selecteer foto
          </label>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition"
            onClick={() => fileInputRef.current?.click()}
          >
            {preview ? (
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-96 mx-auto rounded-lg object-contain"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClear();
                  }}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <div>
                <Upload size={48} className="mx-auto text-gray-400 mb-2" />
                <p className="text-lg font-medium text-gray-700">
                  Klik om foto te selecteren
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  of sleep een foto hier naar toe
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Ondersteunde formaten: JPG, PNG, GIF, WebP, HEIC
                </p>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.heic,.heif"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Uploader Name */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Jouw naam
          </label>
          <input
            type="text"
            value={uploaderName}
            onChange={(e) => setUploaderName(e.target.value)}
            placeholder="Vul je naam in"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            Foto succesvol geüpload! U wordt teruggestuurd...
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={!selectedFile || !uploaderName || isUploading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-lg transition"
          >
            {isUploading ? 'Bezig met uploaden...' : 'Uploaden'}
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg transition"
          >
            Wissen
          </button>
        </div>
      </form>
    </div>
  );
};
