export interface User {
  id?: number;
  username: string;
  email: string;
  password: string;
  profilePicture?: string;
  verified?: boolean;
  phone: string;
  whatsapp: string;
  role?:Role;

}

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
  SUPER_ADMIN = 'SUPER_ADMIN',
}
