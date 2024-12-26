import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'urlSanitaizer'
})
export class UrlSanitaizerPipe implements PipeTransform {

  constructor(private _sanitizer: DomSanitizer) { }

  transform(url: string): SafeHtml {
    return this._sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
