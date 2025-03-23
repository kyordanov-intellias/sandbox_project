import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/userServices";
import { z } from "zod";

const registerSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    userRole: z.enum(["participant", "mentor", "administrator"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterForm>({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    userRole: "participant",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      registerSchema.parse(formData);
      const response = await registerUser(formData);
      const data = await response.json();

      if (response.ok) {
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setErrors(data.error || "Registration failed!");
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

        <button type="submit" className="auth-submit">
          Create Account
        </button>
      </form>
    </div>
  );
};

export default Register;
