import { ConsultingService } from './../../services/consulting.service';
import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { ConsultingModel } from '../../models/consulting.model';
import { catchError, of } from 'rxjs';
import { MessageModel } from 'src/app/shared/models/message-model';
import { MessageService } from 'src/app/core/services/message.service';
import { MessageTypeEnum } from 'src/app/shared/enums/message-type-enum';

@Component({
  selector: 'app-landing-consulting',
  templateUrl: './landing-consulting.component.html',
  styleUrls: ['./landing-consulting.component.scss'],
  imports: [ReactiveFormsModule, FormsModule, NgIf],
})
export class LandingConsultingComponent implements OnInit {
  contactForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private consultingService: ConsultingService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.contactForm = this.fb.group({
      personalInformation: this.fb.group({
        name: ['', Validators.required],
        phoneNumber: [
          '',
          {
            validators: [
              Validators.required,
              Validators.pattern('^[- +()0-9]+$'),
            ],
          }
        ],
        email: ['', [Validators.required, Validators.email]]
      }),
      customerNote: [''],
      messageCustomer: [false],
    });
  }

  get nameControl(): FormControl {
    return this.getControl('personalInformation.name');
  }

  get phoneControl(): FormControl {
    return this.getControl('personalInformation.phoneNumber');
  }
  
  get emailControl(): FormControl {
    return this.getControl('personalInformation.email');
  }

  get commentControl(): FormControl {
    return this.getControl('customerNote');
  }

  get messageMeControl(): FormControl {
    return this.getControl('messageCustomer');
  }

  onPhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    this.phoneControl.setValue(value, { emitEvent: false });
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    const formValue = { ...this.contactForm.value };
    formValue.personalInformation.phoneNumber = formValue.personalInformation.phoneNumber.replace(/\s+/g, '');
    
    if (formValue.personalInformation.phoneNumber && !formValue.personalInformation.phoneNumber.startsWith('+')) {
      formValue.personalInformation.phoneNumber = '+' + formValue.personalInformation.phoneNumber;
    }

    const consultingModel = ConsultingModel.fromJson(formValue);

    this.createConsultingRequest(consultingModel);
  }

  private createConsultingRequest(consultingModel: ConsultingModel): void {
    this.consultingService
      .createConsultingRequest(consultingModel)
      .pipe(
        catchError((errorResponse) => {
          this.handleError(errorResponse);
          return of(null);
        })
      )
      .subscribe((response) => {
        if (response) {
          this.handleSuccess(response);
          this.resetForm();
        }
      });
  }

  private handleSuccess(consulting: ConsultingModel): void {
    this.messageService.addMessage(
      new MessageModel(
        200,
        ['Запит прийнятий у обробку.'],
        MessageTypeEnum.Success
      )
    );
  }

  private handleError(errorResponse: any): void {
    const error = MessageModel.fromJson(errorResponse);
    this.messageService.addMessage(error);
  }

  private resetForm(): void {
    this.contactForm.reset({
      personalInformation: {
        name: '',
        phoneNumber: '',
        email: ''
      },
      customerNote: '',
      messageCustomer: false,
    });
  }

  private getControl(path: string): FormControl {
    const control = this.contactForm.get(path);
    if (!control) {
      throw new Error(
        `Control with path "${path}" not found in the form group.`
      );
    }
    return control as FormControl;
  }
}
