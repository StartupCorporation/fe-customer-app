import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { ScrollService } from 'src/app/shared/services/scroll.service';

@Component({
  selector: 'app-landing-footer',
  templateUrl: './landing-footer.component.html',
  styleUrls: ['./landing-footer.component.scss'],
  imports: [NgFor]
})
export class LandingFooterComponent {
 
  constructor(private scrollService: ScrollService) {}

 phoneNumbers: string[] = ['+380 73 109 09 86', '+380 63 410 42 47'];

  footerLinks = [
    { label: 'Категорії', url: 'categories' },
    { label: 'Переваги', url: 'advantages' },
    { label: 'Контакти', url: 'contacts' }
  ];

  logoSrc = 'assets/images/deye-logo.png';
  logoAlt = 'Deye in Ukraine';
  
  scrollTo(sectionId: string) {
    this.scrollService.scrollToTarget(sectionId);
  }
}
