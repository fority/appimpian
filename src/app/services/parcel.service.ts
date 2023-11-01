import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Observable, map, retry, shareReplay, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import {
  BaseResponse,
  BaseResponseWithData,
  DefaultPage,
  DefaultPageSize,
  PagingContent,
  httpOptions,
} from '../core/models/sharedModels';
import {
  CreateParcelRequest,
  ParcelNumberDto,
  UpdateParcelRequest,
} from '../modules/settings/models/parcel-no';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root',
})
export class ParcelService {
  public httpClient = inject(HttpClient);
  private messageService = inject(MessageService);
  private loadingService = inject(LoadingService);

  url = 'api/ParcelNumber';

  get ApiUrl() {
    return `${environment.apiBaseUrl}/${this.url}`;
  }

  Create(data: CreateParcelRequest): Observable<ParcelNumberDto> {
    return this.httpClient
      .post<BaseResponseWithData<ParcelNumberDto>>(
        `${this.ApiUrl}/Create`,
        data,
        httpOptions
      )
      .pipe(
        retry(1),
        tap(this.RespondShowMessage),
        map((resp) => resp.Data)
      );
  }

  Get(
    Page: number = DefaultPage,
    PageSize: number = DefaultPageSize,
    SearchText: string = ''
  ): Observable<PagingContent<ParcelNumberDto>> {
    let params = new HttpParams()
      .append('Page', Page)
      .append('PageSize', PageSize)
      .append('SearchText', SearchText);
    return this.httpClient
      .get<BaseResponseWithData<PagingContent<ParcelNumberDto>>>(
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
  ): Observable<PagingContent<ParcelNumberDto>> {
    let params = new HttpParams()
      .append('Page', Page)
      .append('PageSize', PageSize)
      .append('Filters', Filters)
      .append('Sorts', Sorts);
    return this.httpClient
      .get<BaseResponseWithData<PagingContent<ParcelNumberDto>>>(
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

  GetById(data: string): Observable<ParcelNumberDto> {
    let params = new HttpParams().append('Id', data);
    return this.httpClient
      .get<BaseResponseWithData<ParcelNumberDto>>(`${this.ApiUrl}/GetById`, {
        ...httpOptions,
        params,
      })
      .pipe(
        retry(1),
        tap(this.RespondShowMessage),
        map((resp) => resp.Data)
      );
  }

  Update(data: UpdateParcelRequest): Observable<ParcelNumberDto> {
    return this.httpClient
      .put<BaseResponseWithData<ParcelNumberDto>>(
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
}
