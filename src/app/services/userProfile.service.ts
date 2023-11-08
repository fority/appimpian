import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Observable, map, retry, shareReplay, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { BaseResponse, DefaultPage, DefaultPageSize, PagingContent, httpOptions } from '../core/models/sharedModels';
import { FxtIdServerUserDto } from '../models/fxtIdServerUserModels';
import { UpdateUserProfileRequest, UserProfileDto } from '../modules/settings/models/userProfileModels';
import { BaseResponseWithData } from './../shared/models/data-response';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  public httpClient = inject(HttpClient);
  private messageService = inject(MessageService);
  private loadingService = inject(LoadingService);

  url = 'api/UserProfile';

  get ApiUrl() {
    return `${environment.apiBaseUrl}/${this.url}`;
  }

  Get(
    Page: number = DefaultPage,
    PageSize: number = DefaultPageSize,
    SearchText: string = ''
  ): Observable<PagingContent<UserProfileDto>> {
    let params = new HttpParams().append('Page', Page).append('PageSize', PageSize).append('SearchText', SearchText);
    return this.httpClient
      .get<BaseResponseWithData<PagingContent<UserProfileDto>>>(`${this.ApiUrl}/Get`, { ...httpOptions, params })
      .pipe(
        retry(1),
        tap(this.RespondShowMessage),
        map((resp) => resp.Data),
        shareReplay(1)
      );
  }

  AdvancedFilter(
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
      .get<BaseResponseWithData<PagingContent<UserProfileDto>>>(`${this.ApiUrl}/AdvancedFilter`, {
        ...httpOptions,
        params,
      })
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
    return this.httpClient.put<BaseResponseWithData<UserProfileDto>>(`${this.ApiUrl}/Update`, data, httpOptions).pipe(
      retry(1),
      tap(this.RespondShowMessage),
      map((resp) => resp.Data)
    );
  }

  Disable(id: string): Observable<BaseResponse> {
    let params = new HttpParams().append('Id', id);
    return this.httpClient
      .post<BaseResponse>(`${this.ApiUrl}/Disable`, null, { ...httpOptions, params })
      .pipe(tap((resp) => this.RespondShowMessage(resp)));
  }

  Enable(Id: string): Observable<BaseResponse> {
    let params = new HttpParams().append('Id', Id);
    return this.httpClient
      .post<BaseResponse>(`${this.ApiUrl}/Enable`, null, { ...httpOptions, params })
      .pipe(tap((resp) => this.RespondShowMessage(resp)));
  }

  FxtGetUser(): Observable<PagingContent<FxtIdServerUserDto>> {
    return this.httpClient
      .get<BaseResponseWithData<PagingContent<FxtIdServerUserDto>>>(`${this.ApiUrl}/FxtGetUser`, httpOptions)
      .pipe(
        tap((resp) => this.RespondShowMessage(resp)),
        map((x) => x.Data || [])
      );
  }

  FxtImportUser(id: string): Observable<BaseResponse> {
    let params = new HttpParams().append('Id', id);
    return this.httpClient
      .post<BaseResponse>(`${this.ApiUrl}/FxtImportUser`, null, { ...httpOptions, params })
      .pipe(tap((resp) => this.RespondShowMessage(resp)));
  }

  RespondShowMessage(respond: { Success: boolean; Message: string } | any) {
    if (!respond?.Success) {
      this.messageService.add({ severity: 'error', summary: 'Apps', detail: respond.Message });
      this.loadingService.stop();
      throw new Error('App return unsuccessfully');
    }
  }

  SetModelId(text: string) {
    localStorage.setItem('modelId', text);
  }

  GetModelId() {
    const x = localStorage.getItem('modelId');
    return x || undefined;
  }
}
