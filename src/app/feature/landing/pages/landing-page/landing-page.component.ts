import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LandingWelcomeWindowComponent } from "../../components/landing-welcome-window/landing-welcome-window.component";
import { LandingCategoriesComponent } from "../../components/landing-categories/landing-categories.component";
import { LandingAdvantagesComponent } from "../../components/landing-advantages/landing-advantages.component";
import { LandingContactsComponent } from "../../components/landing-contacts/landing-contacts.component";
import { LandingConsultingComponent } from "../../components/landing-consulting/landing-consulting.component";
import { LandingFooterComponent } from "../../components/landing-footer/landing-footer.component";
import { ScrollService } from 'src/app/shared/services/scroll.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
  imports: [LandingWelcomeWindowComponent, LandingCategoriesComponent, LandingAdvantagesComponent, LandingContactsComponent, LandingConsultingComponent, LandingFooterComponent]
})
export class LandingPageComponent implements AfterViewInit {
  
  @ViewChild('categories') categoriesSection!: ElementRef;
  @ViewChild('advantages') advantagesSection!: ElementRef;
  @ViewChild('contacts') contactsSection!: ElementRef;
  @ViewChild('consulting') consultingSection!: ElementRef;

  constructor(private scrollService: ScrollService) {}

  ngAfterViewInit() {
    this.scrollService.registerTarget('categories', this.categoriesSection);
    this.scrollService.registerTarget('advantages', this.advantagesSection);
    this.scrollService.registerTarget('contacts', this.contactsSection);
    this.scrollService.registerTarget('consulting', this.consultingSection);
  }

}
