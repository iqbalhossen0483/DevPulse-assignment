import type { Request } from 'express';

export type UserRole = 'contributor' | 'maintainer';
export type IssueType = 'bug' | 'feature_request';
export type IssueStatus = 'open' | 'in_progress' | 'resolved';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
}

export type SafeUser = Omit<User, 'password'>;

export interface Issue {
  id: number;
  title: string;
  description: string;
  type: IssueType;
  status: IssueStatus;
  reporter_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface ReporterInfo {
  id: number;
  name: string;
  role: UserRole;
}

export interface IssueWithReporter extends Omit<Issue, 'reporter_id'> {
  reporter: ReporterInfo;
}

export interface JwtPayload {
  id: number;
  name: string;
  role: UserRole;
}

export interface AuthRequest extends Request {
  user: JwtPayload;
}

export interface IssueFilters {
  sort?: 'newest' | 'oldest';
  type?: IssueType;
  status?: IssueStatus;
}
