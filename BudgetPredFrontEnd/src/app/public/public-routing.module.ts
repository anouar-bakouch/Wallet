import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { InfosComponent } from "./infos/infos.component";
import { LoginComponent } from "./login/login.component";
import { SignUpComponent } from "./sign-up/sign-up.component";


const routes: Routes = [
    {
        path: "home",
        redirectTo: "home/infos",
        pathMatch: "full"
    },
    {
        path: "home",
        component: HomeComponent,
        children: [
            { 
                path: "infos",
                component: InfosComponent
            },
            {
                path : "login",
                component : LoginComponent
            },
            {
                path : "signup",
                component : SignUpComponent
            }

        ]
    }
 
    ]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class PublicRoutingModule {}