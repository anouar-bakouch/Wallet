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

  public photoPath = '';

  constructor(public authService:AuthService,
  ) {

    const id = Number(localStorage.getItem('user_id'));
    this.authService.getUserInfo(id).forEach((data:any) => {
      this.user = data.user;
      // fix the image path 
      this.photoPath = `${environment.apiUrl}/${this.user?.path_photo}`;
      console.log(data.user)
    }
    );

   }

  onLogout(){
    this.authService.logout();
  }

  ngOnInit(): void {
  
    console.log(this.photoPath)
  }

  


 
}
