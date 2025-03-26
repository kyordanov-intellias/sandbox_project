interface EnvConfig {
    cloudinary: {
      cloudName: string;
      uploadPreset: string;
    };
  }
  
  export const env: EnvConfig = {
    cloudinary: {
      cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '',
      uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '',
    },
  };
  
  // Validation
  if (!env.cloudinary.cloudName) {
    console.error('Missing Cloudinary cloud name in environment variables');
  }
  if (!env.cloudinary.uploadPreset) {
    console.error('Missing Cloudinary upload preset in environment variables');
  }