import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class EventsRepositoryImpl {
  constructor(private entityManager: EntityManager) {}

  getManager(): EntityManager {
    return this.entityManager;
  }
}
