import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreRoutingModule } from './core-routing.module';
import { HomeBudgetComponent } from './home/home.component';
import { HeaderBudgetComponent } from './header/header.component';
import { ProfileComponent } from './profile/profile.component';
import { HttpClientModule } from '@angular/common/http';
import { ListBudgetsComponent } from './list-budgets/list-budgets.component';



@NgModule({
  declarations: [
    HomeBudgetComponent,
    HeaderBudgetComponent,
    ProfileComponent,
    ListBudgetsComponent
  ],
  imports: [
  
    CoreRoutingModule,
    HttpClientModule,
    CommonModule
  ],
  exports : [
    HomeBudgetComponent
  ]
})

export class CoreModule { }
