import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export async function createResponse<T>(responseClass: new () => T, data: object): Promise<T> {
  const entity: any = plainToInstance(responseClass, data, { excludeExtraneousValues: true, exposeUnsetFields: false });
  const [error] = await validate(entity);
  if (error) throw error;
  return entity;
}
