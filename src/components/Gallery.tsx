'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Photo } from '@/types';
import { PhotoCard } from './PhotoCard';
import { useAuth } from '@/contexts/AuthContext';
import styles from './Gallery.module.css';

interface GalleryProps {
  showAdminActions?: boolean;
}

export const Gallery: React.FC<GalleryProps> = ({ showAdminActions = false }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAdmin } = useAuth();

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      const response = await fetch('/api/photos?approved=true');
      const data = await response.json();
      setPhotos(data.photos.sort((a, b) => b.uploadedAt - a.uploadedAt));
    } catch (error) {
      console.error('Error loading photos:', error);
      setPhotos([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoChange = () => {
    loadPhotos();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingWrap}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className={styles.emptyWrap}>
        <p className={styles.emptyText}>Geen foto's beschikbaar</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={styles.grid}
    >
      {photos.map((photo, index) => (
        <motion.div
          key={photo.id}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: index * 0.05, duration: 0.5 }}
          className={styles.item}
        >
          <PhotoCard
            photo={photo}
            onLikeChange={handlePhotoChange}
            onDelete={handlePhotoChange}
            showAdminActions={showAdminActions && isAdmin}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};
