import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotificationUserComponent } from './notification-user/notification-user.component';

const routes: Routes = [
  {
    path: 'parcel',
    loadChildren: () =>
      import('./parcel/parcel.config').then((m) => m.IOTROUTE),
  },
  { path: 'notification-user', component: NotificationUserComponent },
  {
    path: 'user-manager',
    loadChildren: () =>
      import('./user-manager/user-manager.config').then((m) => m.MANAGERROUTE),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
