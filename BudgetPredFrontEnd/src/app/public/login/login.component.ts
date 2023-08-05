import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  login() {
    this.authService.login(this.username, this.password).subscribe(
      (success) => {
        console.log(success);
        if (success) {
          this.router.navigate(['budgetHome/budgets']);
        } else {
          // The login failed.
          this.router.navigate(['/home/signup']);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
}