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
    authId?: string;
    email: string;
    firstName: string;
    id: string;
    lastName: string;
    role: string;
    profileImage?: string;
    coverImage?: string;
    skills: Array<{
      id: string;
      proficiencyLevel:string;
      skill:{
        id: string;
        name: string;
      }
    }>;
    contacts: Array<{
      id: string;
      type: string;
      value: string;
      isPrimary: boolean;
    }>;
  };
}

export interface EditFormData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface SkillInput {
  name: string;
  proficiencyLevel: "beginner" | "intermediate" | "expert";
}

export interface ContactInput {
  type: "phone" | "linkedin" | "github" | "other";
  value: string;
  isPrimary: boolean;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  userRole: "participant" | "mentor" | "administrator";
  skills: SkillInput[];
  contacts: ContactInput[];
  profileImage: string;
  coverImage: string;
}