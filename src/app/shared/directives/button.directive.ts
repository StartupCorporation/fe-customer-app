import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

type ButtonVariant = 'primary' | 'secondary';

@Directive({
 selector: '[appButton]',
 standalone: true,
 host: {
   '[class.button]': 'true'
 }
})
export class ButtonDirective implements OnInit {
 @Input() variant: ButtonVariant = 'primary';

 constructor(
   private readonly elementRef: ElementRef<HTMLElement>,
   private readonly renderer: Renderer2
 ) {}

 ngOnInit(): void {
   this.setButtonVariant();
 }

 private setButtonVariant(): void {
   const variantClass = `button--${this.variant}`;
   this.renderer.addClass(this.elementRef.nativeElement, variantClass);
 }
}