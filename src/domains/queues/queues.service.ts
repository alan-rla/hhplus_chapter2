import { HttpException, Injectable } from '@nestjs/common';
import { QueueTimeLeft } from '@src/domains/queues/queues.model';
import { QueuesRepository } from '@src/domains/repositories';

import dayjs from 'dayjs';

@Injectable()
export class QueuesService {
  constructor(private readonly queuesRepository: QueuesRepository) {}

  private waitingQueueKey = 'WAITING_QUEUE';
  private activeTokenKey = 'ACTIVE_TOKEN';

  async joinWaitingQueue(userId: string): Promise<boolean> {
    const save = await this.queuesRepository.saveSortedSet(this.waitingQueueKey, userId);
    if (save === 0) throw new HttpException('USER_ALREADY_IN_QUEUE', 500);
    return save === 1;
  }

  // userId의 점수 (Date.now()) 없으면 null
  async getUserInWaitingQueue(userId: string): Promise<string> {
    return await this.queuesRepository.getSortedSetByKeyAndUserId(this.waitingQueueKey, userId);
  }

  // userId의 점수 (Date.now()) 없으면 null
  async getTimeLeftInWaitingQueue(userId: string): Promise<QueueTimeLeft> {
    const rank = await this.queuesRepository.getSortedSetDateAscRank(this.waitingQueueKey, userId);
    return { minutesLeft: Math.ceil(rank / 100) };
  }

  async getUsersInWaitingQueue(amount: number): Promise<string[]> {
    return await this.queuesRepository.getSortedSetDateAsc(this.waitingQueueKey, amount);
  }

  async removeUsersInWaitingQueue(userIds: string[]): Promise<void> {
    await this.queuesRepository.removeSortedSet(this.waitingQueueKey, userIds);
  }

  async joinActiveToken(userIds: string[]): Promise<void> {
    const members = [];
    for (const userId of userIds) members.push(`USER#${userId}:DATE#${new Date().toISOString()}`);
    await this.queuesRepository.saveSet(this.activeTokenKey, members);
  }

  async getAllUsersInActiveToken(): Promise<string[]> {
    return await this.queuesRepository.getAllMembersInSet(this.activeTokenKey);
  }

  async getUserInActiveToken(userId: string): Promise<string> {
    const pattern = `USER#${userId}:*`;
    return await this.queuesRepository.scanSet(this.activeTokenKey, pattern, 1)[0];
  }

  async removeUsersInActiveToken(members: string[]): Promise<void> {
    await this.queuesRepository.removeMembersInSet(this.activeTokenKey, members);
  }

  async tokenActivateManager(): Promise<void> {
    const userIds = await this.getUsersInWaitingQueue(100);
    await this.joinActiveToken(userIds);
    await this.removeUsersInWaitingQueue(userIds);
  }

  async tokenExpireManager(): Promise<void> {
    const members = await this.getAllUsersInActiveToken();
    const membersToBeExpired = [];
    const twentyMinutesAgo = dayjs().subtract(20, 'minute');
    for (const member of members) {
      const createdAt = member.split('DATE#')[1];
      if (twentyMinutesAgo.isAfter(createdAt)) membersToBeExpired.push(member);
    }
    await this.removeUsersInActiveToken(membersToBeExpired);
  }
}
