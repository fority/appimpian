import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Observable, Subject, map, retry, shareReplay, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import {
  BaseResponse,
  DefaultPage,
  DefaultPageSize,
  PagingContent,
  httpOptions,
} from '../core/models/sharedModels';
import { GetArraySelection } from '../core/utils/helpers';
import {
  UpdateUserProfileRequest,
  UserProfileDto,
} from '../modules/settings/models/userProfile';
import { BaseResponseWithData } from './../shared/models/data-response';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  public httpClient = inject(HttpClient);
  private messageService = inject(MessageService);
  private loadingService = inject(LoadingService);
  private enableDisableSubject = new Subject<{ id: string; enable: boolean }>();

  url = 'api/UserProfile';

  get ApiUrl() {
    return `${environment.apiBaseUrl}/${this.url}`;
  }

  Get(
    Page: number = DefaultPage,
    PageSize: number = DefaultPageSize,
    SearchText: string = ''
  ): Observable<PagingContent<UserProfileDto>> {
    let params = new HttpParams()
      .append('Page', Page)
      .append('PageSize', PageSize)
      .append('SearchText', SearchText);
    return this.httpClient
      .get<BaseResponseWithData<PagingContent<UserProfileDto>>>(
        `${this.ApiUrl}/Get`,
        { ...httpOptions, params }
      )
      .pipe(
        retry(1),
        tap(this.RespondShowMessage),
        map((resp) => resp.Data),
        shareReplay(1)
      );
  }

  GetAdvancedFilter(
    Page: number = DefaultPage,
    PageSize: number = DefaultPageSize,
    Filters: string = '',
    Sorts: string = ''
  ): Observable<PagingContent<UserProfileDto>> {
    let params = new HttpParams()
      .append('Page', Page)
      .append('PageSize', PageSize)
      .append('Filters', Filters)
      .append('Sorts', Sorts);
    return this.httpClient
      .get<BaseResponseWithData<PagingContent<UserProfileDto>>>(
        `${this.ApiUrl}/AdvancedFilter`,
        {
          ...httpOptions,
          params,
        }
      )
      .pipe(
        retry(1),
        tap(this.RespondShowMessage),
        map((resp) => resp.Data),
        shareReplay(1)
      );
  }

  GetById(data: string): Observable<UserProfileDto> {
    let params = new HttpParams().append('Id', data);
    return this.httpClient
      .get<BaseResponseWithData<UserProfileDto>>(`${this.ApiUrl}/GetById`, {
        ...httpOptions,
        params,
      })
      .pipe(
        retry(1),
        tap(this.RespondShowMessage),
        map((resp) => resp.Data)
      );
  }

  Update(data: UpdateUserProfileRequest): Observable<UserProfileDto> {
    return this.httpClient
      .put<BaseResponseWithData<UserProfileDto>>(
        `${this.ApiUrl}/Update`,
        data,
        httpOptions
      )
      .pipe(
        retry(1),
        tap(this.RespondShowMessage),
        map((resp) => resp.Data)
      );
  }

  Disable(id: string): Observable<BaseResponse> {
    let params = new HttpParams().append('Id', id);
    return this.httpClient
      .post<BaseResponse>(`${this.ApiUrl}/Disable`, {
        ...httpOptions,
        params,
      })
      .pipe(tap((resp) => this.RespondShowMessage(resp)));
  }

  Enable(Id: string): Observable<BaseResponse> {
    let params = new HttpParams().append('Id', Id);
    return this.httpClient
      .post<BaseResponse>(`${this.ApiUrl}/Enable`, {
        ...httpOptions,
        params,
      })
      .pipe(tap((resp) => this.RespondShowMessage(resp)));
  }

  FxtGetUser() {
    this.httpClient
      .get<
        BaseResponseWithData<PagingContent<{ Id: string; Username: string }>>
      >(`${this.ApiUrl}/FxtGetUser`, httpOptions)
      .pipe(
        tap((resp) => this.RespondShowMessage(resp)),
        map((x) => x.Data.Content || [])
      );
  }

  FxtImportUser = (id: string) => {
    let params = new HttpParams().append('Id', id);
    return this.httpClient
      .post<string[]>(`${this.ApiUrl}/FxtImportUser`, {
        ...httpOptions,
        params,
      })
      .pipe(tap((resp) => this.RespondShowMessage(resp)));
  };

  AutoCompleteList = (): Observable<string[]> =>
    this.httpClient
      .get<string[]>(`${this.ApiUrl}/AutoCompleteList`, httpOptions)
      .pipe(
        map((resp) => resp || []),
        shareReplay(1)
      );

  GetSelectOption = <K>(
    label: keyof UserProfileDto,
    value: keyof UserProfileDto
  ) =>
    this.httpClient
      .get<BaseResponseWithData<PagingContent<UserProfileDto>>>(
        `${environment.apiBaseUrl}/${this.url}/Get`,
        httpOptions
      )
      .pipe(
        tap((res) => this.RespondShowMessage(res)),
        map((res) =>
          GetArraySelection<K>(res?.Data?.Content ?? [], [
            label as string,
            value as string,
          ])
        ),
        shareReplay(1)
      );

  RespondShowMessage = (
    respond: { Success: boolean; Message: string } | any
  ) => {
    if (!respond?.Success) {
      this.messageService.add({
        severity: 'error',
        summary: 'Apps',
        detail: respond.Message,
      });
      this.loadingService.stop();
      throw new Error('App return unsuccessfully');
    }
  };
}
