import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.styles.css";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userRole: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://localhost:4001/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          userRole: formData.userRole,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("User created successfully!");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(data.error || "Registration failed!");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2 className="header">Register</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <label htmlFor="userRole">Choose a role:</label>
          <select
            name="userRole"
            id="userRole"
            value={formData.userRole}
            onChange={handleChange}
            required
          >
            <option value="">--Select a role--</option>
            <option value="participant">Participant</option>
            <option value="speaker">Speaker</option>
            <option value="mentor">Mentor</option>
            <option value="coordinator">Coordinator</option>
            <option value="admin">Admin</option>
          </select>

          {error && <p className="error-text">{error}</p>}
          {successMessage && <p className="success-text">{successMessage}</p>}

          <button type="submit">Register</button>
        </form>

        <div className="signup-link">
          <span>Already have an account? </span>
          <Link to={"/login"}>Sing In Now</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
