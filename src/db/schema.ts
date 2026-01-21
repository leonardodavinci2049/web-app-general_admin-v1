export type Role = "ADMIN" | "MEMBER" | "BILLING";

export type Organization = {
  id: string;
  system_id?: number | null;
  name: string;
  slug?: string | null;
  logo?: string | null;
  createdAt?: Date | null;
  metadata?: string | null;
  member?: Member[];
};

export type User = {
  id: string;
  name?: string | null;
  email?: string | null;
  emailVerified?: boolean | null;
  image?: string | null;
  createdAt?: Date | string | null;
  updatedAt?: Date | string | null;
  twoFactorEnabled?: boolean | null;
  role?: string | null;
  banned?: boolean | null;
  banReason?: string | null;
  banExpires?: Date | string | null;
};

export type Member = {
  id: string;
  organizationId?: string;
  userId?: string | null;
  role?: string | null;
  createdAt?: Date | null;
  metadata?: string | null;
  user: User;
};

export type LogLogin = {
  logId: number;
  appId: number;
  organizationId: string;
  userId: string;
  userName: string;
  moduleId: string;
  recordId: string;
  log: string;
  note: string;
  createdAt: Date | string;
};

export type LogOperation = {
  logId: number;
  appId: number;
  appName: string;
  organizationId: string;
  organizationName: string;
  userId: string;
  userName: string;
  moduleId: string;
  recordId: string;
  log: string;
  note: string;
  createdAt: Date | string;
};

export type Invitation = {
  id: string;
  organizationId: string;
  teamId: string;
  email: string;
  role: string;
  status: string;
  expiresAt: Date | string;
  inviterId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type MemberRole = {
  id: number;
  role: string;
  name: string;
};
