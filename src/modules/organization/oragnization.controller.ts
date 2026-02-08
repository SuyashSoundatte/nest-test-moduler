import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { OrgLoginDto, OrgRegistrationDto, OrgUpdateDto } from './dto/org.dto';
import { OrgnizationService } from './orgnization.service';

@Controller('oragnizations')
export class OragnizationController {
  constructor(private readonly orgService: OrgnizationService) {}

  @Post('register')
  async register(@Body() registerDto: OrgRegistrationDto) {
    return this.orgService.registerOrganization(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: OrgLoginDto) {
    return this.orgService.validateOrganizationCredentials(loginDto);
  }

  @Get('me')
  async getMyOrg() {
    /**
     * extract the org_id and branch_id from token
     * fetch the all org data from db
     * send that as response payload
     * */
    const id = 1;
    return this.orgService.getOrganizationById(id);
  }

  @Patch()
  async updateOrg(@Body() updateDto: OrgUpdateDto) {
    return this.orgService.updateOrganization(updateDto);
  }

  @Post(':orgId/status')
  async updateStatus(@Body() status: string, @Param('orgId') id: number) {
    return this.orgService.updateOrgStatus(id, status);
  }
}
