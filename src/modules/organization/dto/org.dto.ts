export class OrgRegistrationDto {
  name!: string;
  code!: string;
  email!: string;
  contactNumber!: number;
  city!: string;
  address1!: string;
  address2!: string;
  academicYearFrom!: Date;
  academicYearTo!: Date;
}

export class OrgLoginDto {
  email!: string;
  password!: string;
}

export class OrgUpdateDto {
  id!: number;
  ownerId!: number;

  name?: string;
  code?: string;
  email?: string;
  contactNumber?: number;
  city?: string;
  address1?: string;
  address2?: string;
  academicYearFrom?: Date;
  academicYearTo?: Date;
}

// org.dto.ts
export interface BranchData {
  id: number;
  name: string;
  code: string;
  city: string;
  is_active: boolean;
}

export interface OrganizationMeResponse {
  message: string;
  data: {
    organization: {
      id: number;
      name: string;
      code: string;
      is_active: boolean;
    };
    branch: BranchData | null;
  };
}
