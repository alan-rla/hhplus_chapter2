import { Injectable } from '@nestjs/common';
import { EventsRepository } from '../../domain/repositories/events.repository';
import { EntityManager } from 'typeorm';
import { EventEntity } from '../entities';

@Injectable()
export class EventsRepositoryImpl implements EventsRepository {
  constructor(private entityManager: EntityManager) {}

  getManager(): EntityManager {
    return this.entityManager;
  }

  async getAllEvents(): Promise<EventEntity[]> {
    const events = await this.getManager().getRepository(EventEntity).find();
    return events;
  }
}
