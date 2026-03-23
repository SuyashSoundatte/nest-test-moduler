import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { CreateOrgOwnerDTO } from './dto/platform.dto';
import { AuthGuard } from '@/common/guards/auth.guard';
import { RoleGuard } from '@/common/guards/role.guard';
import { Role } from '@/common/decorator/role.decorator';
import { PlatformService } from './platform.service';

@Controller('platform')
export class PlatformController {
  constructor(private readonly platformService: PlatformService) {}

  @UseGuards(AuthGuard, RoleGuard) // AuthGuard must run first to populate request.user
  @Role('platform_owner')
  @Post('org-owners')
  @HttpCode(HttpStatus.CREATED)
  onboardOrgOwners(@Body() orgOwnerDto: CreateOrgOwnerDTO) {
    return this.platformService.create(orgOwnerDto);
  }
}
