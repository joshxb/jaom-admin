import { Component, OnInit } from '@angular/core'; // Importing the Component and OnInit classes from Angular core
import { ActivatedRoute, Router } from '@angular/router'; // Importing ActivatedRoute and Router for navigation
import { AuthService } from '../configuration/services/auth.service'; // Importing AuthService for token management

@Component({ // Defining the component
  selector: 'app-process-login',
  templateUrl: './process-login.component.html',
  styleUrls: ['./process-login.component.css'],
})
export class ProcessLoginComponent implements OnInit { // Implementing OnInit interface

  constructor( // Injecting required services
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void { // Implementing the OnInit lifecycle hook
    // Retrieve tokenData query parameter from the URL
    const tokenData = this.route.snapshot.queryParamMap.get('redirect-token');

    if (tokenData) { // If tokenData exists
      // Decode the base64-encoded string and parse as JSON
      const decodedTokenData = JSON.parse(atob(tokenData));
      this.authService.setToken(decodedTokenData); // Set the token using the AuthService

      setTimeout(() => { // Wait for 2 seconds before navigating
        this.router.navigate(['/']); // Navigate to the home page
      }, 2000);
    }
  }
}
