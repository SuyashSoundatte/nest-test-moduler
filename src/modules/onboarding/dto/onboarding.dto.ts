import {
  IsDateString,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  MinLength,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

export interface OnboardingStatus {
  has_org: boolean;
  has_branch: boolean;
  org_id: number | null;
  branch_id: number | null;
  can_access_dashboard: boolean;
  next_step: 'create_organization' | 'create_first_branch' | 'go_to_dashboard';
}

export interface OnboardingStatusResponse {
  message: string;
  data: OnboardingStatus;
}

export class CreateOrganizationDTO {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: 'code can only contain letters, numbers, underscores, and hyphens',
  })
  code!: string;
}

@ValidatorConstraint({ name: 'isAfterStart', async: false })
class IsAcademicYearValid implements ValidatorConstraintInterface {
  validate(end: string, args: ValidationArguments) {
    const obj = args.object as CreateBranchDTO;
    if (!obj.academic_year_start || !end) return true;
    return new Date(end) > new Date(obj.academic_year_start);
  }
  defaultMessage() {
    return 'academic_year_end must be after academic_year_start';
  }
}

export class CreateBranchDTO {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: 'code can only contain letters, numbers, underscores, and hyphens',
  })
  code!: string;

  @IsString()
  city!: string;

  @IsString()
  address1!: string;

  @IsDateString()
  academic_year_start!: string;

  @IsDateString()
  @Validate(IsAcademicYearValid)
  academic_year_end!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsPhoneNumber()
  contact_phone?: string;

  @IsOptional()
  @IsString()
  address2?: string;
}
