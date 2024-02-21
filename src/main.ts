/// <reference types="@angular/localize" />

// Import the necessary modules and components from Angular
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

// Use the platformBrowserDynamic() method to bootstrap the AppModule
// This will render the application to the browser
platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));
