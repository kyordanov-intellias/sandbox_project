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
  createdAt: Date;
  profile?: {
    auth_id?: string;
    email: string;
    first_name: string;
    id: string;
    last_name: string;
    role: string;
    skills: Skill[];
    contacts: Contact[];
  }
}

export interface EditFormData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface Skill {
  id: string;
  proficiency_level: 'beginner' | 'intermediate' | 'expert';
  skill: {
    id: string;
    name: string;
  }
}

export interface Contact {
  id: string;
  type: 'phone' | 'linkedin' | 'github' | 'other';
  value: string;
  is_primary: boolean;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  userRole: 'participant' | 'mentor' | 'administrator';
  skills: Skill[];
  contacts: Contact[];
}
