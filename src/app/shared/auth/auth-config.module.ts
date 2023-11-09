import { NgModule } from '@angular/core';
import { AuthModule, LogLevel } from 'angular-auth-oidc-client';
import { environment } from 'src/environments/environment';

@NgModule({
  imports: [
    AuthModule.forRoot({
      config: {
        //authority: 'https://localhost:44313', //samples
        //authority: 'https://localhost:7251', //razor
        //authority: 'https://localhost:5001', //ui
        // authority: 'https://localhost:7004', //Fluxit Server
        // redirectUrl: 'https://localhost:4200',
        // postLogoutRedirectUri: 'https://localhost:4200',
        // clientId: 'angularclient',
        // scope: 'openid profile email offline_access roles api_scope server_scope',
        // responseType: 'code',
        // renewTimeBeforeTokenExpiresInSeconds: 30,
        // triggerRefreshWhenIdTokenExpired: false,
        // ignoreNonceAfterRefresh: true,
        // silentRenew: true,
        // useRefreshToken: true,
        // autoUserInfo: true,
        // logLevel: LogLevel.Debug,

        authority: environment.AuthServerUrl,
        redirectUrl: environment.RedirectUrl,
        postLogoutRedirectUri: environment.RedirectUrl,
        clientId: 'DKMY',
        scope: 'openid profile email offline_access roles api_scope',
        responseType: 'code',
        silentRenew: true,
        useRefreshToken: true,
        renewTimeBeforeTokenExpiresInSeconds: 30,
        ignoreNonceAfterRefresh: true, // this is required if the id_token is not returned
        triggerRefreshWhenIdTokenExpired: false, // required when refreshing the browser if id_token is not updated after the first authentication
        // allowUnsafeReuseRefreshToken: true, // this is required if the refresh token is not rotated
        autoUserInfo: true, // if the user endpoint is not supported.
        logLevel: LogLevel.Debug,
        historyCleanupOff: false,
        //triggerAuthorizationResultEvent: true,
      },
    }),
  ],
  exports: [AuthModule],
})
export class AuthConfigModule { }
