import { Task } from '@prisma/client';

export enum BreakPoint {
  SM,
  MD,
  LG,
  XL,
  XXL,
}

export interface StatusType {
  id: string;
  color: string;
  title: string;
}

export type PopulatedStatusType = StatusType & { tasks: Task[] };

export enum ToastType {
  ERROR,
  WARNING,
  SUCCESS,
}

export interface AuthInput {
  name: string;
  email: string;
  expertise: string;
  role: string;
}

export interface ProjectInput {
  title: string;
  description: string;
}

export interface TaskInput {
  title: string;
  description: string;
  status: StatusType;
  assigneeId: string;
}
