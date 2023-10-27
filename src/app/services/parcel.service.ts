import { Injectable } from '@angular/core';
import { BaseSettingsService } from 'src/app/core/services/base-settings.service';
import { ParcelNumber } from '../modules/settings/models/parcel-no';

@Injectable({
  providedIn: 'root',
})
export class ParcelService extends BaseSettingsService<ParcelNumber> {
  constructor() {
    super('api/ParcelNumber');
  }
}
