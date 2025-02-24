import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  PLATFORM_ID,
  inject,
  input,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-icon-mat',
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
  imports: [MatIcon],
})
export class IconComponent {
  public iconName = input<string>();

  private readonly platformId = inject(PLATFORM_ID);
  public isBrowser: boolean;

  public constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
}
