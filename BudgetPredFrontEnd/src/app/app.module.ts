import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PublicModule } from './public/public.module';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { CartComponent } from './core/cart/cart.component';
import { CoreFooterComponent } from './core/core-footer/core-footer.component';


@NgModule({
  declarations: [
    AppComponent,
    CartComponent,
    CoreFooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    PublicModule,
    CoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
