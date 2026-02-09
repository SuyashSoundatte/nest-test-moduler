import { Module } from '@nestjs/common';
import { DatabaseModule } from './providers/database/database.module';
import { ProcessErrorHandler } from './process/process-error.handler';
import { SecurityService } from './security/password-hash.service';
import { PasswordHashModuleTsModule } from './security/password-hash.module.ts.module';

@Module({
  imports: [DatabaseModule, PasswordHashModuleTsModule],
  providers: [ProcessErrorHandler, SecurityService],
  exports: [ProcessErrorHandler]
})
export class CommonModule {}
