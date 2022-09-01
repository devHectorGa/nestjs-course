export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
}

export type CreateTask = Pick<Task, 'title' | 'description'>;

export enum TaskStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}
