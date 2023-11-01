import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutoLoginPartialRoutesGuard } from 'angular-auth-oidc-client';
import { HomeComponent } from './pages/home/home.component';
import { NotfoundComponent } from './shared/components/notfound/notfound.component';
import { UnauthorizedComponent } from './shared/components/unauthorized/unauthorized.component';
import { SidebarLayoutComponent } from './shared/layout/sidebar-layout/sidebar-layout.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: SidebarLayoutComponent, children: [{ path: '', component: HomeComponent }] },
  { path: 'iot', loadChildren: () => import('./modules/iot/iot.module').then((m) => m.IotModule), canLoad: [AutoLoginPartialRoutesGuard] },
  { path: 'settings', loadChildren: () => import('./modules/settings/settings.module').then((m) => m.SettingsModule), canLoad: [AutoLoginPartialRoutesGuard] },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: '**', pathMatch: 'full', component: NotfoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
