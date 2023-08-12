import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreRoutingModule } from './core-routing.module';
import { HomeBudgetComponent } from './home/home.component';
import { HeaderBudgetComponent } from './header/header.component';
import { ProfileComponent } from './profile/profile.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ListBudgetsComponent } from './list-budgets/list-budgets.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { Interceptor } from '../interceptors/interceptor.service';

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
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RxReactiveFormsModule,
  ],
  exports : [
    HomeBudgetComponent
  ],
  providers: [
    // { provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true }
  ],
})

export class CoreModule { }
