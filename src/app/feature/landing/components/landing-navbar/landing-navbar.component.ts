import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { ButtonDirective } from '../../../../shared/directives/button.directive';
import { ScrollService } from 'src/app/shared/services/scroll.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-navbar',
  templateUrl: './landing-navbar.component.html',
  styleUrls: ['./landing-navbar.component.scss']
})
export class LandingNavbarComponent {
  private router = inject(Router);

  constructor(private scrollService: ScrollService) {}
  
  scrollTo(sectionId: string) {
    this.scrollService.scrollToTarget(sectionId);
  }

  navigateToHome() {
    this.router.navigate(['/home']);
  }

}
