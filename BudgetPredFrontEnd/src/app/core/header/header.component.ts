import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';
import { User } from 'src/models/User';

@Component({
  selector: '[app-budget-header]',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})


export class HeaderBudgetComponent {

  public user :User | undefined;

  photoPath = '';

  constructor(public authService:AuthService) { }

  onLogout(){
    this.authService.logout();
  }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {

      this.user = user;
      console.log(this.user);
      this.photoPath = environment.apiUrl + this.user?.pathPhoto;
      console.log(this.photoPath);

    }
    );
  }

  


 
}
