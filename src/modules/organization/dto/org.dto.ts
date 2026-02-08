export class OrgRegistrationDto {
  name!: string;
  code!:string
  email!: string
  contactNumber!: number
  city!: string
  address1!: string
  address2!: string
  academicYearFrom!: Date
  academicYearTo!: Date
}

export class OrgLoginDto {
  email!: string;
  password!: string;
}

export class OrgUpdateDto{
  id!: number;
  ownerId!: number;
  
  name?: string;
  code?:string
  email?: string
  contactNumber?: number
  city?: string
  address1?: string
  address2?: string
  academicYearFrom?: Date
  academicYearTo?: Date
}