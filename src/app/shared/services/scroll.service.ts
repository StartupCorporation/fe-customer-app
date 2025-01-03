// scroll.service.ts
import { Injectable, ElementRef } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  private targets: Map<string, ElementRef> = new Map();

  registerTarget(id: string, element: ElementRef) {
    this.targets.set(id, element);
  }

  scrollToTarget(id: string) {
    const targetElement = this.targets.get(id);
    if (targetElement) {
      const elementRect = targetElement.nativeElement.getBoundingClientRect();
      const scrollPosition =
        window.scrollY + elementRect.top - window.innerHeight / 2 + elementRect.height / 2;

      window.scrollTo({
        top: scrollPosition,
        behavior: 'smooth',
      });
    } else {
      console.warn(`Target with id '${id}' not found.`);
    }
  }
}
