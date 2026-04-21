'use client';

import React, { useState } from 'react';
import { Photo } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, Trash2 } from 'lucide-react';
import { storageUtils } from '@/lib/storage';

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

  const handleLike = () => {
    if (!user) return;

    storageUtils.toggleLike(photo.id, user.id);
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
    onLikeChange?.();
  };

  const handleDelete = () => {
    if (window.confirm('Bent u zeker dat u deze foto wilt verwijderen?')) {
      storageUtils.deletePhoto(photo.id);
      onDelete?.();
    }
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition group">
      <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
        <img
          src={photo.url}
          alt={photo.filename}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {showAdminActions && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg shadow-lg transition"
              title="Verwijderen"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>

      <div className="p-3">
        <p className="text-xs text-gray-500 mb-1 truncate">{photo.uploaderName}</p>
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 text-sm font-medium transition ${
            isLiked
              ? 'text-red-500 hover:text-red-600'
              : 'text-gray-600 hover:text-red-500'
          }`}
        >
          <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
          <span>{likes}</span>
        </button>
      </div>
    </div>
  );
};
