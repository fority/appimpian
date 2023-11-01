import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotificationUserComponent } from './notification-user/notification-user.component';
import { SaveParcelComponent } from './parcel/save/save-parcel.component';
import { ViewComponent } from './parcel/view/view.component';
import { UpdateComponent } from './user-manager/update/update.component';
import { ViewUserComponent } from './user-manager/view/view-user.component';

const routes: Routes = [
  {
    path: 'parcel/view',
    component: ViewComponent,
  },
  {
    path: 'parcel/create',
    component: SaveParcelComponent,
  },
  {
    path: 'parcel/update/:id',
    component: SaveParcelComponent,
  },
  { path: 'notification-user', component: NotificationUserComponent },
  {
    path: 'user-manager/view',
    component: ViewUserComponent,
  },
  {
    path: 'user-manager/update/:id',
    component: UpdateComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
