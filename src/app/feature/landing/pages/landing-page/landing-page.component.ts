import { Component, OnInit } from '@angular/core';
import { LandingWelcomeWindowComponent } from "../../components/landing-welcome-window/landing-welcome-window.component";
import { LandingCategoriesComponent } from "../../components/landing-categories/landing-categories.component";

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
  imports: [LandingWelcomeWindowComponent, LandingCategoriesComponent]
})
export class LandingPageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
