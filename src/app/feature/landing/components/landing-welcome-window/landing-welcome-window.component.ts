import { Component, OnInit } from '@angular/core';
import { LandingNavbarComponent } from "../landing-navbar/landing-navbar.component";
import { ScrollService } from 'src/app/shared/services/scroll.service';

@Component({
  selector: 'app-landing-welcome-window',
  templateUrl: './landing-welcome-window.component.html',
  styleUrls: ['./landing-welcome-window.component.scss'],
  imports: [LandingNavbarComponent]
})
export class LandingWelcomeWindowComponent implements OnInit {

  constructor(private scrollService: ScrollService) {}

  ngOnInit() {
  }

  scrollTo(sectionId: string) {
    this.scrollService.scrollToTarget(sectionId);
  }

}
