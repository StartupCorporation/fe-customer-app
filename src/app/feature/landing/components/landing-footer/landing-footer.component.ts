import { NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ScrollService } from 'src/app/shared/services/scroll.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-footer',
  templateUrl: './landing-footer.component.html',
  styleUrls: ['./landing-footer.component.scss'],
  imports: [NgFor]
})
export class LandingFooterComponent {
  private router = inject(Router);
  constructor(private scrollService: ScrollService) {}

  phoneNumbers: string[] = ['+380 67 718 37 74', '+380 63 410 42 47'];

  footerLinks = [
    { label: 'Категорії', url: 'categories' },
    { label: 'Переваги', url: 'advantages' },
    { label: 'Контакти', url: 'contacts' }
  ];

  logoSrc = 'assets/images/deye-logo.png';
  logoAlt = 'Deye in Ukraine';
  
  scrollTo(sectionId: string) {
    // Check if we're on the home page by looking at the URL
    const isHomePage = this.router.url === '/home' || this.router.url === '/';
    
    if (isHomePage) {
      // Already on home page, just scroll
      this.scrollService.scrollToTarget(sectionId);
    } else {
      // Navigate to home page first, then scroll after navigation completes
      this.router.navigate(['/home']).then(() => {
        // Use setTimeout to ensure the DOM has updated after navigation
        setTimeout(() => {
          this.scrollService.scrollToTarget(sectionId);
        }, 100);
      });
    }
  }
}
