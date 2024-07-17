import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export class Mapper {
  static async classTransformer<T>(outputClass: new () => T, obj: object): Promise<T> {
    if (!obj) return;
    else {
      const output: any = plainToInstance(outputClass, obj);
      const [error] = await validate(output, { skipMissingProperties: true });
      if (error) throw error;
      else return output;
    }
  }
}
