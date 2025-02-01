import { Component, inject, OnInit } from '@angular/core';
import { LandingNavbarComponent } from "../landing-navbar/landing-navbar.component";
import { ScrollService } from 'src/app/shared/services/scroll.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-landing-welcome-window',
  templateUrl: './landing-welcome-window.component.html',
  styleUrls: ['./landing-welcome-window.component.scss'],
  imports: [LandingNavbarComponent, AsyncPipe]
})
export class LandingWelcomeWindowComponent implements OnInit {
  private router = inject(Router);
  private scrollService = inject(ScrollService);

  public isHomePage$ = this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    map(() => {
      return this.router.url.includes('/home');
    }),
    startWith(this.router.url.includes('/home'))
  );

  ngOnInit() {
  }

  scrollTo(sectionId: string) {
    this.scrollService.scrollToTarget(sectionId);
  }

}
