import { Component, ElementRef, inject, Input, OnInit, ViewChild } from '@angular/core';
import { ButtonDirective } from '../../../../shared/directives/button.directive';
import { ScrollService } from 'src/app/shared/services/scroll.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-landing-navbar',
  templateUrl: './landing-navbar.component.html',
  styleUrls: ['./landing-navbar.component.scss'],
  imports:[AsyncPipe]
})
export class LandingNavbarComponent {
  private router = inject(Router);
  @Input() isHomePage$!: Observable<boolean>;

  constructor(private scrollService: ScrollService) {}
  
  scrollTo(sectionId: string) {
    this.scrollService.scrollToTarget(sectionId);
  }

  navigateToHome() {
    this.router.navigate(['/home']);
  }

}
