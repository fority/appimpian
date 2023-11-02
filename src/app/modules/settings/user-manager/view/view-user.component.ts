import { CommonModule } from '@angular/common';
import { Component, ViewChild, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { catchError, map } from 'rxjs';
import { PagingContent } from 'src/app/core/models/sharedModels';
import { LoadingService } from 'src/app/services/loading.service';
import { UserProfileService } from 'src/app/services/userProfile.service';
import { SearchboxComponent } from 'src/app/shared/components/searchbox/searchbox.component';
import { UserProfileDto } from '../../models/userProfile';
import {
  FilterOperatorOptions,
  GetSortText,
} from 'src/app/core/utils/tableFilter';
import { TreeTableModule } from 'primeng/treetable';

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    SearchboxComponent,
    ButtonModule,
    TableModule,
    FormsModule,
    InputSwitchModule,
    DialogModule,
    DropdownModule,
    TreeTableModule,
  ],
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.less'],
})
export class ViewUserComponent {
  @ViewChild('basicTable') basicTable?: Table;
  Title: string = 'User Manager';

  listOfData = [] as UserProfileDto[];
  Page: number = 1;
  PageSize: number = 10;
  SortText = '';
  FilterText = '';
  SearchTextNgModel: string = '';
  isVisible = false;
  MatchModeOptions = FilterOperatorOptions;

  private userProfileService = inject(UserProfileService);
  private loadingService = inject(LoadingService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  PagingSignal = signal<PagingContent<UserProfileDto>>(
    {} as PagingContent<UserProfileDto>
  );

  userSelection$ = this.userProfileService
    .Get(1, 10000)
    .pipe(map((x) => x.Content.map((x) => ({ label: x.Name, value: x.Id }))));
  userSelected = '';

  ngOnInit() {
    this.LoadData();
  }

  LoadData() {
    this.loadingService.start();
    this.userProfileService
      .AdvancedFilter(this.Page, this.PageSize, this.FilterText, this.SortText)
      .subscribe((x) => {
        this.PagingSignal.set(x);
        console.log(x);
        this.loadingService.stop();
      });
  }

  Search(data: string) {
    this.SearchTextNgModel = data;
    this.Page = 1;
    this.userProfileService.SetModelId(this.SearchTextNgModel);
    this.FilterText = 'Name|Username@=' + this.SearchTextNgModel;
    this.ResetTable();
    this.LoadData();
  }

  ClearSearch() {
    this.Page = 1;
    this.FilterText = '';
    this.SearchTextNgModel = '';
    this.ResetTable();
    this.LoadData();
  }

  ResetTable() {
    if (this.basicTable) {
      this.basicTable.clearFilterValues();
      this.basicTable.saveState();
    }
  }

  NextPage(event: TableLazyLoadEvent) {
    if ((event?.first || event?.first === 0) && event?.rows) {
      this.Page = event.first / event.rows + 1 || 1;
      this.PageSize = event.rows;
    }
    this.SortText = GetSortText(event.multiSortMeta ?? []);
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

  EditClick(id: string) {
    this.router.navigate([`/settings/user-manager/update/${id}`]);
  }
}
