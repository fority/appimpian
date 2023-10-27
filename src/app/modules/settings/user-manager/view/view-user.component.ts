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
import { Observable, catchError } from 'rxjs';
import { PagingContent, SelectOption } from 'src/app/core/models/sharedModels';
import { LoadingService } from 'src/app/services/loading.service';
import { UserProfileService } from 'src/app/services/userProfile.service';
import { SearchboxComponent } from 'src/app/shared/components/searchbox/searchbox.component';
import { UserProfile } from '../../models/userProfile';
import { MANAGER_MODULE } from '../user-manager.config';

@Component({
  selector: 'app-view :not(p)',
  standalone: true,
  imports: [
    MANAGER_MODULE,
    CardModule,
    SearchboxComponent,
    ButtonModule,
    TableModule,
    FormsModule,
    InputSwitchModule,
    DialogModule,
    DropdownModule,
  ],
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.less'],
})
export class ViewUserComponent {
  Title: string = 'User Manager';

  listOfData = [] as UserProfile[];
  Page: number = 1;
  PageSize: number = 10;
  SearchTextNgModel: string = '';
  isVisible = false;

  private userProfileService = inject(UserProfileService);
  private loadingService = inject(LoadingService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  AutoCompleteSource$: Observable<string[]> =
    this.userProfileService.AutoCompleteList();
  PagingSignal = signal<PagingContent<UserProfile>>(
    {} as PagingContent<UserProfile>
  );

  userSelection$: Observable<SelectOption<string>[]> =
    this.userProfileService.GetSelectOption('Username', 'Id');

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

  EnableDisableUser(event: boolean, id: string) {
    if (event) {
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

    // let service;
    // service = !event
    //   ? this.userProfileService.Enable(id)
    //   : this.userProfileService.Disable(id);
    // service.subscribe((respond) => {
    //   if (respond) {
    //     this.listOfData.forEach((res) => {
    //       if (res.Id === id) {
    //         res.IsDisable = event;
    //       }
    //     });
    //   }
    // });
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
      .ImportUser(this.userSelected)
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

  //   GetData() {
  //     this.pageSettings = { page: this.page, pageSize: this.pageSize, filter: this.searchFilterText, sort: this.searchSortText };
  //     this.userProfileService
  //       .GetAdvancedFilter(this.pageSettings)
  //       .subscribe((respond: BaseResponseWithData<PagingContent<UserProfile>>) => {
  //         const _thread = respond.Data;
  //         if (respond.Success) {
  //           this.listOfData = [];
  //           this.listOfData = _thread.Content;
  //           this.totalItem = _thread.TotalElements;
  //         }
  //       });
  //   }

  //   CreateClick() {
  //     this.router.navigate([`/user-manager/create-update`]);
  //   }

  //   PageIndexChange($event: any) {
  //     this.page = $event;
  //     this.GetData();
  //   }

  //   PageSizeChange($event: any) {
  //     this.pageSize = $event;
  //     this.GetData();
  //   }

  //   //#region Search
  //   searchFilterText = '';
  //   searchSortText = this.DEFAULT_SORT;
  //   tableHeaders = [] as SortTableModelType[];

  //   SortByColumn(header: SortTableModelType, $event: string) {
  //     this.page = 1;
  //     header.assignSortBy($event);
  //     this.searchSortText = this.sortingService.SortByColumn();
  //     this.GetData();
  //   }

  //   FilterByColumn(header: SortTableModelType, $event: string) {
  //     this.page = 1;
  //     header.assignFilterBy($event);
  //     this.searchFilterText = this.sortingService.FilterByColumn();
  //     this.GetData();
  //   }

  //   onSearch($event: string) {
  //     this.page = 1;
  //     this.onSortClear();
  //     this.searchFilterText = this.sortingService.SearchAll($event);
  //     this.GetData();
  //   }

  //   onSortClear() {
  //     this.searchFilterText = '';
  //     this.searchSortText = this.DEFAULT_SORT;
  //     this.tableHeaders = this.sortingService.ResetHeader();
  //   }

  //   onClear() {
  //     this.ResetPage();
  //   }

  //   ResetPage() {
  //     this.page = 1;
  //     this.onSortClear();
  //     this.GetData();
  //   }
  //   //#endregion
}
