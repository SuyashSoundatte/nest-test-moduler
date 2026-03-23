import { IsEmail, IsString, MinLength, Matches, IsPhoneNumber } from 'class-validator';

export class CreateOrgOwnerDTO {
  @IsString()
  name!: string;

  @IsString()
  @Matches(/^[a-zA-Z0-9_.-]+$/, {
    message: 'username can only contain letters, numbers, underscores, dots, and hyphens',
  })
  username!: string;

  @IsEmail()
  email!: string;

  @IsPhoneNumber()
  phone!: string;

  @IsString()
  @MinLength(8, { message: 'password must be at least 8 characters' })
  password!: string;
}

export class OrgOwnerResponseDTO {
  id!: number;
  name!: string;
  username!: string;
  email!: string;
  phone!: string;
  role!: string;
  org_id!: null;
  branch_id!: null;
}
