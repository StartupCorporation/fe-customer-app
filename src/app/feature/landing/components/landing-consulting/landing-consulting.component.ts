import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {ReactiveFormsModule,FormsModule, FormBuilder, FormGroup, Validators} from '@angular/forms'

@Component({
  selector: 'app-landing-consulting',
  templateUrl: './landing-consulting.component.html',
  styleUrls: ['./landing-consulting.component.scss'],
  imports: [ReactiveFormsModule,FormsModule, NgIf]
})
export class LandingConsultingComponent implements OnInit {

  contactForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.email]],
      comment: [''],
      contactByMessenger: [false]
    });
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.contactForm.reset();
    } else {
      this.contactForm.markAllAsTouched();
    }
  }
}
