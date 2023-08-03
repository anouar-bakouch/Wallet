import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PublicModule } from './public/public.module';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { HeaderComponent } from './core/header/header.component';
import { ListBudgetsComponent } from './list-budgets/list-budgets.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ListBudgetsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PublicModule,
    SharedModule,
    CoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
