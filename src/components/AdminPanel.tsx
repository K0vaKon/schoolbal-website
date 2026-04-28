'use client';

import React, { useEffect, useState } from 'react';
import { Photo } from '@/types';
import { Check, X, RotateCcw, Trash2, Clock, AlertTriangle } from 'lucide-react';
import styles from './AdminPanel.module.css';

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

  const loadPhotos = async () => {
    try {
      setIsLoading(true);
      const [pendingRes, rejectedRes] = await Promise.all([
        fetch('/api/photos?status=pending'),
        fetch('/api/photos?status=rejected')
      ]);
      
      const pendingData = await pendingRes.json();
      const rejectedData = await rejectedRes.json();
      
      setPendingPhotos(pendingData.photos.sort((a: Photo, b: Photo) => b.uploadedAt - a.uploadedAt));
      setRejectedPhotos(rejectedData.photos.sort((a: Photo, b: Photo) => b.uploadedAt - a.uploadedAt));
    } catch (error) {
      console.error('Error loading photos:', error);
      setPendingPhotos([]);
      setRejectedPhotos([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch(`/api/photos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' })
      });
      
      if (response.ok) {
        loadPhotos();
      }
    } catch (error) {
      console.error('Error approving photo:', error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      const reason = rejectionReason[id] || 'Geen reden gegeven';
      const response = await fetch(`/api/photos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected', rejectionReason: reason })
      });
      
      if (response.ok) {
        setRejectionReason((prev) => {
          const newReason = { ...prev };
          delete newReason[id];
          return newReason;
        });
        loadPhotos();
      }
    } catch (error) {
      console.error('Error rejecting photo:', error);
    }
  };

  const handleRestore = async (id: string) => {
    try {
      const response = await fetch(`/api/photos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'pending' })
      });
      
      if (response.ok) {
        loadPhotos();
      }
    } catch (error) {
      console.error('Error restoring photo:', error);
    }
  };

  const handlePermanentDelete = async (id: string) => {
    if (window.confirm('Weet u zeker dat u deze foto permanent wilt verwijderen?')) {
      try {
        const response = await fetch(`/api/photos/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          loadPhotos();
        }
      } catch (error) {
        console.error('Error deleting photo:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingWrap}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  const photos = activeTab === 'pending' ? pendingPhotos : rejectedPhotos;

  return (
    <div>
      <div className={styles.tabs}>
        <button
          onClick={() => setActiveTab('pending')}
          className={[
            styles.tabButton,
            activeTab === 'pending' ? styles.tabActiveBlue : styles.tabInactive,
          ].join(' ')}
        >
          <Clock size={18} strokeWidth={1.5} />
          Wachten op goedkeuring ({pendingPhotos.length})
        </button>
        <button
          onClick={() => setActiveTab('rejected')}
          className={[
            styles.tabButton,
            activeTab === 'rejected' ? styles.tabActiveRed : styles.tabInactive,
          ].join(' ')}
        >
          <AlertTriangle size={18} strokeWidth={1.5} />
          Afgewezen ({rejectedPhotos.length})
        </button>
      </div>

      {photos.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>
            {activeTab === 'pending' ? <Clock size={48} strokeWidth={1.5} /> : <AlertTriangle size={48} strokeWidth={1.5} />}
          </div>
          <p className={styles.emptyText}>
            {activeTab === 'pending'
              ? 'Geen foto\'s te beoordelen'
              : 'Geen afgewezen foto\'s'}
          </p>
        </div>
      ) : (
        <div className={styles.list}>
          {photos.map((photo) => (
            <div
              key={photo.id}
              className={styles.card}
            >
              <img
                src={photo.url}
                alt={photo.filename}
                className={styles.img}
              />

              <div className={styles.cardBody}>
                <div className={styles.row}>
                  <p className={styles.uploader}>{photo.uploaderName}</p>
                  <span
                    className={[
                      styles.status,
                      activeTab === 'pending' ? styles.statusPending : styles.statusRejected,
                    ].join(' ')}
                  >
                    {activeTab === 'pending' ? 'Wachten' : 'Afgewezen'}
                  </span>
                </div>

                {activeTab === 'rejected' && photo.rejectionReason && (
                  <p className={styles.rejection}>
                    <span className="font-semibold">Reden:</span> {photo.rejectionReason}
                  </p>
                )}

                {activeTab === 'pending' && (
                  <div>
                    <textarea
                      placeholder="Reden voor afwijzing (optioneel)"
                      value={rejectionReason[photo.id] || ''}
                      onChange={(e) => setRejectionReason(prev => ({ ...prev, [photo.id]: e.target.value }))}
                      className={styles.textarea}
                      rows={2}
                    />
                  </div>
                )}

                <div className={styles.actions}>
                  {activeTab === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleApprove(photo.id)}
                        className={[styles.actionBtn, styles.approve].join(' ')}
                      >
                        <Check size={16} strokeWidth={1.5} />
                        Goedkeuren
                      </button>
                      <button
                        onClick={() => handleReject(photo.id)}
                        className={[styles.actionBtn, styles.reject].join(' ')}
                      >
                        <X size={16} strokeWidth={1.5} />
                        Verwijderen
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleRestore(photo.id)}
                        className={[styles.actionBtn, styles.restore].join(' ')}
                      >
                        <RotateCcw size={16} strokeWidth={1.5} />
                        Herstellen
                      </button>
                      <button
                        onClick={() => handlePermanentDelete(photo.id)}
                        className={[styles.actionBtn, styles.deleteForever].join(' ')}
                      >
                        <Trash2 size={16} strokeWidth={1.5} />
                        Definitief
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
