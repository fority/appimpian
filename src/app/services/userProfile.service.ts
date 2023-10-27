import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import {
  BaseResponseWithData,
  PagingContent,
  httpOptions,
} from '../core/models/sharedModels';
import { BaseSettingsService } from '../core/services/base-settings.service';
import { UserProfile } from '../modules/settings/models/userProfile';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService extends BaseSettingsService<UserProfile> {
  constructor() {
    super('api/UserProfile');
  }

  public GetIdsUser = () =>
    this.httpClient
      .get<
        BaseResponseWithData<PagingContent<{ Id: string; Username: string }>>
      >(`${environment.apiBaseUrl}/${this.url}/GetIdsUser`, httpOptions)
      .pipe(
        tap((resp) => this.RespondShowMessage(resp)),
        map((x) => x.Data.Content || [])
      );

  public ImportUser = (id: string) => {
    let params = new HttpParams().append('Id', id);
    return this.httpClient
      .post<string[]>(`${environment.apiBaseUrl}/${this.url}/ImportUser`, {
        ...httpOptions,
        params,
      })
      .pipe(tap((resp) => this.RespondShowMessage(resp)));
  };

  public Enable = (id: string) => {
    let params = new HttpParams().append('Id', id);
    return this.httpClient
      .post<string[]>(`${environment.apiBaseUrl}/${this.url}/Enable`, {
        ...httpOptions,
        params,
      })
      .pipe(tap((resp) => this.RespondShowMessage(resp)));
  };

  public Disable = (id: string) => {
    let params = new HttpParams().append('Id', id);
    return this.httpClient
      .post<string[]>(`${environment.apiBaseUrl}/${this.url}/Disable`, {
        ...httpOptions,
        params,
      })
      .pipe(tap((resp) => this.RespondShowMessage(resp)));
  };
}
