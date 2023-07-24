export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum TaskType {
  DRAFT = 'DRAFT',
  SCHEDULE = 'SCHEDULE',
  IMMEDIATE = 'IMMEDIATE',
}

export enum TaskActivityType {
  CREATE = 'CREATE',
  EDIT = 'EDIT',
  DELETE = 'DELETE',

  RELEASE = 'RELEASE',

  MARK_DONE = 'MARK_DONE',
  MARK_CANCEL = 'MARK_CANCEL',
  SET_FLAG = 'SET_FLAG',

  COMMENT = 'COMMENT',
  REACTION = 'REACTION',

  READ = 'READ',
}

export enum TaskStatusType {
  OVERDUE = 'OVERDUE',
  INDUE = 'INDUE',
  DONE = 'DONE',
  CANCEL = 'CANCEL',

  DRAFT = 'DRAFT',
  SCHEDULE = 'SCHEDULE',
}

export enum TaskMarkType {
  DONE = 'DONE',
  CANCEL = 'CANCEL',
}

export type typeRoute = 'oneToOne' | 'channel' | 'draft';
export type typeChannel = 'task' | 'chat' | 'wiki';
