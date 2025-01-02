import { Component, OnInit } from '@angular/core';
import { LandingNavbarComponent } from "../landing-navbar/landing-navbar.component";

@Component({
  selector: 'app-landing-welcome-window',
  templateUrl: './landing-welcome-window.component.html',
  styleUrls: ['./landing-welcome-window.component.scss'],
  imports: [LandingNavbarComponent]
})
export class LandingWelcomeWindowComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
