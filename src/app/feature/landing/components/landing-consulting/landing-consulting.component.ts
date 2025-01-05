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
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.contactForm = this.fb.group({
      customer: this.fb.group({
        name: ['', Validators.required],
        phone: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
      }),
      comment: [''],
      contactMe: [false],
    });
  }

  get nameControl(): FormControl {
    return this.getControl('customer.name');
  }

  get phoneControl(): FormControl {
    return this.getControl('customer.phone');
  }

  get emailControl(): FormControl {
    return this.getControl('customer.email');
  }

  get commentControl(): FormControl {
    return this.getControl('comment');
  }

  get contactMeControl(): FormControl {
    return this.getControl('contactMe');
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    const formValue = this.contactForm.value;
    const consultingModel = ConsultingModel.fromJson({ ...formValue });

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
      new MessageModel(200, ['Запит прийнятий у обробку.'], MessageTypeEnum.Success)
    );
  }

  private handleError(errorResponse: any): void {
    const error = MessageModel.fromJson(errorResponse);
    this.messageService.addMessage(error);
  }

  private resetForm(): void {
    this.contactForm.reset({
      customer: {
        name: '',
        phone: '',
        email: '',
      },
      comment: '',
      contactMe: false,
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
