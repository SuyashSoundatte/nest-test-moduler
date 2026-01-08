import { Injectable } from '@nestjs/common';
import { PostgresService } from '../../common/providers/database/postgres.service';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly pool: PostgresService) {}

  async createUser(user: User) {
    await this.pool.query('insert into Users(name, isActive) values($1, $2)', [
      user.name,
      user.isActive,
    ]);
  }
}
