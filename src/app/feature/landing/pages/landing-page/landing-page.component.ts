import { Component, OnInit } from '@angular/core';
import { LandingWelcomeWindowComponent } from "../../components/landing-welcome-window/landing-welcome-window.component";
import { LandingCategoriesComponent } from "../../components/landing-categories/landing-categories.component";
import { LandingAdvantagesComponent } from "../../components/landing-advantages/landing-advantages.component";
import { LandingContactsComponent } from "../../components/landing-contacts/landing-contacts.component";
import { LandingConsultingComponent } from "../../components/landing-consulting/landing-consulting.component";
import { LandingFooterComponent } from "../../components/landing-footer/landing-footer.component";

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
  imports: [LandingWelcomeWindowComponent, LandingCategoriesComponent, LandingAdvantagesComponent, LandingContactsComponent, LandingConsultingComponent, LandingFooterComponent]
})
export class LandingPageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
