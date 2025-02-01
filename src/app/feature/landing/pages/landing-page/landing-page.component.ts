import { AsyncPipe, NgIf } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { LandingWelcomeWindowComponent } from '../../components/landing-welcome-window/landing-welcome-window.component';
import { LandingCategoriesComponent } from '../../components/landing-categories/landing-categories.component';
import { LandingAdvantagesComponent } from '../../components/landing-advantages/landing-advantages.component';
import { LandingContactsComponent } from '../../components/landing-contacts/landing-contacts.component';
import { LandingConsultingComponent } from '../../components/landing-consulting/landing-consulting.component';
import { LandingFooterComponent } from '../../components/landing-footer/landing-footer.component';
import { ScrollService } from 'src/app/shared/services/scroll.service';
import { ToastComponent } from 'src/app/shared/components/toast/toast.component';
import { MessageModel } from 'src/app/shared/models/message-model';
import { MessageTypeEnum } from 'src/app/shared/enums/message-type-enum';
import { Observable } from 'rxjs';
import { MessageService } from 'src/app/core/services/message.service';
import { SafeArrayPipe } from 'src/app/shared/pipes/safeArray.pipe';
import { LandingNavbarComponent } from "../../components/landing-navbar/landing-navbar.component";

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
  imports: [
    LandingWelcomeWindowComponent,
    LandingCategoriesComponent,
    LandingAdvantagesComponent,
    LandingContactsComponent,
    LandingConsultingComponent,
    LandingFooterComponent,
    ToastComponent,
    NgIf,
    AsyncPipe,
    SafeArrayPipe,
    LandingNavbarComponent
],
})
export class LandingPageComponent implements OnInit, AfterViewInit {
  $messages!: Observable<MessageModel[]>;

  @ViewChild('categories') categoriesSection!: ElementRef;
  @ViewChild('advantages') advantagesSection!: ElementRef;
  @ViewChild('contacts') contactsSection!: ElementRef;
  @ViewChild('consulting') consultingSection!: ElementRef;

  constructor(private scrollService: ScrollService, private messageService: MessageService) {}

  ngOnInit() {
    this.$messages = this.messageService.getMessages();
  }

  ngAfterViewInit() {
    this.scrollService.registerTarget('categories', this.categoriesSection);
    this.scrollService.registerTarget('advantages', this.advantagesSection);
    this.scrollService.registerTarget('contacts', this.contactsSection);
    this.scrollService.registerTarget('consulting', this.consultingSection);
  }

  deleteMessages() {
    this.messageService.deleteAllMessages();
  }
}
