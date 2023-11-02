import { CommonModule, Location } from '@angular/common';
import { Component, inject } from '@angular/core';
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
import { ToolbarModule } from 'primeng/toolbar';
import { ValidateForm, ValidateInvalidField } from 'src/app/core/utils/helpers';
import { ParcelService } from 'src/app/services/parcel.service';
import { PhoneNumberRegex } from 'src/app/shared/helpers/regex';
import {
  CreateParcelRequest,
  UpdateParcelRequest,
} from '../../models/parcel-no';

@Component({
  selector: 'app-save',
  standalone: true,
  imports: [
    CommonModule,
    ToolbarModule,
    CardModule,
    ReactiveFormsModule,
    FormsModule,
    DropdownModule,
    ButtonModule,
  ],
  templateUrl: './add-edit-parcel.component.html',
  styleUrls: ['./add-edit-parcel.component.less'],
})
export class AddEditParcelComponent {
  private parcelService = inject(ParcelService);
  private location = inject(Location);
  private messageService = inject(MessageService);
  private activatedRoute = inject(ActivatedRoute);

  createFormGroup: FormGroup;
  parcelId = '';
  isUpdate: boolean = false;
  Title = '';

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

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.params['id']) {
      this.parcelId = this.activatedRoute.snapshot.params['id'];
      this.Title = 'Update Parcel Number';
      this.isUpdate = true;
      this.LoadForm();
    } else {
      this.Title = 'Create Parcel Number';
      this.isUpdate = false;
      this.createFormGroup.get('Id')?.disable();
    }
  }

  LoadForm() {
    this.parcelService.GetById(this.parcelId).subscribe((x) => {
      this.createFormGroup.patchValue(x);
      console.log(x);
    });
    this.createFormGroup.get('Id')?.enable();
  }

  SaveUpdateClick() {
    let text: Set<string> = new Set();

    if (!ValidateForm(this.createFormGroup)) {
      const invalidField = ValidateInvalidField(this.createFormGroup);
      invalidField.forEach((res) => text.add(res));

      return this.messageService.add({
        severity: 'error',
        summary: 'Please fill up the form!',
        detail: '' + [...text],
      });
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
