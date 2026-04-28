'use client';

import React, { useState } from 'react';
import { Photo } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, Trash2 } from 'lucide-react';
import styles from './PhotoCard.module.css';

interface PhotoCardProps {
  photo: Photo;
  onLikeChange?: () => void;
  onDelete?: () => void;
  showAdminActions?: boolean;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({
  photo,
  onLikeChange,
  onDelete,
  showAdminActions = false,
}) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(
    user ? photo.likedBy.includes(user.id) : false
  );
  const [likes, setLikes] = useState(photo.likes);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleLike = async () => {
    if (!user) return;

    setIsAnimating(true);
    
    try {
      const newLikedBy = isLiked
        ? photo.likedBy.filter(id => id !== user.id)
        : [...photo.likedBy, user.id];
      
      const response = await fetch(`/api/photos/${photo.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          likedBy: newLikedBy.join(','),
          likes: newLikedBy.length
        })
      });
      
      if (response.ok) {
        setIsLiked(!isLiked);
        setLikes(isLiked ? likes - 1 : likes + 1);
        onLikeChange?.();
      }
    } catch (error) {
      console.error('Error updating like:', error);
    }

    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleDelete = async () => {
    if (window.confirm('Bent u zeker dat u deze foto wilt verwijderen?')) {
      try {
        const response = await fetch(`/api/photos/${photo.id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          onDelete?.();
        }
      } catch (error) {
        console.error('Error deleting photo:', error);
      }
    }
  };

  return (
    <div className="group">
      <div className={styles.card}>
        <div className={styles.media}>
          <img
            src={photo.url}
            alt={photo.filename}
            className={styles.img}
          />

          {/* Soft bottom gradient for readability */}
          <div className={styles.gradient} />

          {/* Admin delete button */}
          {showAdminActions && (
            <div className={styles.adminWrap}>
              <button
                onClick={handleDelete}
                className={styles.adminButton}
                title="Verwijderen"
              >
                <Trash2 size={18} strokeWidth={1.5} />
              </button>
            </div>
          )}

          {/* Info overlay */}
          <div className={styles.overlay}>
            <p className={styles.uploader}>{photo.uploaderName}</p>
            <button
              onClick={handleLike}
              className={[
                styles.likeButton,
                isLiked ? styles.likeLiked : styles.likeUnliked,
                isAnimating ? styles.animating : '',
              ].join(' ')}
            >
              <Heart
                size={16}
                fill={isLiked ? 'currentColor' : 'none'}
                strokeWidth={1.5}
                className={`transition-all duration-200 ${isAnimating ? styles.heartAnimating : ''}`}
              />
              <span>{likes}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
