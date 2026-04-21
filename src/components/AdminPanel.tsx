'use client';

import React, { useEffect, useState } from 'react';
import { Photo } from '@/types';
import { storageUtils } from '@/lib/storage';
import { Check, X, RotateCcw, Trash2 } from 'lucide-react';

interface AdminPanelProps {}

export const AdminPanel: React.FC<AdminPanelProps> = () => {
  const [pendingPhotos, setPendingPhotos] = useState<Photo[]>([]);
  const [rejectedPhotos, setRejectedPhotos] = useState<Photo[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'rejected'>('pending');
  const [rejectionReason, setRejectionReason] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = () => {
    setPendingPhotos(storageUtils.getPendingPhotos());
    setRejectedPhotos(storageUtils.getRejectedPhotos());
    setIsLoading(false);
  };

  const handleApprove = (id: string) => {
    storageUtils.approvePhoto(id);
    loadPhotos();
  };

  const handleReject = (id: string) => {
    const reason = rejectionReason[id] || 'Geen reden gegeven';
    storageUtils.rejectPhoto(id, reason);
    setRejectionReason((prev) => {
      const newReason = { ...prev };
      delete newReason[id];
      return newReason;
    });
    loadPhotos();
  };

  const handleRestore = (id: string) => {
    storageUtils.updatePhoto(id, { status: 'pending' });
    loadPhotos();
  };

  const handlePermanentDelete = (id: string) => {
    if (window.confirm('Weet u zeker dat u deze foto permanent wilt verwijderen?')) {
      storageUtils.deletePhoto(id);
      loadPhotos();
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Laden...</div>;
  }

  const photos = activeTab === 'pending' ? pendingPhotos : rejectedPhotos;

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Beheer</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 font-medium transition border-b-2 ${
            activeTab === 'pending'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-800'
          }`}
        >
          Te beoordelen ({pendingPhotos.length})
        </button>
        <button
          onClick={() => setActiveTab('rejected')}
          className={`px-4 py-2 font-medium transition border-b-2 ${
            activeTab === 'rejected'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-800'
          }`}
        >
          Afgewezen ({rejectedPhotos.length})
        </button>
      </div>

      {/* Photos Grid */}
      {photos.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>
            {activeTab === 'pending'
              ? 'Geen foto\'s te beoordelen'
              : 'Geen afgewezen foto\'s'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo) => (
            <div key={photo.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="aspect-square bg-gray-100 overflow-hidden">
                <img
                  src={photo.url}
                  alt={photo.filename}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4">
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Naam:</strong> {photo.uploaderName}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>E-mail:</strong> {photo.uploaderEmail}
                </p>
                <p className="text-xs text-gray-400 mb-3">
                  {new Date(photo.uploadedAt).toLocaleString('nl-NL')}
                </p>

                {activeTab === 'pending' ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-gray-700 block mb-1">
                        Reden voor afwijzing (optioneel)
                      </label>
                      <input
                        type="text"
                        value={rejectionReason[photo.id] || ''}
                        onChange={(e) =>
                          setRejectionReason((prev) => ({
                            ...prev,
                            [photo.id]: e.target.value,
                          }))
                        }
                        placeholder="Reden..."
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(photo.id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition font-medium"
                      >
                        <Check size={18} />
                        Goedkeuren
                      </button>
                      <button
                        onClick={() => handleReject(photo.id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition font-medium"
                      >
                        <X size={18} />
                        Afwijzen
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {photo.rejectionReason && (
                      <div className="p-2 bg-red-100 text-red-700 text-sm rounded">
                        <strong>Reden:</strong> {photo.rejectionReason}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRestore(photo.id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition font-medium"
                      >
                        <RotateCcw size={18} />
                        Herstellen
                      </button>
                      <button
                        onClick={() => handlePermanentDelete(photo.id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition font-medium"
                      >
                        <Trash2 size={18} />
                        Verwijderen
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
