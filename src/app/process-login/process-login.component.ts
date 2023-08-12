import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../configuration/services/auth.service';

@Component({
  selector: 'app-process-login',
  templateUrl: './process-login.component.html',
  styleUrls: ['./process-login.component.css'],
})
export class ProcessLoginComponent implements OnInit {
  constructor(private route: ActivatedRoute,private authService: AuthService,  private router: Router) {}

  ngOnInit(): void {
    // Retrieve tokenData query parameter from the URL
    const tokenData = this.route.snapshot.queryParamMap.get('redirect-token');

    if (tokenData) {
      // Decode the base64-encoded string and parse as JSON
      const decodedTokenData = JSON.parse(atob(tokenData));
      this.authService.setToken(decodedTokenData);

      setTimeout(() => {
        this.router.navigate(['/']);
      }, 2000);
    }
  }
}
