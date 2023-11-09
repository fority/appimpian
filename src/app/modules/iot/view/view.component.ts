import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { RippleModule } from 'primeng/ripple';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { Observable, of } from 'rxjs';
import { DefaultPage, DefaultPageSize, PagingContent } from 'src/app/core/models/sharedModels';
import { FilterOperatorOptions, GetFilterText, GetSortText } from 'src/app/core/utils/tableFilter';
import { LoadingService } from 'src/app/services/loading.service';
import { SearchboxComponent } from 'src/app/shared/components/searchbox/searchbox.component';
import { IotService } from '../../../services/iot.service';
import { TrueFalsePipe } from '../../../shared/pipes/truefalse.pipe';
import { IOTSetupTransDto } from '../models/iotSetupTransModels';

@Component({
  selector: 'app-view',
  standalone: true,
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.less'],
  imports: [
    CommonModule,
    CardModule,
    SearchboxComponent,
    ButtonModule,
    TableModule,
    RippleModule,
    PanelModule,
    TrueFalsePipe,
  ],
})
export class ViewComponent implements OnInit {
  @ViewChild('fTable') fTable?: Table;
  private iotService = inject(IotService);
  private loadingService = inject(LoadingService);
  private router = inject(Router);

  Page: number = DefaultPage;
  PageSize: number = DefaultPageSize;

  SortText = '';
  FilterText = '';
  SearchTextNgModel: string = '';
  AutoCompleteSource$: Observable<string[]> = this.iotService.AutoCompleteList();
  FilteredAutoComplete$: Observable<string[]> = of([]);
  MatchModeOptions = FilterOperatorOptions;
  PagingSignal = signal<PagingContent<IOTSetupTransDto>>({} as PagingContent<IOTSetupTransDto>);

  ngOnInit() {
    //this.LoadData();
  }

  LoadData() {
    this.loadingService.start();
    this.iotService.GetAdvancedFilter(this.Page, this.PageSize, this.FilterText, this.SortText).subscribe((x) => {
      this.PagingSignal.set(x);
      console.log(x);
      this.loadingService.stop();
    });
  }

  Search(data: string) {
    this.SearchTextNgModel = data;
    this.Page = DefaultPage;
    this.iotService.SetModelId(this.SearchTextNgModel);
    this.FilterText = 'ServiceNumber|ParcelNumber.UnitNumber@=' + this.SearchTextNgModel;
    this.ResetTable();
    this.LoadData();
  }

  ClearSearch() {
    this.Page = DefaultPage;
    this.FilterText = '';
    this.SearchTextNgModel = '';
    this.ResetTable();
    this.LoadData();
  }

  ResetTable() {
    if (this.fTable) {
      this.fTable.clearFilterValues();
      this.fTable.saveState();
    }
  }

  NextPage(event: TableLazyLoadEvent) {
    if ((event?.first || event?.first === 0) && event?.rows) {
      this.Page = event.first / event.rows + 1 || 1;
      this.PageSize = event.rows;
    }
    this.SortText = GetSortText(event.multiSortMeta ?? []);
    const columnFilterText = GetFilterText(event?.filters);
    if (columnFilterText !== '') {
      this.FilterText = columnFilterText;
      this.SearchTextNgModel = '';
    }
    this.LoadData();
  }

  AddClick() {
    this.router.navigate(['/iot/create']);
  }
  GotoDetails(id: string) {
    this.router.navigate([`/iot/details/${id}`]);
  }
  EditClick(id: string) {
    this.router.navigate([`/iot/update/${id}`]);
  }
}
