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

export interface User {
  id: string;         
  email: string;
  userRole: string;
  profile?: { 
    first_name: string;
    last_name: string;
  }
}