import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { SidebarModule } from 'primeng/sidebar';
import { take } from 'rxjs';
import { IotService } from 'src/app/services/iot.service';

import { RoleService } from 'src/app/services/role.service';

interface CustomMenuItem extends MenuItem {
  roles?: string[];
}
@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SidebarModule,
    MenuModule,
    ButtonModule,
  ],
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SidebarComponent {
  @Input() sidebarVisible = false;
  @Output() HideSideBarEmitter = new EventEmitter();

  userRoles: string[] = [];

  private router = inject(Router);
  private iotService = inject(IotService);
  readonly roleService = inject(RoleService);

  SideMenuItems: CustomMenuItem[] = [
    {
      label: 'IOT Setup',
      visible: true,
      items: [
        {
          label: 'View',
          command: () => {
            this.router.navigateByUrl('/iot/view');
          },
        },
      ],
    },
    {
      label: 'Setting',
      visible: false,
      roles: ['DKMY.Impian.Admin'],
      items: [
        {
          label: 'Parcel',
          command: () => {
            this.router.navigateByUrl('/settings/parcel/view');
          },
        },
        {
          label: 'Notification User',
          command: () => {
            this.router.navigateByUrl('/settings/notification-user');
          },
        },
        {
          label: 'Manage User',
          command: () => {
            this.router.navigateByUrl('/settings/user-manager/view');
          },
        },
      ],
    },
  ];

  constructor() {
    this.roleService.userRoleSubject.pipe(take(1)).subscribe((_roles) => {
      this.userRoles = _roles;
      this.SideMenuItems.forEach((menuItem) => {
        if (menuItem.roles) menuItem.visible = this.IsVisible(menuItem.roles);
      });
    });
  }

  IsVisible = (roles: string[]) =>
    roles?.some((role) => this.userRoles.includes(role));

  HideSideBar = () => this.HideSideBarEmitter.emit();
}
