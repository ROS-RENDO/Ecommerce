// types/user.ts
export interface User {
  _id: string;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  isAdmin: boolean;
  resetCode?: string;
  resetCodeExpire?: string;
  createdAt: string;
  updatedAt: string;
}
