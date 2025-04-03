import { useState } from "react";
import { useCloudinaryUpload } from "../../hooks/useCloudinaryUpload";
import "./ImageUploadPreview.styles.css";

interface ImageUploadPreviewProps {
  onImageUpload: (url: string) => void;
  label: string;
  className?: string;
}

export const ImageUploadPreview: React.FC<ImageUploadPreviewProps> = ({
  onImageUpload,
  label,
  className = "",
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const { uploading, error, uploadImage } = useCloudinaryUpload();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary
    const imageUrl = await uploadImage(file);
    if (imageUrl) {
      onImageUpload(imageUrl);
    }
  };

  return (
    <div className={`image-upload-container ${className}`}>
      <label className="image-upload-label">
        <span className="label-text">{label}</span>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="file-input"
        />
      </label>

      {preview && (
        <div className="preview-container">
          <img src={preview} alt="Preview" className="preview-image" />
        </div>
      )}

      {uploading && <div className="upload-status">Uploading...</div>}

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};
