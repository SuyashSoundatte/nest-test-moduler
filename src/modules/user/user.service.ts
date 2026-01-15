import { Injectable, Logger } from '@nestjs/common';
import { PostgresService } from '../../common/providers/database/postgres.service';
import { User } from './entity/user.entity';
import { UserNotFoundException } from './error/user.errors';

interface IUserRepository {
  createUser(user: User): Promise<void>;
  updateUser(user: User): Promise<boolean>;
  deleteUser(userId: number): Promise<boolean>;
  getAllUsers(): Promise<User[]>;
  getUserById(userId: number): Promise<User | null>;
}

@Injectable()
export class UserService implements IUserRepository {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly pool: PostgresService) {}

  async createUser(user: User): Promise<void> {
    this.logger.log(`Creating user: ${user.name}`);

    await this.pool.query(
        'insert into Users(name, isActive) values($1, $2)',
        [user.name, user.isActive],
      );

    this.logger.log(`User created successfully: ${user.name}`);
  }

  async updateUser(user: User): Promise<boolean> {
    this.logger.log(`Updating user id=${user.id}`);

    const result = await this.pool.query(
      'update Users set name = $1 where id = $2',
      [user.name, user.id],
    );

    if ((result.rowCount ?? 0) === 0) {
      this.logger.warn(`User not found for update: id=${user.id}`);
      return false;
    }

    this.logger.log(`User updated: id=${user.id}`);
    return true;
  }

  async deleteUser(userId: number): Promise<boolean> {
    this.logger.log(`Deleting user id=${userId}`);

    const result = await this.pool.query(
      'delete from Users where id = $1',
      [userId],
    );

    if ((result.rowCount ?? 0) === 0) {
      this.logger.warn(`User not found for delete: id=${userId}`);
      return false;
    }

    this.logger.log(`User deleted: id=${userId}`);
    return true;
  }

  async getAllUsers(): Promise<User[]> {
    this.logger.log('Fetching all users');

    const results = await this.pool.query<User>(
      'select id, name, isActive from Users',
    );

    this.logger.log(`Fetched ${results.rows.length} users`);
    return results.rows;
  }

  async getUserById(userId: number): Promise<User | null> {
    this.logger.log(`Fetching user by id=${userId}`);

    const result = await this.pool.query<User>(
      'select id, name, isActive from Users where id = $1',
      [userId],
    );

    if (!result.rows[0]) {
      throw new UserNotFoundException(userId);
    }

    return result.rows[0];
  }
}
