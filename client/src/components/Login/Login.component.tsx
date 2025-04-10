import { useState, FC } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/userServices";
import { useUser } from "../../context/UserContext";
import { z } from "zod";

interface ApiError {
  response?: {
    data?: {
      error?: string;
    };
  };
  message: string;
}

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

const Login: FC = () => {
  const { fetchUser } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginForm>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      loginSchema.parse(formData);
      const response = await loginUser(formData);
      const data = await response.json();

      if (response.ok) {
        fetchUser();
        navigate("/");
      } else {
        setErrors({
          server: data.error || "Login failed!",
        });
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
      } else if (error instanceof Error) {
        const serverError = error as ApiError;
        if (serverError.response?.data?.error) {
          setErrors({
            server: serverError.response.data.error,
          });
        } else {
          setErrors({
            server: serverError.message || "An error occurred during login",
          });
        }
      } else {
        setErrors({
          server: "An unexpected error occurred",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Welcome Back</h2>

        <div className="auth-toggle-container">
          <button
            type="button"
            className="auth-toggle-button active"
            onClick={() => {}}
          >
            Sign In
          </button>
          <button
            type="button"
            className="auth-toggle-button"
            onClick={() => navigate("/register")}
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
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
          {errors.password && (
            <div className="error-message">{errors.password}</div>
          )}
        </div>

        <button type="submit" className="auth-submit" disabled={loading}>
          {loading ? <span className="register-loader"></span> : "Login"}
        </button>

        {errors.server && <div className="error-message">{errors.server}</div>}
      </form>
    </div>
  );
};

export default Login;
