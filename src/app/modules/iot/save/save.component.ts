import { CommonModule, Location } from '@angular/common';
import { Component, ViewChild, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { map } from 'rxjs';
import { ValidateForm } from 'src/app/core/utils/helpers';
import { IotService } from 'src/app/services/iot.service';
import { ParcelService } from 'src/app/services/parcel.service';
import { IOTSetupTrans } from '../models/iot';
import { SignatureComponent } from '../signature/signature.component';

@Component({
  selector: 'app-save',
  standalone: true,
  templateUrl: './save.component.html',
  styleUrls: ['./save.component.less'],
  imports: [
    CommonModule,
    CardModule,
    ReactiveFormsModule,
    FormsModule,
    DropdownModule,
    SignatureComponent,
    ButtonModule,
    FormsModule,
  ],
})
export class SaveComponent {
  @ViewChild('appSign') signComp = {} as SignatureComponent;
  private parcelService = inject(ParcelService);
  private activatedRoute = inject(ActivatedRoute);
  private iotService = inject(IotService);
  private location = inject(Location);
  private messageService = inject(MessageService);

  impianFormGroup: FormGroup;
  iot = {} as IOTSetupTrans;
  iotId = '';
  isUpdate: boolean = false;
  ParcelNumberId = '';

  ParcelNoSource$ = this.parcelService
    .Get(1, 10000)
    .pipe(
      map((x) => x.Content.map((x) => ({ label: x.UnitNumber, value: x.Id })))
    );

  constructor() {
    this.impianFormGroup = new FormGroup({
      Id: new FormControl<string>({ value: '', disabled: true }),
      ParcelNumberId: new FormControl<string>('', [Validators.required]),
      SmartDoorLock: new FormControl<boolean>(false),
      SmartDoorbell: new FormControl<boolean>(false),
      SmartCurtain: new FormControl<boolean>(false),
      SmartSwitches: new FormControl<boolean>(false),
      Gateway: new FormControl<boolean>(false),
      IRBlaster: new FormControl<boolean>(false),
      IRBlasterSerial: new FormControl<string>('', [Validators.required]),
      RGBLightStrip: new FormControl<boolean>(false),
      SmartSpeaker: new FormControl<boolean>(false),
      SmartSpeakerSerial: new FormControl<string>('', [Validators.required]),
      SmartTv: new FormControl<boolean>(false),
      Handbook: new FormControl<boolean>(false),
      Remark: new FormControl<string>(''),
      Signature: new FormControl<string | null>(null),
    });
  }

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.params['id']) {
      this.iotId = this.activatedRoute.snapshot.params['id'];
      this.isUpdate = true;
      this.LoadForm();
    } else {
      this.isUpdate = false;
      this.impianFormGroup.get('Id')?.disable();
    }
  }

  LoadForm() {
    this.iotService.GetById(this.iotId).subscribe((respond) => {
      this.impianFormGroup.patchValue(respond);
      this.impianFormGroup.get('ParcelNumberId')?.patchValue(respond.ParcelNumber?.Id);
    });
    this.impianFormGroup.get('Id')?.enable();
    this.impianFormGroup.get('IRBlasterSerial')?.enable();
    this.impianFormGroup.get('SmartSpeakerSerial')?.enable();
    this.impianFormGroup.get('Remark')?.enable();
  }

  SaveUpdateClick() {
    console.log(this.isUpdate);
    if (!ValidateForm(this.impianFormGroup)) {
      return;
    }
    if (!this.isUpdate) {
      if (!this.signComp.GetDrawDataUrl()) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Please sign before submit',
        });
        return;
      }
      this.impianFormGroup
        .get('Signature')
        ?.setValue(this.signComp.GetDrawDataUrl());
    }

    const service = !this.iotId
      ? this.iotService.Create(this.impianFormGroup.value)
      : this.iotService.Update(this.impianFormGroup.value);
    service.subscribe((respond) => {
      this.CancelClick();
    });
  }

  CancelClick() {
    this.location.back();
  }
}
