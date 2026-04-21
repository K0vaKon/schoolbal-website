import heic2any from 'heic2any';

export const imageUtils = {
  // Convert HEIC/HEIF to JPEG
  async convertHeicToJpeg(blob: Blob): Promise<Blob> {
    // Check if file is HEIC/HEIF
    if (!blob.type.includes('heic') && !blob.type.includes('heif')) {
      return blob;
    }

    try {
      const convertedBlob = await heic2any({
        blob,
        toType: 'image/jpeg',
        quality: 0.9,
      });
      return convertedBlob as Blob;
    } catch (error) {
      console.error('Error converting HEIC:', error);
      return blob;
    }
  },

  // Generate blob URL from file
  getBlobUrl(blob: Blob): string {
    return URL.createObjectURL(blob);
  },

  // Get file extension based on MIME type
  getExtension(mimeType: string): string {
    const map: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'image/webp': 'webp',
      'image/heic': 'jpg',
      'image/heif': 'jpg',
    };
    return map[mimeType] || 'jpg';
  },

  // Check if file is a valid image
  isValidImageFile(file: File): boolean {
    const validTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/heic',
      'image/heif',
    ];
    return validTypes.includes(file.type);
  },

  // Compress image for display
  async compressImage(blob: Blob, maxWidth: number = 1920, maxHeight: number = 1080): Promise<Blob> {
    return new Promise((resolve) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob((compressedBlob) => {
          resolve(compressedBlob || blob);
        }, 'image/jpeg', 0.85);
      };

      img.src = URL.createObjectURL(blob);
    });
  },
};
