import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { Observable, catchError, map } from 'rxjs';
import { PagingContent } from 'src/app/core/models/sharedModels';
import { LoadingService } from 'src/app/services/loading.service';
import { UserProfileService } from 'src/app/services/userProfile.service';
import { SearchboxComponent } from 'src/app/shared/components/searchbox/searchbox.component';
import { UserProfileDto } from '../../models/userProfile';

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [CommonModule, CardModule, SearchboxComponent, ButtonModule, TableModule, FormsModule, InputSwitchModule,
    DialogModule, DropdownModule],
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.less'],
})
export class ViewUserComponent {
  Title: string = 'User Manager';

  listOfData = [] as UserProfileDto[];
  Page: number = 1;
  PageSize: number = 10;
  SearchTextNgModel: string = '';
  isVisible = false;

  private userProfileService = inject(UserProfileService);
  private loadingService = inject(LoadingService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  AutoCompleteSource$: Observable<string[]> = this.userProfileService.AutoCompleteList();
  PagingSignal = signal<PagingContent<UserProfileDto>>({} as PagingContent<UserProfileDto>);

  userSelection$ = this.userProfileService.Get(1, 10000).pipe(map(x => x.Content.map(x => ({ label: x.Name, value: x.Id }))));
  userSelected = '';

  ngOnInit() {
    this.LoadData();
  }

  LoadData() {
    this.loadingService.start();
    this.userProfileService
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

  EnableDisableUser(event: boolean = false, id: string) {
    if (!event) {
      console.log(event);
      this.userProfileService.Enable(id).subscribe((x) => {
        this.listOfData.forEach((res) => {
          if (res.Id === id) {
            res.IsDisable = event;
          }
        });
      });
    } else {
      this.userProfileService.Disable(id).subscribe((x) => {
        this.listOfData.forEach((res) => {
          if (res.Id === id) {
            res.IsDisable = event;
          }
        });
      });
    }
  }

  ShowModal() {
    this.isVisible = true;
  }

  CloseModal() {
    this.isVisible = false;
  }

  ImportUser() {
    if (!this.userSelected || this.userSelected == '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please select to import!',
      });
      return;
    }
    this.userProfileService
      .FxtImportUser(this.userSelected)
      .pipe(
        catchError(() => {
          throw new Error('Import failed!');
        })
      )
      .subscribe((respond) => {
        this.LoadData();
        this.isVisible = false;
        this.userSelected = '';
      });
  }

  EditClick = (id: string) =>
    this.router.navigate([`/settings/user-manager/update/${id}`]);
}
