import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SidebarLayoutComponent } from 'src/app/shared/layout/sidebar-layout/sidebar-layout.component';
import { DetailsComponent } from './details/details.component';
import { SaveComponent } from './save/save.component';
import { ViewComponent } from './view/view.component';

const routes: Routes = [
  { path: 'view', component: SidebarLayoutComponent, children: [{ path: '', component: ViewComponent }], data: { role: ['DKMY.Impian.Admin'] } },
  { path: 'details/:id', component: SidebarLayoutComponent, children: [{ path: '', component: DetailsComponent }], data: { role: ['DKMY.Impian.Admin'] } },
  { path: 'create', component: SidebarLayoutComponent, children: [{ path: '', component: SaveComponent }], data: { role: ['DKMY.Impian.Admin'] } },
  { path: 'update/:id', component: SidebarLayoutComponent, children: [{ path: '', component: SaveComponent }], data: { role: ['DKMY.Impian.Admin'] } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IotRoutingModule { }
