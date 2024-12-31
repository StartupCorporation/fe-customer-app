import { NgFor } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-landing-footer',
  templateUrl: './landing-footer.component.html',
  styleUrls: ['./landing-footer.component.scss'],
  imports: [NgFor]
})
export class LandingFooterComponent {
 
 phoneNumbers: string[] = ['+380 73 109 09 86', '+380 73 109 09 86'];

  footerLinks = [
    { label: 'Категорії', url: '/categories' },
    { label: 'Переваги', url: '/benefits' },
    { label: 'Контакти', url: '/contacts' }
  ];

  logoSrc = 'assets/images/deye-logo.png';
  logoAlt = 'Deye in Ukraine';
}
