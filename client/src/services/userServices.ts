import {
  RegisterUserInterface,
  LoginUserInterface,
} from "../interfaces/userInterfaces";

export const registerUser = async (formData: RegisterUserInterface) => {
  const response = await fetch("http://localhost:4000/auth/register", {
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
