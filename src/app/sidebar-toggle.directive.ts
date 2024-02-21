import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

// The SidebarToggleDirective is a directive that can be applied to elements in the template
// with the selector [appSidebarToggle]. When the element is clicked, it will add the 'active' class
// to the sidebar element.
@Directive({
  selector: '[appSidebarToggle]'
})
export class SidebarToggleDirective {
  
  // Inject the ElementRef and Renderer2 services into the constructor
  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  // Add a HostListener to listen for click events on the element
  @HostListener('click')
  onClick() {
    
    // Get a reference to the sidebar element
    const sidebar = this.elementRef.nativeElement.querySelector('#sidebar');

    // If the sidebar element exists
    if (sidebar) {
      
      // Use the Renderer2 service to add the 'active' class to the sidebar element
      this.renderer.addClass(sidebar, 'active');
    }
  }
}
,
