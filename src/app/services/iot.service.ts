import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { BaseSettingsService } from 'src/app/core/services/base-settings.service';
import { IOTSetupTrans } from '../modules/iot/models/iot';

const blobOptions = { responseType: 'blob' as 'json' };

@Injectable({
  providedIn: 'root',
})
export class IotService extends BaseSettingsService<IOTSetupTrans> {
  constructor() {
    super('api/IOTSetupTrans');
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
      .get(`${this.ApiUrl}/ResendEmail`, { ...blobOptions })
      .pipe(shareReplay(5));
  }

  // SetModelId(text: string) {
  //   localStorage.setItem('modelId', text);
  // }

  // GetModelId() {
  //   const x = localStorage.getItem('modelId');
  //   return x || undefined;
  // }
}
