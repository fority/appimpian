import { CommonModule, Location } from '@angular/common';
import { Component, ViewChild, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { ToolbarModule } from 'primeng/toolbar';
import { map } from 'rxjs';
import { ValidateForm, ValidateInvalidField } from 'src/app/core/utils/helpers';
import { IotService } from 'src/app/services/iot.service';
import { ParcelService } from 'src/app/services/parcel.service';
import { IOTSetupTransDto } from '../models/iotSetupTransModels';
import { SignatureComponent } from '../signature/signature.component';
@Component({
  selector: 'app-save',
  standalone: true,
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.less'],
  imports: [
    CommonModule,
    ToolbarModule,
    CardModule,
    ReactiveFormsModule,
    FormsModule,
    DropdownModule,
    SignatureComponent,
    ButtonModule,
    FormsModule,
    CheckboxModule,
  ],
})
export class AddEditComponent {
  @ViewChild('appSign') signComp = {} as SignatureComponent;
  private parcelService = inject(ParcelService);
  private activatedRoute = inject(ActivatedRoute);
  private iotService = inject(IotService);
  private location = inject(Location);
  private messageService = inject(MessageService);

  impianFormGroup: FormGroup;
  iot = {} as IOTSetupTransDto;
  iotId = '';
  isUpdate: boolean = false;
  ParcelNumberId = '';
  Title = '';

  ParcelNoSource$ = this.parcelService
    .Get(1, 10000)
    .pipe(map((x) => x.Content.map((x) => ({ label: x.UnitNumber, value: x.Id }))));

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
      this.impianFormGroup.get('ParcelNumberId')?.disable();
      this.impianFormGroup.get('SmartDoorLock')?.disable();
      this.impianFormGroup.get('SmartDoorbell')?.disable();
      this.impianFormGroup.get('SmartCurtain')?.disable();
      this.impianFormGroup.get('SmartSwitches')?.disable();
      this.impianFormGroup.get('RGBLightStrip')?.disable();
      this.impianFormGroup.get('SmartTv')?.disable();
      this.impianFormGroup.get('Gateway')?.disable();
      this.impianFormGroup.get('SmartSpeaker')?.disable();
      this.impianFormGroup.get('Handbook')?.disable();
      this.Title = 'Update IOT Setup';
      this.LoadForm();
    } else {
      this.isUpdate = false;
      this.Title = 'Create IOT Setup';
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
    let text: Set<string> = new Set();

    if (!ValidateForm(this.impianFormGroup)) {
      const invalidField = ValidateInvalidField(this.impianFormGroup);
      invalidField.forEach((res) => text.add(res));

      return this.messageService.add({
        severity: 'error',
        summary: 'Please fill up the form!',
        detail: '' + [...text],
      });
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
      this.impianFormGroup.get('Signature')?.setValue(this.signComp.GetDrawDataUrl());
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

  get validateName() {
    return this.impianFormGroup.get('ParcelNumberId')?.invalid && this.impianFormGroup.get('ParcelNumberId')?.dirty;
  }
}
