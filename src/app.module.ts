import { Module } from '@nestjs/common';
import { ModulesModule } from './modules/modules.module';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { DatabaseModule } from './common/providers/database/database.module';
import { LoggerModule } from 'nestjs-pino';
import { LoggerConfig } from './common/logger/logger-config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRoot(LoggerConfig),
    ModulesModule,
    CommonModule,
    DatabaseModule,
  ],
})
export class AppModule {}
