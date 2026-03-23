import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { OrganizationModule } from './organization/organization.module';
import { OragnizationController } from './organization/oragnization.controller';
import { PlatformModule } from './platform/platform.module';
import { OnboardingModule } from './onboarding/onboarding.module';

@Module({
  imports: [UserModule, AuthModule, OrganizationModule, PlatformModule, OnboardingModule],
  controllers: [OragnizationController],
  providers: [],
})
export class ModulesModule {}
