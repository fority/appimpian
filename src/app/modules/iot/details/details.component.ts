import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { MenubarModule } from 'primeng/menubar';
import { Observable, of } from 'rxjs';
import { DownloadFile } from 'src/app/core/utils/helpers';
import { TrueFalsePipe } from 'src/app/shared/pipes/truefalse.pipe';
import { IotService } from '../../../services/iot.service';
import { LoadingService } from './../../../services/loading.service';
import { IOTSetupTransDto } from '../models/iotSetupTransModels';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, CardModule, MenubarModule, TrueFalsePipe],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.less'],
})
export class DetailsComponent implements OnInit {
  private iotService = inject(IotService);
  private activatedRoute = inject(ActivatedRoute);
  private loadingService = inject(LoadingService);

  PagingSource$: Observable<IOTSetupTransDto> = of();

  iotId: string = '';
  items: MenuItem[] | undefined;
  unitNumber: any = [];

  ngOnInit() {
    this.items = [
      {
        label: 'Option',
        icon: 'pi pi-fw pi-file',
        items: [
          {
            label: 'Resend Email',
            command: () => this.ResendEmail(),
            icon: 'pi pi-fw pi-envelope',
          },
          {
            label: 'Download PDF',
            command: () => this.DownloadPdf(),
            icon: 'pi pi-fw pi-file-pdf',
          },
        ],
      },
    ];
  }

  constructor() {
    if (this.activatedRoute.snapshot.params['id']) {
      this.iotId = this.activatedRoute.snapshot.params['id'];
      console.log(this.iotId);

      this.LoadData();
    }
  }

  LoadData() {
    this.loadingService.start();
    this.iotService.GetById(this.iotId).subscribe((x) => {
      this.PagingSource$ = of(x);
      this.unitNumber = x.ParcelNumber?.UnitNumber;
      this.loadingService.stop();
    });
  }

  ResendEmail() {
    this.iotService.ResendEmail(this.iotId).subscribe();
  }

  DownloadPdf() {
    this.iotService.DownloadPdf(this.iotId).subscribe((data: any) => {
      const fileData = DownloadFile(data, `IOT_${this.unitNumber}_FILE.pdf`);
      window.open(fileData.url, '_blank', 'noreferrer');
    });
  }
}
