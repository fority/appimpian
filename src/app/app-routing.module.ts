import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CallbackComponent } from './shared/components/callback/callback.component';
import { NotfoundComponent } from './shared/components/notfound/notfound.component';
import { UnauthorizedComponent } from './shared/components/unauthorized/unauthorized.component';
import { Layout } from './shared/layout/layout.service';

const routes: Routes = [
  Layout.normalChildRoutes([
    { path: '', pathMatch: 'full', redirectTo: 'home' },
    { path: 'home', component: HomeComponent },
    {
      path: 'iot',
      loadChildren: () =>
        import('./modules/iot/iot.module').then((m) => m.IotModule),
    },
    {
      path: 'settings',
      loadChildren: () =>
        import('./modules/settings/settings.module').then(
          (m) => m.SettingsModule
        ),
    },
    { path: 'authcallback', component: CallbackComponent },
    { path: 'unauthorized', component: UnauthorizedComponent },
    { path: '**', pathMatch: 'full', component: NotfoundComponent },
  ]),
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
