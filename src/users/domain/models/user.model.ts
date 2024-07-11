import { QueueStatusEnum } from '../../../libs/types';

export type UseBalanceProps = {
  userId: string;
  amount: number;
};

export type QueueGetProps = {
  userId: string;
  eventId: number;
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
