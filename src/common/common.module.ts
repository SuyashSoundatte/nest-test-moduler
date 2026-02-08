import { Module } from '@nestjs/common';
import { DatabaseModule } from './providers/database/database.module';
import { ProcessErrorHandler } from './process/process-error.handler';
import { PasswordHashService } from './security/password-hash.service';
import { SecurityModule } from './security/security.module';

@Module({
  imports: [DatabaseModule, SecurityModule],
  providers: [ProcessErrorHandler, PasswordHashService],
  exports: [ProcessErrorHandler]
})
export class CommonModule {}
