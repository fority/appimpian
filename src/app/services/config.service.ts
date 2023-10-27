import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ConfigData } from './../shared/models/iApiUrl';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  apiUrl = environment.apiBaseUrl;
  private http = inject(HttpClient);

  loadConfig(coreConfig: object): any {
    const configPath = environment.production ? `${this.apiUrl}/assets/app-config.json` : `./assets/app-config.json`;
    return this.http.get<ConfigData>(configPath).pipe(
      tap((config) => {
        Object.assign(coreConfig, config);
        localStorage.setItem('config', JSON.stringify(config));
      })
    );
  }
}
