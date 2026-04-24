'use client';

import React, { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { storageUtils } from '@/lib/storage';
import { imageUtils } from '@/lib/imageUtils';
import { Upload, X, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { Photo } from '@/types';
import styles from './UploadComponent.module.css';

export const UploadComponent: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [uploaderName, setUploaderName] = useState('');
  const [uploaderEmail, setUploaderEmail] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
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
      let processedBlob: Blob = file;
      if (file.type.includes('heic') || file.type.includes('heif')) {
        processedBlob = await imageUtils.convertHeicToJpeg(file);
      }

      const compressedBlob = await imageUtils.compressImage(processedBlob);
      const previewUrl = imageUtils.getBlobUrl(compressedBlob);

      setSelectedFile(new File([processedBlob], file.name, { type: 'image/jpeg' }));
      setPreview(previewUrl);
    } catch (err) {
      console.error('Error processing file:', err);
      setError('Fout bij het verwerken van het bestand.');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.heic', '.heif']
    },
    multiple: false,
    maxSize: 50 * 1024 * 1024,
  });

  const removeFile = () => {
    setSelectedFile(null);
    setPreview('');
    setError('');
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalEmail = user?.email || uploaderEmail;
    if (!selectedFile || !uploaderName || !finalEmail) {
      setError('Vul alstublieft alle velden in.');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
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
        status: 'pending',
        uploaderName: uploaderName,
        uploaderEmail: finalEmail,
        uploadedAt: Date.now(),
        likes: 0,
        likedBy: [],
      };

      storageUtils.addPhoto(newPhoto);

      setSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Fout bij het uploaden van de foto.');
    } finally {
      setIsUploading(false);
    }
  };

  if (success) {
    return (
      <div className={styles.successCard}>
        <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" strokeWidth={1.5} />
        <h3 className={styles.successTitle}>Foto geüpload!</h3>
        <p className={styles.successText}>Uw foto wacht op goedkeuring door de beheerder.</p>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <form onSubmit={handleUpload} className={styles.form}>
        <div
          {...getRootProps()}
          className={[
            styles.dropzone,
            isDragActive ? styles.dropzoneActive : styles.dropzoneIdle,
          ].join(' ')}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" strokeWidth={1.5} />
          {isDragActive ? (
            <p className="text-blue-300 font-semibold text-lg">Laat de foto hier los...</p>
          ) : (
            <div>
              <p className={styles.dropTitle}>
                Sleep een foto hierheen of klik om te selecteren
              </p>
              <p className={styles.dropHint}>
                JPG, PNG, GIF, WebP of HEIC (max 50MB)
              </p>
            </div>
          )}
        </div>

        {preview && (
          <div className={styles.previewCard}>
            <div className={styles.previewHeader}>
              <h4 className={styles.previewTitle}>Voorvertoning</h4>
              <button
                type="button"
                onClick={removeFile}
                className={styles.previewClose}
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>
            <img
              src={preview}
              alt="Preview"
              className={styles.previewImg}
            />
          </div>
        )}

        <div>
          <label htmlFor="uploaderName" className={styles.label}>
            Uw naam
          </label>
          <input
            type="text"
            id="uploaderName"
            value={uploaderName}
            onChange={(e) => setUploaderName(e.target.value)}
            className={styles.input}
            placeholder="Voer uw naam in"
            required
          />
        </div>

        {!user && (
          <div>
            <label htmlFor="uploaderEmail" className={styles.label}>
              E-mailadres
            </label>
            <input
              type="email"
              id="uploaderEmail"
              value={uploaderEmail}
              onChange={(e) => setUploaderEmail(e.target.value)}
              className={styles.input}
              placeholder="jouw@email.nl"
              required
            />
          </div>
        )}

        {error && (
          <div className={styles.errorBox}>
            <p className={styles.errorText}>{error}</p>
          </div>
        )}

        <div className={styles.actions}>
          <button
            type="submit"
            disabled={!selectedFile || !uploaderName || (!user && !uploaderEmail) || isUploading}
            className={styles.submitButton}
          >
            {isUploading ? 'Uploaden...' : 'Foto uploaden'}
          </button>
        </div>
      </form>
    </div>
  );
};
