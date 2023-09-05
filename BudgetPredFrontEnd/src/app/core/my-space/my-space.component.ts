import { Component } from '@angular/core';
import { SpaceService } from '../services/space.service';
import { Item } from 'src/models/Item';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-my-space',
  templateUrl: './my-space.component.html',
  styleUrls: ['./my-space.component.css']
})

export class MySpaceComponent {

  forecast_savings:number = 0;
  forecast_expenses:number = 0;
  forecast_budget:number = 0;
  show_loading = false;
  show_items = false;
  currency = "";
  items:Item[] = []
  predictions: any[] = [];

  constructor(private spaceService: SpaceService) {}

  ngOnInit() {
    this.predictMonths();
    this.predictItems();
    this.predictYear();
    this.currency = localStorage.getItem('currency') || "EURO";
  }


  predictMonths() {
    this.show_items = true;
    const user_id = Number(localStorage.getItem('user_id'));
    this.spaceService.predictBudget(user_id).subscribe((data: any) => {
      this.forecast_budget = data.budget_prediction
      this.forecast_expenses = data.expenses_prediction
      this.forecast_savings = data.revenues_prediction
    }, error => {
      console.log(error);
    }, () => {
      this.show_items = false;
    } );
  }
 
  predictItems() {
    this.show_loading = true;
    const user_id = Number(localStorage.getItem('user_id'));
    this.spaceService.predictItems(user_id).subscribe((data: Item[]) => {
      // fix the budget photo
      data.forEach((item:Item) => {
        item.budgetphoto = environment.apiUrl + item.budgetphoto  
      } );
      this.items = data
    }, error => {
      console.log(error);
    }, () => {
      this.show_loading = false;
    }
    );
  }

  predictYear() {
    this.spaceService.predictBudgetYear(Number(localStorage.getItem('user_id'))).subscribe((data: any) => {
      this.predictions = data
    });
  }

}