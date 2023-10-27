import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutoLoginPartialRoutesGuard } from 'angular-auth-oidc-client';
import { DetailsComponent } from './details/details.component';
import { SaveComponent } from './save/save.component';
import { ViewComponent } from './view/view.component';

const routes: Routes = [
  {
    path: 'view',
    component: ViewComponent,
    canActivate: [AutoLoginPartialRoutesGuard],
    data: { role: ['DKMY.Impian.Admin'] },
  },
  {
    path: 'details/:id',
    component: DetailsComponent,
    canActivate: [AutoLoginPartialRoutesGuard],
    data: { role: ['DKMY.Impian.Admin'] },
  },
  {
    path: 'create',
    component: SaveComponent,
    canActivate: [AutoLoginPartialRoutesGuard],
    data: { role: ['DKMY.Impian.Admin'] },
  },
  {
    path: 'update/:id',
    component: SaveComponent,
    canActivate: [AutoLoginPartialRoutesGuard],
    data: { role: ['DKMY.Impian.Admin'] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IotRoutingModule {}
