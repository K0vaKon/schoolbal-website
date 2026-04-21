'use client';

import React, { useEffect, useState } from 'react';
import Masonry from 'react-masonry-css';
import { Photo } from '@/types';
import { PhotoCard } from './PhotoCard';
import { storageUtils } from '@/lib/storage';
import { useAuth } from '@/contexts/AuthContext';

interface GalleryProps {
  showAdminActions?: boolean;
}

export const Gallery: React.FC<GalleryProps> = ({ showAdminActions = false }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAdmin } = useAuth();

  useEffect(() => {
    const loadPhotos = () => {
      const approvedPhotos = storageUtils.getApprovedPhotos();
      setPhotos(approvedPhotos.sort((a, b) => b.uploadedAt - a.uploadedAt));
      setIsLoading(false);
    };

    loadPhotos();
  }, []);

  const handlePhotoChange = () => {
    const approvedPhotos = storageUtils.getApprovedPhotos();
    setPhotos(approvedPhotos.sort((a, b) => b.uploadedAt - a.uploadedAt));
  };

  const breakpointColumns = {
    default: 4,
    1536: 4,
    1280: 3,
    1024: 3,
    768: 2,
    640: 1,
  };

  if (isLoading) {
    return <div className="text-center py-12">Laden...</div>;
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Geen foto's beschikbaar</p>
      </div>
    );
  }

  return (
    <Masonry
      breakpointCols={breakpointColumns}
      className="masonry-grid"
      columnClassName="masonry-grid-column"
    >
      {photos.map((photo) => (
        <PhotoCard
          key={photo.id}
          photo={photo}
          onLikeChange={handlePhotoChange}
          onDelete={handlePhotoChange}
          showAdminActions={showAdminActions && isAdmin}
        />
      ))}
    </Masonry>
  );
};
