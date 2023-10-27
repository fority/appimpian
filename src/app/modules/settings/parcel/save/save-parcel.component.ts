import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { ValidateForm } from 'src/app/core/utils/helpers';
import { ParcelService } from 'src/app/services/parcel.service';
import { PhoneNumberRegex } from 'src/app/shared/helpers/regex';
import {
  CreateParcelRequest,
  UpdateParcelRequest,
} from '../../models/parcel-no';
import { IOT_MODULE } from '../parcel.config';

@Component({
  selector: 'app-save',
  standalone: true,
  imports: [
    IOT_MODULE,
    CardModule,
    ReactiveFormsModule,
    FormsModule,
    DropdownModule,
    ButtonModule,
  ],
  templateUrl: './save.component.html',
  styleUrls: ['./save.component.less'],
})
export class SaveParcelComponent {
  private parcelService = inject(ParcelService);
  private location = inject(Location);
  createFormGroup: FormGroup;
  parcelId = '';

  constructor() {
    this.createFormGroup = new FormGroup({
      Id: new FormControl<string | null>({ value: null, disabled: true }),
      UnitNumber: new FormControl<string>('', [Validators.required]),
      PurchaserName: new FormControl<string>('', [Validators.required]),
      Email: new FormControl<string>('', [
        Validators.required,
        Validators.email,
      ]),
      ContactNumber: new FormControl<string>('', [
        Validators.required,
        Validators.pattern(PhoneNumberRegex),
      ]),
    });
  }

  SaveUpdateClick() {
    if (!ValidateForm(this.createFormGroup)) {
      return;
    }

    const parcelRequest = this.createFormGroup.value;

    const service = !this.parcelId
      ? this.parcelService.Create(parcelRequest as CreateParcelRequest)
      : this.parcelService.Update(parcelRequest as UpdateParcelRequest);
    service.subscribe((respond) => {
      this.CancelClick();
    });
  }

  CancelClick() {
    this.location.back();
  }
}
