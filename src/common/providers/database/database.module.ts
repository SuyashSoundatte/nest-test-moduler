import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PostgresDataSource } from './database';

@Module({
  imports: [ConfigModule],
  providers: [PostgresDataSource],
  exports: [PostgresDataSource],
})
export class DatabaseModule {}
