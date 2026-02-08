import { Injectable } from '@nestjs/common';
import { OrgLoginDto, OrgRegistrationDto, OrgUpdateDto } from './dto/org.dto';

@Injectable()
export class OrgnizationService {
  async registerOrganization(dto: OrgRegistrationDto){

  }

  async validateOrganizationCredentials(dto: OrgLoginDto){

  }

  async getOrganizationById(id: number){

  }

  async updateOrganization(dto: OrgUpdateDto){

  }

  async updateOrgStatus(id: number, status: string){
    
  }
}
