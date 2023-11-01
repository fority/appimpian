import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { Observable, concatMap } from 'rxjs';
import { PagingContent } from 'src/app/core/models/sharedModels';
import { LoadingService } from 'src/app/services/loading.service';
import { NotificationUserService } from 'src/app/services/notification-user.service';
import { SearchboxComponent } from 'src/app/shared/components/searchbox/searchbox.component';
import { NotificationUserDto } from '../models/notif-user';

@Component({
  selector: 'app-notification-user',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    SearchboxComponent,
    ButtonModule,
    TableModule,
    FormsModule,
  ],
  templateUrl: './notification-user.component.html',
  styleUrls: ['./notification-user.component.less'],
})
export class NotificationUserComponent {
  private notificationUserService = inject(NotificationUserService);
  private loadingService = inject(LoadingService);
  private confirmationService = inject(ConfirmationService);

  Title: string = 'Notification User';
  Page: number = 1;
  PageSize: number = 10;
  SearchTextNgModel: string = '';

  ClonedLineData: { [s: string]: NotificationUserDto } = {};
  isAddEnable: boolean = false;
  NewName: string = '';
  NewEmail: string = '';

  AutoCompleteSource$: Observable<string[]> =
    this.notificationUserService.AutoCompleteList();
  PagingSignal = signal<PagingContent<NotificationUserDto>>(
    {} as PagingContent<NotificationUserDto>
  );

  ngOnInit() {
    this.LoadData();
  }

  LoadData() {
    this.loadingService.start();
    this.notificationUserService
      .Get(this.Page, this.PageSize, this.SearchTextNgModel)
      .subscribe((x) => {
        this.PagingSignal.set(x);
        console.log(x);
        this.loadingService.stop();
      });
  }

  Search(data: string) {
    this.SearchTextNgModel = data;
    this.Page = 1;
    this.LoadData();
  }

  ClearSearch() {
    this.Page = 1;
    this.SearchTextNgModel = '';
    this.LoadData();
  }

  NextPage(event: TableLazyLoadEvent) {
    if ((event?.first || event?.first === 0) && event?.rows) {
      this.Page = event.first / event.rows + 1 || 1;
      this.PageSize = event.rows;
    }
    this.LoadData();
  }

  Add() {
    this.isAddEnable = true;
    this.NewName = '';
    this.NewEmail = '';
  }

  SaveClick() {
    this.loadingService.start();
    this.NewName = this.NewName.toUpperCase();
    this.notificationUserService
      .Create({ Name: this.NewName, Email: this.NewEmail })
      .pipe(concatMap(() => this.notificationUserService.GetSamePage()))
      .subscribe((res) => {
        this.PagingSignal.set(res);
        this.isAddEnable = false;
        this.NewName = '';
        this.loadingService.stop();
      });
  }

  onRowEditInit(data: NotificationUserDto) {
    this.ClonedLineData[data.Id] = { ...data };
  }

  Delete(event: any, User: NotificationUserDto) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure to delete?',
      icon: 'pi pi-exclamation-triangle',
      dismissableMask: true,
      accept: () => {
        this.loadingService.start();
        this.notificationUserService.Delete(User.Id).subscribe(() => {
          this.PagingSignal.update((res) => ({
            ...res,
            Content: res.Content.filter((c) => c.Id !== User.Id),
          }));
          this.loadingService.stop();
        });
      },
      reject: () => {},
    });
  }

  onRowEditSave(index: number, user: NotificationUserDto) {
    this.loadingService.start();
    this.notificationUserService
      .Update({ Id: user.Id, Name: user.Name, Email: user.Email })
      .subscribe({
        next: () => {
          delete this.ClonedLineData[user.Id];
          this.loadingService.stop();
        },
        error: () => {
          this.PagingSignal.mutate((res) => {
            res.Content[index] = this.ClonedLineData[user.Id];
          });
          delete this.ClonedLineData[user.Id];
        },
      });
  }

  onRowEditCancel(user: NotificationUserDto, index: number) {
    this.PagingSignal.mutate(
      (res) => (res.Content[index] = this.ClonedLineData[user.Id])
    );
    delete this.ClonedLineData[user.Id];
  }
}
