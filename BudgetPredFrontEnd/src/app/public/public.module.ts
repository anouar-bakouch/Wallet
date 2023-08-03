import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { PublicRoutingModule } from './public-routing.module';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { InfosComponent } from './infos/infos.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    
    HeaderComponent,
    FooterComponent,
    InfosComponent,
    LoginComponent,
    SignUpComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  exports: [
    HomeComponent 
  ]
})

export class PublicModule { }
