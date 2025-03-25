import {
  LoginUserInterface,
  UpdateUserInterface,
  RegisterForm,
} from "../interfaces/userInterfaces";

export const registerUser = async (formData: RegisterForm) => {
  const { confirmPassword, ...registrationData } = formData;
  console.log(confirmPassword);
  const response = await fetch("http://localhost:4000/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(registrationData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Registration failed");
  }

  return response;
};

export const loginUser = async (formData: LoginUserInterface) => {
  const response = await fetch("http://localhost:4000/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: formData.email,
      password: formData.password,
    }),
    credentials: "include",
  });

  return response;
};

export const getUser = async () => {
  const response = await fetch("http://localhost:4000/auth/me", {
    method: "GET",
    credentials: "include",
  });

  return response;
};

export const logoutUser = async () => {
  return await fetch("http://localhost:4000/auth/logout", {
    method: "POST",
    credentials: "include",
  });
};

export const getUserById = async (id: string) => {
  const response = await fetch(`http://localhost:4000/users/${id}`, {
    method: "GET",
    credentials: "include",
  });

  return response;
};

export const updateUserById = async (
  id: string,
  formData: Partial<UpdateUserInterface>
) => {
  const response = await fetch(`http://localhost:4000/users/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  return response;
};

export const deleteUserById = async (id: string) => {
  const response = await fetch(`http://localhost:4000/users/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  return response;
};
