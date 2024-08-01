export abstract class QueuesRepository {
  abstract getSortedSetCount(key: string): Promise<number>;

  abstract getSortedSetDateAsc(key: string, limit?: number): Promise<string[]>;

  abstract getSortedSetDateAscRank(key: string, userId: string): Promise<number>;

  abstract getSortedSetByKeyAndUserId(key: string, userId: string): Promise<string>;

  abstract saveSortedSet(key: string, userId: string): Promise<number>;

  abstract removeSortedSet(key: string, userIds: string[]): Promise<void>;

  abstract saveSet(key: string, members: string[]): Promise<void>;

  abstract getAllMembersInSet(key: string): Promise<string[]>;

  abstract scanSet(key: string, pattern: string, count: number): Promise<string[]>;

  abstract removeMembersInSet(key: string, members: string[]): Promise<void>;
}
