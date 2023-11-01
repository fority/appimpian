import { UserType } from 'src/app/shared/enum/enum';
import { RegionDto } from './region';

export interface UserProfileDto {
  Id: string;
  Username: string;
  Name: string;
  PhoneNumber: string;
  Email: string;
  Address: string;
  RegionId: string;
  Region: RegionDto;
  UserType: UserType;
  IsDisable: boolean;
  AllPermission: boolean;
  UserGroupId: string;
  CustomerGroupId: string;
  ProductPermissionGroupId: string;
}

export interface CreateUserProfileRequest {
  Username: string;
  Name: string;
  PhoneNumber: string;
  Email: string;
  Address: string;
  RegionId: string;
  UserType: UserType;
  AllPermission: boolean;
  UserGroupId: string;
  CustomerGroupId: string;
}

export interface UpdateUserProfileRequest {
  Id: string;
  Name: string;
  PhoneNumber: string;
  Email: string;
  Address: string;
  RegionId: string;
  IsDisable?: boolean;
}

export interface UpdateUserProfileAdminRequest {
  Id: string;
  Name: string;
  PhoneNumber: string;
  Email: string;
  Address: string;
  RegionId: string;
  UserType: UserType;
  IsDisable: boolean;
  AllPermission: boolean;
  UserGroupId: string;
  CustomerGroupId: string;
}

export interface ChangePasswordRequest {
  Id: string;
  Password: string;
  ConfirmPassword: string;
}
export interface FxtIdServerUserDto {
  Id: string;
  UserName: string | null;
  Email: string | null;
  EmailConfirmed: boolean;
  PhoneNumber: string | null;
  PhoneNumberConfirmed: boolean;
  TwoFactorEnabled: boolean;
  LockoutEnd: Date | string | null;
  LockoutEnabled: boolean;
  AccessFailedCount: number;
  FirstName: string;
  LastName: string;
  DisplayName: string;
  Department: string | null;
  StaffId: string | null;
  Remark: string | null;
  Disable: boolean;
  Confirm: boolean;
  Photo: string | null;
}
