import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { OrganizationModule } from './organization/organization.module';
import { OragnizationController } from './organization/oragnization.controller';
import { OrgnizationService } from './organization/orgnization.service';

@Module({
  imports: [UserModule, AuthModule, OrganizationModule],
  controllers: [OragnizationController],
  providers: [OrgnizationService],
})
export class ModulesModule {}
