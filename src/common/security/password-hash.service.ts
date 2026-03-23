import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class PasswordHashService {
  private readonly options: argon2.Options & { raw?: false } = {
    type: argon2.argon2id,
    memoryCost: 2 ** 18,
    timeCost: 4,
    hashLength: 64,
    parallelism: 2,
  };

  async hash(password: string): Promise<string> {
    return argon2.hash(password, this.options);
  }

  async verify(hashedPass: string, plainPass: string): Promise<boolean> {
    return argon2.verify(hashedPass, plainPass);
  }
}

// async function f(){
//   const obj = new PasswordHashService();
//   const result = await obj.hash("P@ss1234");
//   console.log(result);
// }
// f();
