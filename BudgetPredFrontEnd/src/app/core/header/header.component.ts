import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { TokenStorageService } from 'src/app/auth/token-storage.service';
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

  constructor(public authService:AuthService,
    private tokenStorage:TokenStorageService) { }

  onLogout(){
    this.authService.logout();
  }

  ngOnInit(): void {
    
    this.user = this.tokenStorage.getUser();
    console.log(this.photoPath)
  }

  


 
}
