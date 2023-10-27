import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Observable, map, retry, shareReplay, tap } from 'rxjs';
import { LoadingService } from 'src/app/services/loading.service';
import { environment } from 'src/environments/environment.development';
import {
  BaseResponse,
  BaseResponseWithData,
  DefaultPage,
  DefaultPageSize,
  PagingContent,
  PagingSettings,
  httpOptions,
} from '../models/sharedModels';
import { GetArraySelection } from '../utils/helpers';

@Injectable({
  providedIn: 'root',
})
export class BaseSettingsService<T> {
  public url: string;
  public httpClient = inject(HttpClient);
  private messageService = inject(MessageService);
  private loadingService = inject(LoadingService);
  private pagingCache: PagingSettings = {
    page: 1,
    pageSize: 10,
    searchText: '',
  };

  constructor(@Inject('apiUrl') apiUrl: string) {
    this.url = apiUrl ?? '';
  }

  get ApiUrl() {
    return `${environment.apiBaseUrl}/${this.url}`;
  }

  Create = (data: Object): Observable<T> =>
    this.httpClient
      .post<BaseResponseWithData<T>>(`${this.ApiUrl}/Create`, data, httpOptions)
      .pipe(
        retry(1),
        tap(this.RespondShowMessage),
        map((resp) => resp.Data)
      );

  Update = (data: Object): Observable<T> =>
    this.httpClient
      .put<BaseResponseWithData<T>>(`${this.ApiUrl}/Update`, data, httpOptions)
      .pipe(
        retry(1),
        tap(this.RespondShowMessage),
        map((resp) => resp.Data)
      );

  Get = (
    page = DefaultPage,
    pageSize = DefaultPageSize,
    searchText = ''
  ): Observable<PagingContent<T>> => {
    const params = new HttpParams()
      .append('Page', page)
      .append('PageSize', pageSize)
      .append('SearchText', searchText);
    return this.httpClient
      .get<BaseResponseWithData<PagingContent<T>>>(`${this.ApiUrl}/Get`, {
        ...httpOptions,
        params,
      })
      .pipe(
        retry(1),
        tap(this.RespondShowMessage),
        map((resp) => resp.Data),
        tap(() => {
          this.pagingCache = {
            page: page,
            pageSize: pageSize,
            searchText: searchText,
          };
        })
      );
  };

  GetSamePage = () =>
    this.Get(
      this.pagingCache.page,
      this.pagingCache.pageSize,
      this.pagingCache.searchText
    );

  GetAdvancedFilter = (
    Page: number = DefaultPage,
    PageSize: number = DefaultPageSize,
    Filters: string = '',
    Sorts: string = ''
  ) => {
    let params = new HttpParams()
      .append('Page', Page)
      .append('PageSize', PageSize)
      .append('Filters', Filters)
      .append('Sorts', Sorts);
    return this.httpClient
      .get<BaseResponseWithData<PagingContent<T>>>(
        `${environment.apiBaseUrl}/${this.url}/AdvancedFilter`,
        {
          ...httpOptions,
          params,
        }
      )
      .pipe(
        retry(1),
        tap((resp) => this.RespondShowMessage(resp)),
        map((resp) => resp.Data)
      );
  };

  GetById = (data: string): Observable<T> => {
    let params = new HttpParams().append('Id', data);
    return this.httpClient
      .get<BaseResponseWithData<T>>(`${this.ApiUrl}/GetById`, {
        ...httpOptions,
        params,
      })
      .pipe(
        retry(1),
        tap(this.RespondShowMessage),
        map((resp) => resp.Data)
      );
  };

  Delete = (data: string) => {
    let params = new HttpParams().append('Id', data);
    return this.httpClient
      .delete<BaseResponse>(`${this.ApiUrl}/Delete`, { ...httpOptions, params })
      .pipe(tap(this.RespondShowMessage));
  };

  AutoCompleteList = (): Observable<string[]> =>
    this.httpClient
      .get<string[]>(`${this.ApiUrl}/AutoCompleteList`, httpOptions)
      .pipe(
        map((resp) => resp || []),
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

  public GetSelectOption = <K>(label: keyof T, value: keyof T) =>
    this.httpClient
      .get<BaseResponseWithData<PagingContent<T>>>(
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
}
