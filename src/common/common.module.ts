import { Module } from '@nestjs/common';
import { DatabaseModule } from './providers/database/database.module';
import { ProcessErrorHandler } from './process/process-error.handler';

@Module({
  imports: [DatabaseModule],
  providers: [ProcessErrorHandler],
  exports: [ProcessErrorHandler]
})
export class CommonModule {}
