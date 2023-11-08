import { UserType } from 'src/app/shared/enum/enum';
import { RegionDto } from './regionModels';

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
