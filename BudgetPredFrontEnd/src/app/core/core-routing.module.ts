import { RouterModule, Routes } from "@angular/router";
import { HomeBudgetComponent} from "./home/home.component";
import { ListBudgetsComponent } from "./list-budgets/list-budgets.component";
import { NgModule } from "@angular/core";
import { ProfileComponent } from "./profile/profile.component";
import { StatsComponent } from "./stats/stats.component";
import { CartComponent } from "./cart/cart.component";
import { MySpaceComponent } from "./my-space/my-space.component";
import { MyPurchasesComponent } from "./my-purchases/my-purchases.component";


const routes:Routes = [
    {
        path: "budgetHome",
        redirectTo: "budgetHome/budgets",
        pathMatch: "full"
    },
    {
        path: "budgetHome",
        component: HomeBudgetComponent, 
        children: [
            {
                path: "budgets",
                component : ListBudgetsComponent 
            },
            {
                path: "profile",
                component : ProfileComponent 
            },
            {
                path: "stats",
                component : StatsComponent
            },
            {
                path:"cart",
                component : CartComponent
            },
            {
                path: "mySpace",
                component : MySpaceComponent
            },
            {
                path : "myPurchases",
                component : MyPurchasesComponent
            }

        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class CoreRoutingModule {}
