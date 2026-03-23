import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import {
  CreateBranchDTO,
  CreateOrganizationDTO,
  OnboardingStatusResponse,
} from './dto/onboarding.dto';
import { Role } from '@/common/decorator/role.decorator';
import { RoleGuard } from '@/common/guards/role.guard';
import { AuthGuard } from '@/common/guards/auth.guard';

@UseGuards(AuthGuard, RoleGuard)
@Controller('onboarding')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Role('platform_owner', 'org_owner')
  @Get('status')
  @HttpCode(HttpStatus.OK)
  getOnboardingStatus(@Req() req: Request): Promise<OnboardingStatusResponse> {
    const user = req['user'];
    return this.onboardingService.getStatus(user.userId);
  }

  @Role('platform_owner', 'org_owner')
  @Post('organization')
  @HttpCode(HttpStatus.CREATED)
  createOrganization(@Req() req: Request, @Body() dto: CreateOrganizationDTO) {
    const user = req['user'];
    return this.onboardingService.createOrganization(user.userId, dto);
  }

  @Role('platform_owner', 'org_owner')
  @Post('organization')
  @HttpCode(HttpStatus.CREATED)
  createFirstBranche(@Req() req: Request, @Body() dto: CreateBranchDTO) {
    const user = req['user'];
    return this.onboardingService.createFirstBranch(user.userId, user.orgId, dto);
  }
}
