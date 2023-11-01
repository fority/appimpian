export interface NotificationUserDto {
  Id: string;
  Name: string;
  Email: string;
}
export interface CreateNotificationUserRequest {
  Name: string;
  Email: string;
}
export interface UpdateNotificationUserRequest
  extends CreateNotificationUserRequest {
  Id: string;
}
