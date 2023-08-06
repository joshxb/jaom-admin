import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appSidebarToggle]'
})
export class SidebarToggleDirective {

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  @HostListener('click')
  onClick() {
    const sidebar = this.elementRef.nativeElement.querySelector('#sidebar');

    if (sidebar) {
      this.renderer.addClass(sidebar, 'active');
    }
  }
}
