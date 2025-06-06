export type User = {
  id: number;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  userRole?: string;
  createdAt: Date;
  updatedAt: Date;
};
