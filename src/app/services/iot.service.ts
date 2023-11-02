import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Observable, map, retry, shareReplay, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import {
  BaseResponseWithData,
  DefaultPage,
  DefaultPageSize,
  PagingContent,
  httpOptions,
} from '../core/models/sharedModels';
import {
  CreateIotRequest,
  IOTSetupTransDto,
  UpdateIotRequest,
} from '../modules/iot/models/iot';
import { LoadingService } from './loading.service';

const blobOptions = { responseType: 'blob' as 'json' };

@Injectable({
  providedIn: 'root',
})
export class IotService {
  public httpClient = inject(HttpClient);
  private messageService = inject(MessageService);
  private loadingService = inject(LoadingService);

  url = 'api/IOTSetupTrans';

  get ApiUrl() {
    return `${environment.apiBaseUrl}/${this.url}`;
  }

  Create(data: CreateIotRequest): Observable<IOTSetupTransDto> {
    return this.httpClient
      .post<BaseResponseWithData<IOTSetupTransDto>>(
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

  Update(data: UpdateIotRequest): Observable<IOTSetupTransDto> {
    return this.httpClient
      .put<BaseResponseWithData<IOTSetupTransDto>>(
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

  Get(
    Page: number = DefaultPage,
    PageSize: number = DefaultPageSize,
    SearchText: string = ''
  ): Observable<PagingContent<IOTSetupTransDto>> {
    let params = new HttpParams()
      .append('Page', Page)
      .append('PageSize', PageSize)
      .append('SearchText', SearchText);
    return this.httpClient
      .get<BaseResponseWithData<PagingContent<IOTSetupTransDto>>>(
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
  ): Observable<PagingContent<IOTSetupTransDto>> {
    let params = new HttpParams()
      .append('Page', Page)
      .append('PageSize', PageSize)
      .append('Filters', Filters)
      .append('Sorts', Sorts);
    return this.httpClient
      .get<BaseResponseWithData<PagingContent<IOTSetupTransDto>>>(
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

  GetById(data: string): Observable<IOTSetupTransDto> {
    let params = new HttpParams().append('Id', data);
    return this.httpClient
      .get<BaseResponseWithData<IOTSetupTransDto>>(`${this.ApiUrl}/GetById`, {
        ...httpOptions,
        params,
      })
      .pipe(
        retry(1),
        tap(this.RespondShowMessage),
        map((resp) => resp.Data)
      );
  }

  // Delete(data: string): Observable<BaseResponse> {
  //   let params = new HttpParams().append('Id', data);
  //   return this.httpClient
  //     .delete<BaseResponse>(`${this.ApiUrl}/Delete`, { ...httpOptions, params })
  //     .pipe(tap(this.RespondShowMessage));
  // };

  AutoCompleteList(): Observable<string[]> {
    return this.httpClient
      .get<string[]>(`${this.ApiUrl}/AutoCompleteList`, httpOptions)
      .pipe(
        map((resp) => resp || []),
        shareReplay(1)
      );
  }

  DownloadPdf(Id: string): Observable<any> {
    let params = new HttpParams().append('Id', Id);
    return this.httpClient
      .get(`${this.ApiUrl}/DownloadPdf`, { ...blobOptions, params })
      .pipe(shareReplay(5));
  }

  public ResendEmail(Id: string) {
    let params = new HttpParams().append('Id', Id);
    return this.httpClient
      .get(`${this.ApiUrl}/ResendEmail`, { ...blobOptions, params })
      .pipe(shareReplay(5));
  }

  public ExportToExcel() {
    return this.httpClient
      .get(`${this.ApiUrl}/ExportToExcel`, { ...blobOptions })
      .pipe(shareReplay(5));
  }

  RespondShowMessage(respond: { Success: boolean; Message: string } | any) {
    if (!respond?.Success) {
      this.messageService.add({
        severity: 'error',
        summary: 'Apps',
        detail: respond.Message,
      });
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
