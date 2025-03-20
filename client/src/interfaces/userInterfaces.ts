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
