export interface RegisterUserInterface {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userRole: string;
}

export interface LoginUserInterface {
  email: string;
  password: string;
}

export interface UpdateUserInterface {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  userRole?: string;
}

export interface UserInterface {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}
