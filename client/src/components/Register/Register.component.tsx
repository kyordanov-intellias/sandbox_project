import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/userServices";
import { Plus, X } from "lucide-react";
import { z } from "zod";
import type {
  RegisterForm,
  SkillInput,
  ContactInput,
} from "../../interfaces/userInterfaces";
import "./Register.styles.css";
import { useCloudinaryUpload } from "../../hooks/useCloudinaryUpload";
import { DEFAULT_IMAGES } from "./defaultImages";

const skillSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
  proficiencyLevel: z.enum(["beginner", "intermediate", "expert"]),
});

const contactSchema = z.object({
  type: z.enum(["phone", "linkedin", "github", "other"]),
  value: z.string().min(1, "Contact value is required"),
  isPrimary: z.boolean(),
});

const registerSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    userRole: z.enum(["participant", "mentor", "administrator"]),
    skills: z.array(skillSchema),
    contacts: z.array(contactSchema),
    profileImage: z.string().optional(),
    coverImage: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterForm>({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    userRole: "participant",
    skills: [],
    contacts: [],
    profileImage: DEFAULT_IMAGES.profile,
    coverImage: DEFAULT_IMAGES.cover,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const {
    uploading: uploadingProfile,
    error: profileError,
    uploadImage: uploadProfileImage,
  } = useCloudinaryUpload();
  const {
    uploading: uploadingCover,
    error: coverError,
    uploadImage: uploadCoverImage,
  } = useCloudinaryUpload();

  const handleImageUpload =
    (type: "profile" | "cover") =>
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const uploadFn =
        type === "profile" ? uploadProfileImage : uploadCoverImage;
      const imageUrl = await uploadFn(file);

      if (imageUrl) {
        setFormData((prev) => ({
          ...prev,
          [type === "profile" ? "profileImage" : "coverImage"]: imageUrl,
        }));
      }
    };

  const getPasswordStrength = (
    password: string
  ): "weak" | "medium" | "strong" => {
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const score = [hasLower, hasUpper, hasNumber, hasSpecial].filter(
      Boolean
    ).length;

    if (score <= 2) return "weak";
    if (score === 3) return "medium";
    return "strong";
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const addSkill = () => {
    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, { name: "", proficiencyLevel: "beginner" }],
    }));
  };

  const removeSkill = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const updateSkill = (
    index: number,
    field: keyof SkillInput,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.map((skill, i) =>
        i === index ? { ...skill, [field]: value } : skill
      ),
    }));
  };

  const addContact = () => {
    setFormData((prev) => ({
      ...prev,
      contacts: [
        ...prev.contacts,
        { type: "phone", value: "", isPrimary: false },
      ],
    }));
  };

  const removeContact = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      contacts: prev.contacts.filter((_, i) => i !== index),
    }));
  };

  const updateContact = (
    index: number,
    field: keyof ContactInput,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      contacts: prev.contacts.map((contact, i) =>
        i === index ? { ...contact, [field]: value } : contact
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      registerSchema.parse(formData);
      const response = await registerUser(formData);
      console.log(response);
      const data = await response.json();
      console.log(data);

      if (response.ok) {
        setTimeout(() => {
          navigate("/login");
        }, 1000);
        return;
      } else {
        setErrors({ general: data.error || "Registration failed!" });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        <div className="auth-toggle-container">
          <button
            type="button"
            className="auth-toggle-button"
            onClick={() => navigate("/login")}
          >
            Sign In
          </button>
          <button
            type="button"
            className="auth-toggle-button active"
            onClick={() => {}}
          >
            Sign Up
          </button>
        </div>

        <div className="form-section images-section">
          <div className="form-group">
            <label>Profile Picture</label>
            <div className="register__file-input-container">
              <label className="register__file-label">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload("profile")(e)}
                  className="register__file-input"
                />
                Select Image
              </label>
              {formData.profileImage !== DEFAULT_IMAGES.profile && (
                <>
                  <div className="register__selected-file">Image selected</div>
                  <div className="register__image-preview">
                    <img src={formData.profileImage} alt="Profile preview" />
                  </div>
                </>
              )}
              {uploadingProfile && (
                <div className="upload-status">Uploading...</div>
              )}
              {profileError && (
                <div className="error-message">{profileError}</div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Cover Image</label>
            <div className="register__file-input-container">
              <label className="register__file-label">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload("cover")(e)}
                  className="register__file-input"
                />
                Select Image
              </label>
              {formData.coverImage !== DEFAULT_IMAGES.cover && (
                <>
                  <div className="register__selected-file">Image selected</div>
                  <div className="register__image-preview register__image-preview--cover">
                    <img src={formData.coverImage} alt="Cover preview" />
                  </div>
                </>
              )}
              {uploadingCover && (
                <div className="upload-status">Uploading...</div>
              )}
              {coverError && <div className="error-message">{coverError}</div>}
            </div>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Enter your first name"
          />
          {errors.firstName && (
            <div className="error-message">{errors.firstName}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Enter your last name"
          />
          {errors.lastName && (
            <div className="error-message">{errors.lastName}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
          />
          {formData.password && (
            <div className="password-strength">
              <div className="strength-bar">
                <div className={`strength-${passwordStrength}`} />
              </div>
              <small>Password strength: {passwordStrength}</small>
            </div>
          )}
          {errors.password && (
            <div className="error-message">{errors.password}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && (
            <div className="error-message">{errors.confirmPassword}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="userRole">Role</label>
          <select
            id="userRole"
            name="userRole"
            value={formData.userRole}
            onChange={handleChange}
          >
            <option value="participant">Participant (Learner)</option>
            <option value="mentor">Mentor/Instructor</option>
            <option value="administrator">Administrator</option>
          </select>
          {errors.userRole && (
            <div className="error-message">{errors.userRole}</div>
          )}
        </div>

        {/* Skills Section */}
        <div className="register__form-section">
          <h3 className="register__form-section-title">Skills</h3>
          {formData.skills.map((skill, index) => (
            <div key={index} className="register__input-row">
              <input
                type="text"
                placeholder="Skill name"
                value={skill.name}
                onChange={(e) => updateSkill(index, "name", e.target.value)}
              />
              <select
                value={skill.proficiencyLevel}
                onChange={(e) =>
                  updateSkill(index, "proficiencyLevel", e.target.value)
                }
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="expert">Expert</option>
              </select>
              <button
                type="button"
                className="register__remove-btn"
                onClick={() => removeSkill(index)}
              >
                <X size={16} />
              </button>
              {(!skill.name || errors[`skills.${index}.name`]) && (
                <div className="error-message">
                  {errors[`skills.${index}.name`] || "Skill name is required"}
                </div>
              )}
            </div>
          ))}
          <button
            type="button"
            className="register__add-btn"
            onClick={addSkill}
          >
            <Plus size={16} /> Add Skill
          </button>
        </div>

        {/* Contacts Section */}
        <div className="register__form-section">
          <h3 className="register__form-section-title">Contacts</h3>
          {formData.contacts.map((contact, index) => (
            <div
              key={index}
              className="register__input-row register__input-row--contact"
            >
              <select
                value={contact.type}
                onChange={(e) => updateContact(index, "type", e.target.value)}
              >
                <option value="phone">Phone</option>
                <option value="linkedin">LinkedIn</option>
                <option value="github">GitHub</option>
                <option value="other">Other</option>
              </select>
              <input
                type="text"
                placeholder="Contact value"
                value={contact.value}
                onChange={(e) => updateContact(index, "value", e.target.value)}
              />
              <label className="register__checkbox-label">
                <input
                  type="checkbox"
                  checked={contact.isPrimary}
                  onChange={(e) =>
                    updateContact(index, "isPrimary", e.target.checked)
                  }
                />
                Primary
              </label>
              <button
                type="button"
                className="register__remove-btn"
                onClick={() => removeContact(index)}
              >
                <X size={16} />
              </button>
              {(!contact.value || errors[`contacts.${index}.value`]) && (
                <div className="error-message">
                  {errors[`contacts.${index}.value`] ||
                    "Contact value is required"}
                </div>
              )}
            </div>
          ))}
          <button
            type="button"
            className="register__add-btn"
            onClick={addContact}
          >
            <Plus size={16} /> Add Contact
          </button>
        </div>

        {errors.general && (
          <div className="error-message error-message--general">
            {errors.general}
          </div>
        )}

        <button type="submit" className="auth-submit" disabled={loading}>
          {loading ? (
            <span className="register-loader"></span>
          ) : (
            "Create Account"
          )}
        </button>
      </form>
    </div>
  );
};

export default Register;
