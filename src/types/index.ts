export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
}

export type PhotoStatus = 'pending' | 'approved' | 'rejected';

export interface Photo {
  id: string;
  filename: string;
  url: string;
  status: PhotoStatus;
  uploaderName: string;
  uploaderEmail: string;
  uploadedAt: number;
  likes: number;
  likedBy: string[]; // user IDs who liked this photo
  rejectionReason?: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, name: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}
