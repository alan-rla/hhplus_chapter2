import { plainToInstance } from 'class-transformer';

export class Mapper {
  static classTransformer<T>(outputClass: new () => T, obj: object): T {
    if (!obj) return;
    else return plainToInstance(outputClass, obj, { enableImplicitConversion: true });
  }
}
