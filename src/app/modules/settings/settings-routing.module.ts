import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SidebarLayoutComponent } from 'src/app/shared/layout/sidebar-layout/sidebar-layout.component';
import { NotificationUserComponent } from './notification-user/notification-user.component';
import { AddEditParcelComponent } from './parcel/add-edit/add-edit-parcel.component';
import { ViewComponent } from './parcel/view/view.component';
import { UpdateComponent } from './user-manager/update/update.component';
import { ViewUserComponent } from './user-manager/view/view-user.component';

const routes: Routes = [
  {
    path: 'parcel/view',
    component: SidebarLayoutComponent,
    children: [{ path: '', component: ViewComponent }],
    data: { role: ['DKMY.Impian.Admin'] },
  },
  {
    path: 'parcel/create',
    component: SidebarLayoutComponent,
    children: [{ path: '', component: AddEditParcelComponent }],
    data: { role: ['DKMY.Impian.Admin'] },
  },
  {
    path: 'parcel/update/:id',
    component: SidebarLayoutComponent,
    children: [{ path: '', component: AddEditParcelComponent }],
    data: { role: ['DKMY.Impian.Admin'] },
  },
  {
    path: 'notification-user',
    component: SidebarLayoutComponent,
    children: [{ path: '', component: NotificationUserComponent }],
    data: { role: ['DKMY.Impian.Admin'] },
  },
  {
    path: 'user-manager/view',
    component: SidebarLayoutComponent,
    children: [{ path: '', component: ViewUserComponent }],
    data: { role: ['DKMY.Impian.Admin'] },
  },
  {
    path: 'user-manager/update/:id',
    component: SidebarLayoutComponent,
    children: [{ path: '', component: UpdateComponent }],
    data: { role: ['DKMY.Impian.Admin'] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
