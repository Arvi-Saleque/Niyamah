import type { userRoleEnum } from "@/lib/db/schema";

export type UserRole = (typeof userRoleEnum.enumValues)[number];

export interface User {
  id: string;
  name: string | null;
  email: string;
  passwordHash: string | null;
  phone: string | null;
  avatar: string | null;
  role: UserRole;
  verified: boolean;
  emailVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  phone?: string | null;
  role?: UserRole;
}
