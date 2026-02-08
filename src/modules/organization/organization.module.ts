import { Module } from '@nestjs/common';
import { OrgnizationService } from './orgnization.service';

@Module({
  providers: [OrgnizationService]
})
export class OrganizationModule {}
