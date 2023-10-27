import { Component, inject, OnInit } from '@angular/core';
import { LoginResponse, OidcSecurityService } from 'angular-auth-oidc-client';
import { PrimeNGConfig } from 'primeng/api';
import { delay } from 'rxjs';
import { RoleService } from 'src/app/services/role.service';
import { LoadingService } from './services/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit {
  readonly authService = inject(OidcSecurityService);
  readonly roleService = inject(RoleService);

  isSpinning$ = inject(LoadingService).isLoading$.pipe(delay(0));
  constructor(private primengConfig: PrimeNGConfig) {}

  ngOnInit() {
    this.authService.checkAuth().subscribe(({ userData }: LoginResponse) => {
      this.roleService.UpdateUserRole(userData?.role || []);
    });
    this.primengConfig.ripple = true;
  }
}
