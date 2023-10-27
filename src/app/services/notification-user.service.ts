import { Injectable } from '@angular/core';
import { BaseSettingsService } from '../core/services/base-settings.service';
import { NotificationUser } from '../modules/settings/models/notif-user';

@Injectable({
  providedIn: 'root',
})
export class NotificationUserService extends BaseSettingsService<NotificationUser> {
  constructor() {
    super('api/NotificationUser');
  }
}
