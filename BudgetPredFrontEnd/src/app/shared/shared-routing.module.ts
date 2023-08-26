import { RouterModule, Routes } from "@angular/router";
import { InvalidComponent } from "./invalid/invalid.component";
import { NgModule } from "@angular/core";

const routes:Routes = [
    {
        path: "**",
        component: InvalidComponent
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class SharedRoutingModule {}
