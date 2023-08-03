import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { PublicRoutingModule } from './public-routing.module';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { InfosComponent } from './infos/infos.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';


@NgModule({
  declarations: [
    HomeComponent ,
    HeaderComponent,
    FooterComponent,
    InfosComponent,
    LoginComponent,
    SignUpComponent
  ],
  imports: [
    CommonModule,
    PublicRoutingModule
  ],
  exports: [
    HomeComponent 
  ]
})

export class PublicModule { }
