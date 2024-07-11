import { QueueStatusEnum } from '../../../libs/types';

export type QueuePostProps = {
  userId: string;
  eventId: number;
  status: QueueStatusEnum.STANDBY;
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
