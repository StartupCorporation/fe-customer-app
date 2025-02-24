import { Component } from '@angular/core';
import { ShellComponent } from './core/components/shell/shell.component';
import { MatIconRegistry } from '@angular/material/icon';
import { inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-root',
  imports: [ShellComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'fe-customer-app';

  icons: Record<string, string> = {
    search: 'assets/icons/search.svg',
  };


  
}
