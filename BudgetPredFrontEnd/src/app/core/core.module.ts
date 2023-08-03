import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreRoutingModule } from './core-routing.module';
import { HomeBudgetComponent } from './home/home.component';
import { HeaderBudgetComponent } from './header/header.component';
import { ProfileComponent } from './profile/profile.component';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [
    HomeBudgetComponent,
    HeaderBudgetComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    CoreRoutingModule,
    HttpClientModule
  ],
  exports : [
    HomeBudgetComponent
  ]
})
export class CoreModule { }
