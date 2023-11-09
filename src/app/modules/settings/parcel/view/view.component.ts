import { ParcelService } from 'src/app/services/parcel.service';

import { CommonModule } from '@angular/common';
import { Component, inject, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { Observable } from 'rxjs';
import { DefaultPage, DefaultPageSize, PagingContent } from 'src/app/core/models/sharedModels';
import { LoadingService } from 'src/app/services/loading.service';
import { SearchboxComponent } from 'src/app/shared/components/searchbox/searchbox.component';
import { ParcelNumberDto } from '../../models/parcelNumberModels';

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [CommonModule, CardModule, SearchboxComponent, ButtonModule, TableModule],
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.less'],
})
export class ViewComponent {
  @ViewChild('basicTable') basicTable?: Table;
  Title: string = 'Parcel Number';

  private parcelService = inject(ParcelService);
  private loadingService = inject(LoadingService);
  private router = inject(Router);

  Page: number = DefaultPage;
  PageSize: number = DefaultPageSize;
  SearchTextNgModel: string = '';

  AutoCompleteSource$: Observable<string[]> = this.parcelService.AutoCompleteList();
  PagingSignal = signal<PagingContent<ParcelNumberDto>>({} as PagingContent<ParcelNumberDto>);


  LoadData() {
    this.loadingService.start();
    this.parcelService.Get(this.Page, this.PageSize, this.SearchTextNgModel).subscribe((x) => {
      this.PagingSignal.set(x);
      this.loadingService.stop();
    });
  }

  Search(data: string) {
    this.SearchTextNgModel = data;
    this.Page = DefaultPage;
    this.LoadData();
  }

  ClearSearch() {
    this.Page = DefaultPage;
    this.SearchTextNgModel = '';
    this.LoadData();
  }

  // ResetTable() {
  //   if (this.basicTable) {
  //     this.basicTable.clearFilterValues();
  //     this.basicTable.saveState();
  //   }
  // }

  NextPage(event: TableLazyLoadEvent) {
    if ((event?.first || event?.first === 0) && event?.rows) {
      this.Page = event.first / event.rows + 1 || 1;
      this.PageSize = event.rows;
    }
    this.LoadData();
  }

  AddClick = () => this.router.navigate(['/settings/parcel/create']);
  EditClick = (id: string) => this.router.navigate([`/settings/parcel/update/${id}`]);
}
