import { Component } from '@angular/core';  // Importing the Component decorator from Angular's core module

@Component({   // Defining a new Angular component
  selector: 'app-spinner-loading',  // Associating the component with a custom HTML element 'app-spinner-loading'
  templateUrl: './spinner-loading.component.html',  // Specifying the path to the HTML template file for the component
  styleUrls: ['./spinner-loading.component.css']  // Specifying the path to the CSS stylesheet file for the component
})
export class SpinnerLoadingComponent {  // Exporting the component class with a name 'SpinnerLoadingComponent'

}
