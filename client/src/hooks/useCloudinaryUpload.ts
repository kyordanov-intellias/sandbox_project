import { useState } from 'react';
import { env } from '../config/env';

interface UseCloudinaryUploadReturn {
  uploading: boolean;
  error: string | null;
  uploadImage: (file: File) => Promise<string | null>;
}

export const useCloudinaryUpload = (): UseCloudinaryUploadReturn => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', env.cloudinary.uploadPreset);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${env.cloudinary.cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload image');
      }

      return data.secure_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploading, error, uploadImage };
};