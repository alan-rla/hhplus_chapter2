import { QueueStatusEnum } from '../../../libs/types';

export type QueueRequestProps = {
  userId?: string;
  eventId: number;
  status?: QueueStatusEnum;
};

export type QueueResponseProps = {
  id: number;
  userId: string;
  eventId: number;
  status: QueueStatusEnum;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
};

export class Queue {
  id: number;
  userId: string;
  eventId: number;
  status: QueueStatusEnum;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
