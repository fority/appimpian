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
import { SelectOption } from 'src/app/core/models/sharedModels';
import { ValidateForm, ValidateInvalidField } from 'src/app/core/utils/helpers';
import { UserProfileService } from 'src/app/services/userProfile.service';
import {
  UpdateUserProfileRequest,
  UserProfileDto,
} from '../../models/userProfileModels';

@Component({
  selector: 'app-update',
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
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.less'],
})
export class UpdateComponent {
  private userProfileService = inject(UserProfileService);
  private location = inject(Location);
  private messageService = inject(MessageService);
  private activatedRoute = inject(ActivatedRoute);

  createFormGroup: FormGroup;
  user = {} as UserProfileDto;
  userRequest = {} as UpdateUserProfileRequest;
  userId = '';
  regionSelection = [] as SelectOption<string>[];

  constructor() {
    this.createFormGroup = new FormGroup({
      Id: new FormControl<string | null>({ value: null, disabled: true }),
      Name: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      PhoneNumber: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      Email: new FormControl<string>(''),
      Address: new FormControl<string>(''),
    });
  }

  LoadForm() {
    this.userProfileService.GetById(this.userId).subscribe((x) => {
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

    this.userProfileService
      .Update(this.createFormGroup.value)
      .subscribe((respond) => {
        this.CancelClick();
      });
  }

  CancelClick() {
    this.location.back();
  }

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.params['id']) {
      this.userId = this.activatedRoute.snapshot.params['id'];
      this.LoadForm();
    }
  }
}
