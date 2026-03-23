import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { OrgLoginDto, OrgRegistrationDto, OrgUpdateDto } from './dto/org.dto';
import { OrganizationService } from './orgnization.service';

@Controller('oragnizations')
export class OragnizationController {
  constructor(private readonly orgService: OrganizationService) {}

  @Get('me')
  @HttpCode(HttpStatus.OK)
  getMyOrganization(@Req() req: Request) {
    const user = req['user'];
    return this.orgService.getMyOrganization(user.orgId, user.branchId);
  }
}
