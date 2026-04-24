import { Photo, User } from '@/types';

const STORAGE_KEYS = {
  CURRENT_USER: 'schoolbal_current_user',
  PHOTOS: 'schoolbal_photos',
  USERS: 'schoolbal_users',
};

// Initialize default admin user
const DEFAULT_ADMIN: User = {
  id: 'admin-1',
  email: 'admin@schoolbal.nl',
  role: 'admin',
  name: 'Beheerder',
};

export const storageUtils = {
  // User operations
  getCurrentUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  },

  setCurrentUser: (user: User | null): void => {
    if (typeof window === 'undefined') return;
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  // Photo operations
  getPhotos: (): Photo[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.PHOTOS);
    return data ? JSON.parse(data) : [];
  },

  savePhotos: (photos: Photo[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(photos));
  },

  addPhoto: (photo: Photo): void => {
    const photos = storageUtils.getPhotos();
    photos.push(photo);
    storageUtils.savePhotos(photos);
  },

  updatePhoto: (id: string, updates: Partial<Photo>): void => {
    const photos = storageUtils.getPhotos();
    const index = photos.findIndex((p) => p.id === id);
    if (index !== -1) {
      photos[index] = { ...photos[index], ...updates };
      storageUtils.savePhotos(photos);
    }
  },

  deletePhoto: (id: string): void => {
    const photos = storageUtils.getPhotos();
    storageUtils.savePhotos(photos.filter((p) => p.id !== id));
  },

  approvePhoto: (id: string): void => {
    storageUtils.updatePhoto(id, { status: 'approved' });
  },

  rejectPhoto: (id: string, reason: string): void => {
    storageUtils.updatePhoto(id, { status: 'rejected', rejectionReason: reason });
  },

  toggleLike: (photoId: string, userId: string): void => {
    const photos = storageUtils.getPhotos();
    const photo = photos.find((p) => p.id === photoId);
    if (photo) {
      const likedIndex = photo.likedBy.indexOf(userId);
      if (likedIndex > -1) {
        photo.likedBy.splice(likedIndex, 1);
        photo.likes--;
      } else {
        photo.likedBy.push(userId);
        photo.likes++;
      }
      storageUtils.savePhotos(photos);
    }
  },

  // Helper to get approved photos
  getApprovedPhotos: (): Photo[] => {
    return storageUtils.getPhotos().filter((p) => p.status === 'approved');
  },

  // Helper to get pending photos
  getPendingPhotos: (): Photo[] => {
    return storageUtils.getPhotos().filter((p) => p.status === 'pending');
  },

  // Helper to get rejected photos
  getRejectedPhotos: (): Photo[] => {
    return storageUtils.getPhotos().filter((p) => p.status === 'rejected');
  },
};

// Initialize default data if needed
export const initializeStorage = (): void => {
  if (typeof window === 'undefined') return;

  // Initialize empty photos array on first app load
  if (!localStorage.getItem(STORAGE_KEYS.PHOTOS)) {
    localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify([]));
  }
  // Do NOT approve pending photos automatically - they must be approved by admin
};
